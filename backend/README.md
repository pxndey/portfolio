# Minimal Go Backend Service

A lightweight HTTP API that acts as a secure intermediary between the frontend and external resources.

## Features

- **Music Dashboard Aggregation**: Combines multiple Last.fm API calls (user info, top artists, top tags, top tracks) into a single endpoint
- **Last.fm Integration**: Proxies requests to Last.fm API to fetch weekly track charts
- **Audio Streaming**: Serves audio file metadata and streams audio files
- **Environment-Based Configuration**: API keys and credentials stored securely in `.env` file
- **CORS Enabled**: Cross-Origin Resource Sharing configured for frontend access
- **Minimal Dependencies**: Uses only Go's standard library and godotenv for .env support

## Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
LASTFM_API_KEY=your_actual_api_key
LASTFM_USERNAME=your_lastfm_username
PORT=8080
```

3. Install dependencies:
```bash
go mod download
```

4. Run the server:
```bash
go run main.go
```

## API Endpoints

### GET /music
Aggregates multiple Last.fm API calls into a single response for the music dashboard.

**Fetches**:
- User information (`user.getInfo`)
- Top artists for the last 7 days (`user.getTopArtists`)
- Top tags/genres (`user.getTopTags`)
- Top tracks for the last 7 days (`user.getTopTracks`)

**Response**: Combined JSON containing all music data.

### GET /lastfm
Fetches weekly track chart from Last.fm API using `user.getWeeklyTrackChart` method.

**Response**: Returns the Last.fm API response unchanged.

### GET /audio
Returns JSON containing audio file metadata.

**Response**:
```json
{
  "filename": "Tame Impala - My Old Ways.mp3",
  "url": "/audio/file"
}
```

### GET /audio/file
Streams the audio file.

**Response**: Audio file stream with `Content-Type: audio/mpeg`

## Project Structure

```
backend/
├── main.go           # Main server code
├── go.mod            # Go module definition
├── .env              # Environment variables (gitignored)
├── .env.example      # Example environment configuration
└── audio/            # Audio files directory
```

## Notes

- This service acts as a proxy layer to keep API keys secure and never expose them to the frontend
- Responses from third-party APIs are returned unchanged (no transformation or filtering)
- The design is intentionally minimal and functional
