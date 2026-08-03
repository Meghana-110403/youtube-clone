# YouTube Clone

A YouTube-inspired video browsing app built with React and Vite, powered by the real YouTube Data API v3. Browse trending videos, search, watch videos with comments and related content, and use local (mock) sign-in, likes, and history — all without a backend server.

**🔗 Live demo:** [youtube-clone-umber-rho-22.vercel.app](https://youtube-clone-umber-rho-22.vercel.app/)

## Features

- **Trending videos** – pulls the current most popular videos via the YouTube Data API
- **Search** – search videos with sort options (relevance, date, view count, rating, title)
- **Watch page** – video playback, details, comments, and related videos
- **Mock sign-in** – a lightweight local "auth" system (no real backend/OAuth) that lets you attribute likes/comments to a display name, stored in `localStorage`
- **Liked videos & history** – tracked client-side in `localStorage`
- **Subscriptions page**
- **Responsive layout** with collapsible sidebar

> Note: Sign-in, likes, history, and subscriptions are all mocked on the client using `localStorage`. There is no real backend, database, or connection to actual YouTube accounts.

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) for routing
- [Axios](https://axios-http.com/) for API requests
- [MUI](https://mui.com/) (`@mui/material`) + [react-icons](https://react-icons.github.io/react-icons/) for UI
- [react-player](https://github.com/cookpete/react-player) for video playback
- [YouTube Data API v3](https://developers.google.com/youtube/v3) for video data
- ESLint for linting

## Project Structure

```
youtube-clone/
├── src/
│   ├── components/    # Header, SideBar, VideoCard, VideoPlayer, Comments, SignInModal
│   ├── pages/          # Home, Watch, Search, Trending, Liked, History, Subscriptions
│   ├── hooks/           # useYoutubeAPI, useAuth, useVideo (data fetching + auth hooks)
│   ├── context/         # AuthContext, VideoContext (React context providers)
│   ├── utils/           # api.js (YouTube API client), localStore.js (localStorage helpers)
│   ├── App.jsx          # Routes and app shell
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/) (enable the "YouTube Data API v3" for your project)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure your API key**

   Create a `.env` file in the project root:

   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

   > ⚠️ Never commit your `.env` file or share your API key. `.env` is already listed in `.gitignore`. If a key has ever been committed or shared publicly, revoke/regenerate it in the Google Cloud Console.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at the URL Vite prints (typically `http://localhost:5173`).

## Available Scripts

| Command            | Description                            |
|--------------------|-----------------------------------------|
| `npm run dev`      | Start the Vite development server       |
| `npm run build`    | Build the app for production            |
| `npm run preview`  | Preview the production build locally    |
| `npm run lint`     | Run ESLint over the project             |

## Notes & Limitations

- The YouTube Data API has a daily quota; heavy use of search/trending/related-videos requests can exhaust the free quota.
- "Related videos" are approximated by searching on the source video's tags/title, since YouTube deprecated the API's native `relatedToVideoId` parameter.
- Sign-in is a mock/local feature only — no real authentication or connection to Google/YouTube accounts occurs.

## License

This project is for educational/demo purposes. YouTube and the YouTube logo are trademarks of Google LLC; this project is not affiliated with or endorsed by YouTube/Google.
