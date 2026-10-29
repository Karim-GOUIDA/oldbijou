import { useCallback, useEffect, useRef, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { REAL_YOUTUBE_VIDEOS, type RealVideo, SOCIAL_PLATFORMS } from "../data/influencerData";

export type SocialCounts = Record<string, number>;

export interface SharedSiteContent {
  socialCounts: SocialCounts;
  videos: RealVideo[];
  gemsCount: number;
  updatedAt?: string;
}

const DEFAULT_CONTENT: SharedSiteContent = {
  socialCounts: Object.fromEntries(
    SOCIAL_PLATFORMS.map((platform) => [platform.id, platform.followersRaw ?? 0])
  ),
  videos: REAL_YOUTUBE_VIDEOS,
  gemsCount: 0,
};

function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
  }
  return createClient(url, publishableKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  });
}

let client: ReturnType<typeof getSupabaseClient> | undefined;
function supabase(): ReturnType<typeof getSupabaseClient> {
  if (!client) client = getSupabaseClient();
  return client;
}

function endpointUrl() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
  }
  return `${url.replace(/\/+$/, "")}/functions/v1/site-content`;
}

async function parseResponse(response: Response): Promise<SharedSiteContent> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof body?.error === "string" ? body.error : `Shared data request failed (${response.status}).`);
  }
  if (!body || !body.socialCounts || !Array.isArray(body.videos) || typeof body.gemsCount !== "number") {
    throw new Error("The shared data service returned an invalid response.");
  }
  return body as SharedSiteContent;
}

export async function fetchSharedSiteContent(): Promise<SharedSiteContent> {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const response = await fetch(endpointUrl(), {
    cache: "no-store",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  });
  return parseResponse(response);
}

export async function recordPublicSupport(): Promise<number> {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const response = await fetch(endpointUrl(), {
    method: "POST",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof body?.error === "string" ? body.error : `Support request failed (${response.status}).`);
  }
  if (!Number.isSafeInteger(body?.gemsCount) || body.gemsCount < 0) {
    throw new Error("The shared data service returned an invalid support count.");
  }
  return body.gemsCount;
}

export async function saveSharedSiteContent(
  patch: Partial<Pick<SharedSiteContent, "socialCounts" | "videos" | "gemsCount">>
): Promise<SharedSiteContent> {
  const { data, error } = await supabase().auth.getSession();
  if (error) throw new Error(`Unable to verify admin session: ${error.message}`);
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Please sign in again before saving.");

  const response = await fetch(endpointUrl(), {
    method: "PUT",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
  return parseResponse(response);
}

export function useSiteContent() {
  const [content, setContent] = useState<SharedSiteContent>(DEFAULT_CONTENT);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const contentRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++contentRequestId.current;
    try {
      const next = await fetchSharedSiteContent();
      if (requestId === contentRequestId.current) {
        setContent(next);
        setLoadError(null);
      }
    } catch (error) {
      if (requestId === contentRequestId.current) {
        setLoadError(error instanceof Error ? error.message : "Unable to load shared site data.");
      }
    }
  }, []);

  const save = useCallback(async (
    patch: Partial<Pick<SharedSiteContent, "socialCounts" | "videos" | "gemsCount">>
  ) => {
    const next = await saveSharedSiteContent(patch);
    contentRequestId.current += 1;
    setContent(next);
    setLoadError(null);
    return next;
  }, []);

  const sendSupport = useCallback(async () => {
    const requestId = ++contentRequestId.current;
    const gemsCount = await recordPublicSupport();
    if (requestId === contentRequestId.current) {
      setContent((current) => ({ ...current, gemsCount }));
      setLoadError(null);
    }
    return gemsCount;
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30000);
    let unsubscribe = () => {};
    try {
      const auth = supabase().auth;
      void auth.getSession().then(({ data, error }) => {
        if (error) setLoadError(`Unable to verify admin session: ${error.message}`);
        setSession(data.session);
      });
      const { data } = auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Supabase authentication is not configured.");
    }
    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase().auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    setSession(data.session);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase().auth.signOut();
    if (error) throw new Error(error.message);
    setSession(null);
  }, []);

  return { content, loadError, isAuthenticated: Boolean(session), refresh, save, sendSupport, signIn, signOut };
}
