package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Audio info struct
type AudioData struct {
	Filename string `json:"filename"`
	URL      string `json:"url"`
}

// Helper function to fetch data from Last.fm API
func fetchLastFmAPI(baseURL string, params map[string]string) (map[string]interface{}, error) {
	urlParams := url.Values{}
	for key, value := range params {
		urlParams.Add(key, value)
	}

	apiURL := baseURL + "?" + urlParams.Encode()

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return result, nil
}

// CORS middleware to enable cross-origin requests from frontend
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Get configuration from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	lastfmAPIKey := os.Getenv("LASTFM_API_KEY")
	lastfmUsername := os.Getenv("LASTFM_USERNAME")

	// Route 1: /audio - return JSON with filename and URL
	http.HandleFunc("/audio", func(w http.ResponseWriter, r *http.Request) {
		audioDir := "audio"

		// Read all files from audio directory
		files, err := os.ReadDir(audioDir)
		if err != nil {
			http.Error(w, "Failed to read audio directory", 500)
			return
		}

		// Filter for .mp3 files
		var mp3Files []string
		for _, file := range files {
			if !file.IsDir() && strings.HasSuffix(strings.ToLower(file.Name()), ".mp3") {
				mp3Files = append(mp3Files, file.Name())
			}
		}

		if len(mp3Files) == 0 {
			http.Error(w, "No audio files found", 404)
			return
		}

		// Pick a random song
		rand.Seed(time.Now().UnixNano())
		randomIndex := rand.Intn(len(mp3Files))
		audioFile := mp3Files[randomIndex]

		// JSON response
		data := AudioData{
			Filename: audioFile,
			URL:      "/audio/file?filename=" + url.QueryEscape(audioFile),
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	// Route 2: /audio/file - stream the audio file
	http.HandleFunc("/audio/file", func(w http.ResponseWriter, r *http.Request) {
		filename := r.URL.Query().Get("filename")
		if filename == "" {
			http.Error(w, "Missing filename parameter", 400)
			return
		}

		// Sanitize filename to prevent directory traversal
		filename = filepath.Base(filename)
		if !strings.HasSuffix(strings.ToLower(filename), ".mp3") {
			http.Error(w, "Invalid file type", 400)
			return
		}

		audioPath := filepath.Join("audio", filename)

		// Check if file exists
		if _, err := os.Stat(audioPath); os.IsNotExist(err) {
			http.Error(w, "Audio file not found", 404)
			return
		}

		// Set proper content type for audio
		w.Header().Set("Content-Type", "audio/mpeg")
		http.ServeFile(w, r, audioPath)
	})

	// Route 3: /lastfm - proxy to Last.fm API (deprecated, kept for compatibility)
	http.HandleFunc("/lastfm", func(w http.ResponseWriter, r *http.Request) {
		if lastfmAPIKey == "" || lastfmUsername == "" {
			http.Error(w, "Last.fm API configuration missing", 500)
			return
		}

		// Build Last.fm API URL
		baseURL := "http://ws.audioscrobbler.com/2.0/"
		params := url.Values{}
		params.Add("method", "user.getWeeklyTrackChart")
		params.Add("user", lastfmUsername)
		params.Add("api_key", lastfmAPIKey)
		params.Add("format", "json")

		apiURL := baseURL + "?" + params.Encode()

		// Fetch from Last.fm
		resp, err := http.Get(apiURL)
		if err != nil {
			http.Error(w, "Failed to fetch Last.fm data", 500)
			return
		}
		defer resp.Body.Close()

		// Read response body
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read Last.fm response", 500)
			return
		}

		// Return Last.fm response unchanged to frontend
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		w.Write(body)
	})

	// Route 4: /music - aggregated music data endpoint
	http.HandleFunc("/music", func(w http.ResponseWriter, r *http.Request) {
		if lastfmAPIKey == "" || lastfmUsername == "" {
			http.Error(w, "Last.fm API configuration missing", 500)
			return
		}

		baseURL := "http://ws.audioscrobbler.com/2.0/"

		// Fetch user info
		userInfo, err := fetchLastFmAPI(baseURL, map[string]string{
			"method":  "user.getInfo",
			"user":    lastfmUsername,
			"api_key": lastfmAPIKey,
			"format":  "json",
		})
		if err != nil {
			http.Error(w, "Failed to fetch user info", 500)
			return
		}

		// Fetch top artists
		topArtists, err := fetchLastFmAPI(baseURL, map[string]string{
			"method":  "user.getTopArtists",
			"user":    lastfmUsername,
			"api_key": lastfmAPIKey,
			"format":  "json",
			"limit":   "10",
			"period":  "overall",
		})
		if err != nil {
			http.Error(w, "Failed to fetch top artists", 500)
			return
		}

		// Fetch recent tracks
		recentTracks, err := fetchLastFmAPI(baseURL, map[string]string{
			"method":  "user.getRecentTracks",
			"user":    lastfmUsername,
			"api_key": lastfmAPIKey,
			"format":  "json",
			"limit":   "1",
		})
		if err != nil {
			http.Error(w, "Failed to fetch recent tracks", 500)
			return
		}

		// Fetch top tracks
		topTracks, err := fetchLastFmAPI(baseURL, map[string]string{
			"method":  "user.getTopTracks",
			"user":    lastfmUsername,
			"api_key": lastfmAPIKey,
			"format":  "json",
			"limit":   "10",
			"period":  "overall",
		})
		if err != nil {
			http.Error(w, "Failed to fetch top tracks", 500)
			return
		}

		// Combine all data
		aggregatedData := map[string]interface{}{
			"userInfo":     userInfo,
			"topArtists":   topArtists,
			"recentTracks": recentTracks,
			"topTracks":    topTracks,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(aggregatedData)
	})

	fmt.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(http.DefaultServeMux)))
}
