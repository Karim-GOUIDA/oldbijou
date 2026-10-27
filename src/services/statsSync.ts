import { useState, useEffect, useCallback } from 'react';
import { SOCIAL_PLATFORMS, SocialPlatform } from '../data/influencerData';

export interface LiveStatsState {
  platforms: SocialPlatform[];
  isSyncing: boolean;
  lastSynced: Date;
  autoSyncActive: boolean;
}

export function formatFollowerCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

/**
 * Fetch real live statistics from public APIs / mirrors
 */
export const fetchLivePlatformStats = async (): Promise<{
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  instagramFollowers?: number;
  facebookFollowers?: number;
}> => {
  const result: {
    youtubeSubscribers?: number;
    tiktokFollowers?: number;
    instagramFollowers?: number;
    facebookFollowers?: number;
  } = {};

  // 1. YouTube Live Subscriber Count
  // Tries multiple public Invidious API instances (CORS-friendly public mirror) or YouTube Data API
  const invidiousInstances = [
    'https://inv.nadeko.net',
    'https://vid.puffyan.us',
    'https://invidious.jing.rocks'
  ];

  for (const instance of invidiousInstances) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${instance}/api/v1/channels/@Mehdipita`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (typeof data.subCount === 'number' && data.subCount > 0) {
          result.youtubeSubscribers = data.subCount;
          break;
        }
      }
    } catch {
      // Continue to next mirror on failure
    }
  }

  // 2. Custom or webhook API endpoint (if defined by user in localStorage or env)
  try {
    const customApiUrl =
      (typeof window !== 'undefined' && window.localStorage?.getItem('pita_stats_api_url')) ||
      (import.meta as unknown as { env?: { VITE_STATS_API_URL?: string } }).env?.VITE_STATS_API_URL;

    if (customApiUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(customApiUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (typeof data.youtube === 'number') result.youtubeSubscribers = data.youtube;
        if (typeof data.tiktok === 'number') result.tiktokFollowers = data.tiktok;
        if (typeof data.instagram === 'number') result.instagramFollowers = data.instagram;
        if (typeof data.facebook === 'number') result.facebookFollowers = data.facebook;
      }
    }
  } catch {
    // Custom endpoint optional
  }

  return result;
};

export function useLiveStats() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(SOCIAL_PLATFORMS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const liveData = await fetchLivePlatformStats();

      setPlatforms((prev) =>
        prev.map((platform) => {
          // Live YouTube update
          if (platform.id === 'youtube' && liveData.youtubeSubscribers) {
            const formatted = formatFollowerCount(liveData.youtubeSubscribers);
            return {
              ...platform,
              followersCount: `${liveData.youtubeSubscribers.toLocaleString()}`,
              followersRaw: liveData.youtubeSubscribers,
              highlightsAr: `${formatted} مشترك · محتوى وفيديوهات حصرية`,
              highlightsFr: `${formatted} abonnés · Vidéos et actus régulières`,
              isLiveSynced: true
            };
          }

          // Live TikTok update (if returned by custom API)
          if (platform.id === 'tiktok' && liveData.tiktokFollowers) {
            const formatted = formatFollowerCount(liveData.tiktokFollowers);
            return {
              ...platform,
              followersCount: `${liveData.tiktokFollowers.toLocaleString()}`,
              followersRaw: liveData.tiktokFollowers,
              highlightsAr: `${formatted} متابع · مقاطع سريعة وكوميديا`,
              highlightsFr: `${formatted} abonnés · Clips et vidéos virales`,
              isLiveSynced: true
            };
          }

          // Live Instagram update (if returned by custom API)
          if (platform.id === 'instagram' && liveData.instagramFollowers) {
            const formatted = formatFollowerCount(liveData.instagramFollowers);
            return {
              ...platform,
              followersCount: `${liveData.instagramFollowers.toLocaleString()}`,
              followersRaw: liveData.instagramFollowers,
              highlightsAr: `${formatted} متابع · ستوريات ويوميات`,
              highlightsFr: `${formatted} abonnés · Stories quotidiennes`,
              isLiveSynced: true
            };
          }

          // Live Facebook update (if returned by custom API)
          if (platform.id === 'facebook' && liveData.facebookFollowers) {
            const formatted = formatFollowerCount(liveData.facebookFollowers);
            return {
              ...platform,
              followersCount: `${liveData.facebookFollowers.toLocaleString()}`,
              followersRaw: liveData.facebookFollowers,
              highlightsAr: `${formatted} متابع · تفاعل جماهيري`,
              highlightsFr: `${formatted} abonnés · Communauté active`,
              isLiveSynced: true
            };
          }

          return platform;
        })
      );

      setLastSynced(new Date());
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    sync();

    // Auto refresh every 60 seconds
    const interval = setInterval(() => {
      sync();
    }, 60000);

    return () => clearInterval(interval);
  }, [sync]);

  return {
    platforms,
    isSyncing,
    lastSynced,
    refreshNow: sync
  };
}
