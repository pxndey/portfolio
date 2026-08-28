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
	"sync"
	"time"

	"github.com/joho/godotenv"
)

// Audio info struct
type AudioData struct {
	Filename string `json:"filename"`
	URL      string `json:"url"`
}

// Status check result
type StatusItem struct {
	Name     string `json:"name"`
	URL      string `json:"url"`
	Up       bool   `json:"up"`
	Status   int    `json:"status"`
	LatencyMS int64 `json:"latencyMS"`
	Error    string `json:"error,omitempty"`
	CheckedAt string `json:"checkedAt"`
}

// checkURL performs an HTTP GET with a short timeout and returns the result
func checkURL(name, target string) StatusItem {
	result := StatusItem{Name: name, URL: target, CheckedAt: time.Now().UTC().Format(time.RFC3339)}

	client := &http.Client{Timeout: 5 * time.Second}
	start := time.Now()

	resp, err := client.Get(target)
	latency := time.Since(start).Milliseconds()
	result.LatencyMS = latency

	if err != nil {
		result.Error = err.Error()
		return result
	}
	defer resp.Body.Close()

	result.Status = resp.StatusCode
	result.Up = resp.StatusCode >= 200 && resp.StatusCode < 400
	return result
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

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

// loggingMiddleware logs all HTTP requests with method, path, status, and duration
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(lrw, r)
		duration := time.Since(start)
		log.Printf("[%s] %s %s - %d - %v", r.Method, r.URL.Path, r.RemoteAddr, lrw.statusCode, duration)
	})
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
		log.Printf("Fetching random audio file")
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
		log.Printf("Fetching Last.fm music data for user: %s", lastfmUsername)
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

	// Route 4b: /status - check liveness of monitored services
	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		targets := r.URL.Query().Get("url")
		log.Printf("Checking status for targets: %s", targets)
		if targets == "" {
			http.Error(w, "Missing 'url' query param (comma-separated urls=name|url)", 400)
			return
		}

		// Parse "name|url,name|url"
		pairs := strings.Split(targets, ",")
		results := make([]StatusItem, len(pairs))
		var wg sync.WaitGroup

		for i, pair := range pairs {
			pair = strings.TrimSpace(pair)
			if pair == "" {
				continue
			}
			parts := strings.SplitN(pair, "|", 2)
			name := parts[0]
			target := parts[0]
			if len(parts) == 2 {
				name = parts[0]
				target = parts[1]
			}

			// The frontend URL-encodes each field; undo it here.
			if decoded, err := url.QueryUnescape(name); err == nil {
				name = decoded
			}
			if decoded, err := url.QueryUnescape(target); err == nil {
				target = decoded
			}

			wg.Add(1)
			go func(i int, name, target string) {
				defer wg.Done()
				results[i] = checkURL(name, target)
			}(i, name, target)
		}

		wg.Wait()

		// Drop empty entries from blank pairs
		filtered := results[:0]
		for _, res := range results {
			if res.URL != "" {
				filtered = append(filtered, res)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"checkedAt": time.Now().UTC().Format(time.RFC3339),
			"services":  results,
		})
	})

	fmt.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, loggingMiddleware(corsMiddleware(http.DefaultServeMux))))
}
