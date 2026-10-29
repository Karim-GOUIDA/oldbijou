/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeTicker } from './components/MarqueeTicker';
import { SocialPlatformsGrid } from './components/SocialPlatformsGrid';
import { RealVideosSection } from './components/RealVideosSection';
import { DirectContactSection } from './components/DirectContactSection';
import { QRCodeModal } from './components/QRCodeModal';
import { QuickDock } from './components/QuickDock';
import { Footer } from './components/Footer';
import { NumbersAdminPage } from './pages/NumbersAdminPage';
import { Language, REAL_YOUTUBE_VIDEOS, RealVideo, SOCIAL_PLATFORMS } from './data/influencerData';
import { useLiveStats } from './services/statsSync';
import { buildVideoObject } from './services/videoManager';
import { useSiteContent } from './services/siteContent';
import { Check } from 'lucide-react';

function isOldbijouAdminPath(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');
  return p.endsWith('/oldbijonumbers') || p.endsWith('/oldbijounumbers') ||
    hash === 'oldbijonumbers' || hash === 'oldbijounumbers';
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(isOldbijouAdminPath);
  const [highlightedPlatformId, setHighlightedPlatformId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const siteContent = useSiteContent();
  const { platforms, isSyncing, syncSource, refreshNow } = useLiveStats(siteContent.content.socialCounts);
  const videos = siteContent.content.videos;

  const updateCounts = (counts: Record<string, number>) =>
    siteContent.save({ socialCounts: { ...siteContent.content.socialCounts, ...counts } });
  const resetCounts = () => updateCounts(Object.fromEntries(
    SOCIAL_PLATFORMS.map((platform) => [platform.id, platform.followersRaw ?? 0])
  ));
  const updateVideos = (nextVideos: RealVideo[]) => siteContent.save({ videos: nextVideos });
  const addVideo = async (data: {
    youtubeInput: string;
    titleAr: string;
    titleFr?: string;
    tagAr?: string;
    tagFr?: string;
    duration?: string;
  }) => {
    const video = buildVideoObject(data);
    if (!video) return false;
    await updateVideos([video, ...videos]);
    return true;
  };
  const updateVideo = async (id: string, data: {
    youtubeInput?: string;
    titleAr?: string;
    titleFr?: string;
    tagAr?: string;
    tagFr?: string;
    duration?: string;
  }) => {
    const current = videos.find((video) => video.id === id);
    if (!current) throw new Error('The video no longer exists. Refresh and try again.');
    const next = buildVideoObject({
      ...current,
      ...data,
      youtubeInput: data.youtubeInput || current.youtubeId,
      titleAr: data.titleAr ?? current.titleAr,
      titleFr: data.titleFr ?? current.titleFr,
      tagAr: data.tagAr ?? current.tagAr,
      tagFr: data.tagFr ?? current.tagFr,
      id: current.id,
    });
    if (!next) throw new Error('The YouTube video ID is invalid.');
    await updateVideos(videos.map((video) => video.id === id ? next : video));
  };
  const deleteVideo = async (id: string) =>
    updateVideos(videos.filter((video) => video.id !== id));
  const resetVideos = () => updateVideos(REAL_YOUTUBE_VIDEOS);
  const moveVideo = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;
    const next = [...videos];
    const [moved] = next.splice(idx, 1);
    next.splice(targetIdx, 0, moved);
    await updateVideos(next);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(isOldbijouAdminPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToHome = () => {
    try {
      const path = window.location.pathname;
      const normalizedPath = path.toLowerCase().replace(/\/+$/, '');
      const suffix = ['/oldbijonumbers', '/oldbijounumbers']
        .find((route) => normalizedPath.endsWith(route));
      const homePath = suffix
        ? `${path.replace(/\/+$/, '').slice(0, -suffix.length) || ''}/`
        : path;
      window.history.pushState({}, '', `${homePath}${window.location.search}`);
    } catch {
      // fallback
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  const handleCopyProfileLink = () => {
    const url = window.location.origin || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectPlatform = (platformId: string) => {
    setHighlightedPlatformId(platformId);
    const element = document.getElementById(`platform-card-${platformId}`) || document.getElementById('platforms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isAr = lang === 'ar';

  // If visiting /oldbijonumbers, render dedicated numbers & videos admin page
  if (isAdminView) {
    return (
      <NumbersAdminPage
        lang={lang}
        onToggleLang={toggleLang}
        platforms={platforms}
        isSyncing={isSyncing}
        syncSource={syncSource}
        onRefresh={async () => {
          await siteContent.refresh();
          await refreshNow();
        }}
        onUpdateMultipleCounts={updateCounts}
        onResetDefaults={resetCounts}
        onNavigateHome={navigateToHome}
        videos={videos}
        onAddVideo={addVideo}
        onUpdateVideo={updateVideo}
        onDeleteVideo={deleteVideo}
        onResetVideos={resetVideos}
        onMoveVideo={moveVideo}
        onlineGems={siteContent.content.gemsCount}
        onSaveGems={(count) => siteContent.save({ gemsCount: count })}
        onResetGems={() => siteContent.save({ gemsCount: 0 })}
        isAuthenticated={siteContent.isAuthenticated}
        onLogin={siteContent.signIn}
        onLogout={siteContent.signOut}
        contentError={siteContent.loadError}
        onRefreshContent={siteContent.refresh}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#08090E] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950 transition-colors duration-300"
      dir={isAr ? 'rtl' : 'ltr'}
      lang={lang}
    >
      {/* Toast Notification */}
      {copiedLink && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-zinc-950 font-black text-xs rounded-full shadow-2xl shadow-amber-950/80 flex items-center gap-2 animate-bounce border border-amber-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>
            {isAr ? 'تم نسخ رابط الموقع الرسمي لـ OLDBIJOU!' : 'Lien officiel de OLDBIJOU copié !'}
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        onOpenQr={() => setIsQrOpen(true)}
        onCopyLink={handleCopyProfileLink}
        copied={copiedLink}
      />

      {/* Main Sections */}
      {siteContent.loadError && (
        <div role="status" className="bg-red-950/90 border-y border-red-500/40 px-4 py-2 text-center text-xs text-red-100">
          <span>{isAr ? 'تعذر تحديث البيانات المشتركة:' : 'Impossible de charger les données partagées :'}</span>
          {' '}{siteContent.loadError}{' '}
          <button type="button" onClick={() => void siteContent.refresh()} className="underline font-bold">
            {isAr ? 'إعادة المحاولة' : 'Réessayer'}
          </button>
        </div>
      )}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          platforms={platforms}
          onSelectPlatform={handleSelectPlatform}
        />

        {/* Endless Scrolling Ribbon with Dynamic Numbers */}
        <MarqueeTicker lang={lang} platforms={platforms} />

        {/* All Official Social Media Accounts Grid (Instagram, Facebook, YouTube, TikTok) */}
        <SocialPlatformsGrid
          lang={lang}
          platforms={platforms}
          onSelectPreview={(platform) => handleSelectPlatform(platform.id)}
          selectedPlatformId={highlightedPlatformId}
        />

        {/* Second Endless Scrolling Ribbon with Dynamic Numbers */}
        <MarqueeTicker lang={lang} speed="fast" reverse={true} platforms={platforms} />

        {/* Real YouTube Featured Videos Player */}
        <RealVideosSection
          lang={lang}
          platforms={platforms}
          videos={videos}
        />

        {/* Direct Contact & Fan Hype Section */}
        <DirectContactSection lang={lang} platforms={platforms} gemsCount={siteContent.content.gemsCount} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        platforms={platforms}
      />

      {/* Floating Bottom Quick Dock */}
      <QuickDock
        lang={lang}
        platforms={platforms}
        onOpenQr={() => setIsQrOpen(true)}
        onSelectPlatform={handleSelectPlatform}
      />

      {/* Universal QR Code Modal */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        lang={lang}
      />
    </div>
  );
}
