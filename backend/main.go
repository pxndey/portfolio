package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// Audio info struct
type AudioData struct {
	Filename string `json:"filename"`
	URL      string `json:"url"`
}

func main() {
	// Route 1: return JSON with filename and URL
	http.HandleFunc("/music", func(w http.ResponseWriter, r *http.Request) {
		audioFile := "sample.mp3"
		audioPath := "audio/" + audioFile

		// Check if file exists
		if _, err := os.Stat(audioPath); os.IsNotExist(err) {
			http.Error(w, "Audio file not found.", 404)
			return
		}

		// JSON response
		data := AudioData{
			Filename: audioFile,
			URL:      "/audio/file",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	// Route 2: actually serve the audio file
	http.HandleFunc("/audio/file", func(w http.ResponseWriter, r *http.Request) {
		audioPath := "audio/sample.mp3"

		// Set proper content type for audio
		w.Header().Set("Content-Type", "audio/mpeg")
		http.ServeFile(w, r, audioPath)
	})

	// Route 3: dummy Last.fm data
	http.HandleFunc("/lastfm", func(w http.ResponseWriter, r *http.Request) {
		data := map[string]interface{}{
			"user":          "someuser",
			"recent_tracks": []string{"Song A", "Song B", "Song C"},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	fmt.Println("Server running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
