import { useState, useEffect, useCallback } from 'react';
import { REAL_YOUTUBE_VIDEOS, RealVideo } from '../data/influencerData';

const VIDEOS_STORAGE_KEY = 'oldbijou_custom_videos_v2';

/**
 * Robust YouTube ID extractor supporting:
 * - standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
 * - short URLs: https://youtu.be/VIDEO_ID
 * - embed URLs: https://www.youtube.com/embed/VIDEO_ID
 * - shorts URLs: https://www.youtube.com/shorts/VIDEO_ID
 * - direct 11-char ID
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already 11 alphanumeric/dash/underscore chars
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex patterns
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /[?&]v=([a-zA-Z0-9_-]{11})/i
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function buildVideoObject(data: {
  id?: string;
  youtubeInput: string;
  titleAr: string;
  titleFr?: string;
  tagAr?: string;
  tagFr?: string;
  duration?: string;
}): RealVideo | null {
  const ytId = extractYouTubeId(data.youtubeInput);
  if (!ytId) return null;

  const id = data.id || `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const titleAr = data.titleAr.trim() || 'تحليل كروي — OLDBIJOU';
  const titleFr = data.titleFr?.trim() || titleAr;
  const tagAr = data.tagAr?.trim() || 'فيديو تحليلي رسمي';
  const tagFr = data.tagFr?.trim() || 'Analyse officielle';

  return {
    id,
    youtubeId: ytId,
    titleAr,
    titleFr,
    url: `https://www.youtube.com/watch?v=${ytId}`,
    embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
    thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
    fallbackThumbnail: `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`,
    tagAr,
    tagFr,
    author: 'OLDBIJOU',
    duration: data.duration?.trim() || undefined
  };
}

export function getStoredVideos(): RealVideo[] {
  try {
    const raw = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return REAL_YOUTUBE_VIDEOS;
}

export function saveStoredVideos(videos: RealVideo[]): void {
  try {
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
    // notify any other components
    window.dispatchEvent(new CustomEvent('oldbijou_videos_updated'));
  } catch {
    // ignore
  }
}

export function useVideos() {
  const [videos, setVideos] = useState<RealVideo[]>(getStoredVideos);

  const refreshFromStorage = useCallback(() => {
    setVideos(getStoredVideos());
  }, []);

  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === VIDEOS_STORAGE_KEY) {
        refreshFromStorage();
      }
    };
    const handleCustomEvent = () => refreshFromStorage();

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('oldbijou_videos_updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('oldbijou_videos_updated', handleCustomEvent);
    };
  }, [refreshFromStorage]);

  const addVideo = (data: {
    youtubeInput: string;
    titleAr: string;
    titleFr?: string;
    tagAr?: string;
    tagFr?: string;
    duration?: string;
  }): boolean => {
    const newVideo = buildVideoObject(data);
    if (!newVideo) return false;

    const updated = [newVideo, ...videos];
    setVideos(updated);
    saveStoredVideos(updated);
    return true;
  };

  const updateVideo = (
    id: string,
    data: {
      youtubeInput?: string;
      titleAr?: string;
      titleFr?: string;
      tagAr?: string;
      tagFr?: string;
      duration?: string;
    }
  ): boolean => {
    const existing = videos.find((v) => v.id === id);
    if (!existing) return false;

    let ytId = existing.youtubeId;
    if (data.youtubeInput && data.youtubeInput.trim()) {
      const extracted = extractYouTubeId(data.youtubeInput);
      if (extracted) ytId = extracted;
    }

    const updatedVideo: RealVideo = {
      ...existing,
      youtubeId: ytId,
      url: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      fallbackThumbnail: `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`,
      titleAr: data.titleAr !== undefined ? data.titleAr : existing.titleAr,
      titleFr: data.titleFr !== undefined ? data.titleFr : existing.titleFr,
      tagAr: data.tagAr !== undefined ? data.tagAr : existing.tagAr,
      tagFr: data.tagFr !== undefined ? data.tagFr : existing.tagFr,
      duration: data.duration !== undefined ? data.duration : existing.duration
    };

    const updated = videos.map((v) => (v.id === id ? updatedVideo : v));
    setVideos(updated);
    saveStoredVideos(updated);
    return true;
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveStoredVideos(updated);
  };

  const resetVideos = () => {
    setVideos(REAL_YOUTUBE_VIDEOS);
    saveStoredVideos(REAL_YOUTUBE_VIDEOS);
  };

  const moveVideo = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const copy = [...videos];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);

    setVideos(copy);
    saveStoredVideos(copy);
  };

  return {
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    resetVideos,
    moveVideo
  };
}
