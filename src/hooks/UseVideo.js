import { useContext } from 'react';
import { VideoContext } from '../context/videoContextInstance';

export const useVideo = () => useContext(VideoContext);