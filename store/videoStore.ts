import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface VideoItem {
  id: number;
  title: string;
  source: string;       // URL string to the video
  downloadedUri?: string;
}

interface VideoState {
  videoList: VideoItem[];
  downloaded: Record<number, string>; // id -> local uri
  setVideoList: (videos: VideoItem[]) => void;
  setDownloadedUri: (id: number, uri: string) => void; 

}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      videoList: [],
      downloaded: {}, 
      setVideoList: (videos: VideoItem[]) => set({ videoList: videos }),
      setDownloadedUri: (id: number, uri: string) =>
        set((state:any) => ({
          downloaded: { ...state.downloaded, [id]: uri },
        })),
    }),
    {
      name: 'videos-storage',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
