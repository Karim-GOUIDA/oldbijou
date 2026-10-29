import { RealVideo } from "../data/influencerData";

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /[?&]v=([a-zA-Z0-9_-]{11})/i,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match?.[1]) return match[1];
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
  const youtubeId = extractYouTubeId(data.youtubeInput);
  if (!youtubeId) return null;

  return {
    id: data.id || `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    youtubeId,
    titleAr: data.titleAr.trim() || "تحليل كروي — OLDBIJOU",
    titleFr: data.titleFr?.trim() || data.titleAr.trim() || "تحليل كروي — OLDBIJOU",
    url: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`,
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    fallbackThumbnail: `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
    tagAr: data.tagAr?.trim() || "فيديو تحليلي رسمي",
    tagFr: data.tagFr?.trim() || "Analyse officielle",
    author: "OLDBIJOU",
    duration: data.duration?.trim() || undefined,
  };
}
