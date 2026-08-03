import { createContext } from 'react';

// Kept in its own file (separate from VideoContext.jsx and useVideo.js) so that
// every component file only exports components — required for Fast Refresh to
// work reliably. Don't add non-component exports back into VideoContext.jsx.
export const VideoContext = createContext();