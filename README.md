# portfolio

My personal portfolio site, react and Go (a backend because i wanted to serve music, and i dont want my LastFM API key in public lol), hosted on [the laptop that got me through undergrad](https://pxndey.com/misc)

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
- **Race Countdown**: Race countdowns for Formula 1, MotoGP, and WEC's upcoming races
- **Data-Driven**: All content generated from structured TOML files
- **Responsive**: Works on mobile (tested on my phone, mostly)

## Deployment
I deploy to my "server" (yes, the Box) using rsync:

```bash
./deploy.sh
```

I also add new songs to the backend using rsync (again):
```bash
./sync_audio.sh
```

(god bless tailscale and [Cloudflared](https://github.com/cloudflare/cloudflared))

## Logging

Visitor analytics get written to `logs/visitors.log` (gitignored, obviously). Every Sunday at midnight a week-separator gets stamped in, and a parser script splits the previous week's entries into their own file under `logs/truncated/visitor_<start>_<end>.log` — both driven by cron.

