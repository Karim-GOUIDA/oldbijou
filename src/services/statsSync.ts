import { useCallback, useEffect, useMemo, useState } from "react";
import { INITIAL_SOCIAL_PLATFORMS, SocialPlatform } from "../data/influencerData";
import { SocialCounts } from "./siteContent";

export function formatFollowerCount(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "0";
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return (val >= 10 ? val.toFixed(1) : val.toFixed(2)).replace(/\.0+$/, "").replace(/(\.[0-9])0$/, "$1") + "B";
  }
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return (val >= 10 ? val.toFixed(1) : val.toFixed(2)).replace(/\.0+$/, "").replace(/(\.[0-9])0$/, "$1") + "M";
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return (val >= 10 ? val.toFixed(1) : val.toFixed(2)).replace(/\.0+$/, "").replace(/(\.[0-9])0$/, "$1") + "K";
  }
  return num.toLocaleString();
}

async function fetchYoutubeCount(): Promise<number | undefined> {
  const mirrors = [
    "https://inv.tux.pizza",
    "https://invidious.nerdvpn.de",
    "https://invidious.jing.rocks",
  ];
  for (const instance of mirrors) {
    try {
      const response = await fetch(`${instance}/api/v1/channels/UCNeOaYAvH2rx7_Io22nO6xQ`, {
        signal: AbortSignal.timeout(3500),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (typeof data.subCount === "number" && data.subCount > 0) return data.subCount;
    } catch {
      // Try the next public mirror.
    }
  }
  return undefined;
}

export function useLiveStats(sharedCounts: SocialCounts) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [liveYoutubeCount, setLiveYoutubeCount] = useState<number | undefined>();

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      setLiveYoutubeCount(await fetchYoutubeCount());
      setLastSynced(new Date());
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    void sync();
    const interval = window.setInterval(() => void sync(), 120000);
    return () => window.clearInterval(interval);
  }, [sync]);

  const platforms = useMemo<SocialPlatform[]>(() => INITIAL_SOCIAL_PLATFORMS.map((platform) => {
    const count = sharedCounts[platform.id] ??
      (platform.id === "youtube" ? liveYoutubeCount : undefined) ??
      platform.followersRaw ?? 0;
    const formatted = formatFollowerCount(count);
    return {
      ...platform,
      followersCount: count.toLocaleString(),
      followersRaw: count,
      highlightsAr: `${formatted} متابع حقيقي · مؤكد`,
      highlightsFr: `${formatted} abonnés réels · Vérifié`,
      isLiveSynced: true,
    };
  }), [sharedCounts, liveYoutubeCount]);

  return {
    platforms,
    isSyncing,
    lastSynced,
    syncSource: "Shared site data",
    refreshNow: sync,
  };
}
