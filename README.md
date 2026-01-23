# portfolio

My personal portfolio site, react and Go (a backend because i wanted to serve music, and i dont want my LastFM API key in public lol)

## Project Structure

```
portfolio/
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/        # Home, Music, Academics, Projects, etc.
│   │   ├── components/   # Sidebar, MusicPlayer, etc.
│   │   ├── data/         # Generated from TOML files
│   │   └── types/        # TypeScript types
│   └── package.json
├── backend/              # Go API server
│   ├── main.go          # All the server logic
│   ├── audio/           # Audio files for the player
│   └── README.md
├── audio/               # Shared audio directory
├── deploy.sh            # Deployment to my server
└── sync_audio.sh        # Syncs audio files
```

- **Dynamic Theming**: F1 Team Themed Colors 
- **Music Integration**: Live Last.fm stats, weekly charts, top artists
- **Audio Player**: Embedded player that streams from the Go backend
- **Data-Driven**: All content generated from structured TOML files
- **Responsive**: Works on mobile (tested on my phone, mostly)

## Deployment
I deploy to my "server" (yes, the MacBook Air) using rsync:

```bash
./deploy.sh
```

I also add new songs to the backend using rsync (again):
```bash
./sync_audio.sh
```

(god bless tailscale and [Cloudflared](https://github.com/cloudflare/cloudflared))

