import { createContext } from 'react';

// Kept in its own file, same pattern as videoContextInstance.js, so every
// component file only exports components (needed for Fast Refresh).
export const AuthContext = createContext();