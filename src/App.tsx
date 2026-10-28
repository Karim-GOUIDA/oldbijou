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
import { StatsManagerModal } from './components/StatsManagerModal';
import { NumbersAdminPage } from './pages/NumbersAdminPage';
import { Language } from './data/influencerData';
import { useLiveStats } from './services/statsSync';
import { useVideos } from './services/videoManager';
import { Check } from 'lucide-react';

function isOldbijouAdminPath(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.toLowerCase();
  const h = window.location.hash.toLowerCase();
  const s = window.location.search.toLowerCase();
  return (
    p.includes('oldbijonumbers') ||
    p.includes('oldbijounumbers') ||
    h.includes('oldbijonumbers') ||
    h.includes('oldbijounumbers') ||
    s.includes('oldbijonumbers') ||
    s.includes('admin=true')
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(isOldbijouAdminPath);
  const [highlightedPlatformId, setHighlightedPlatformId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Auto-Syncing Hook for real-time stats
  const {
    platforms,
    isSyncing,
    syncSource,
    refreshNow,
    updateManualCount,
    updateMultipleCounts,
    resetToDefaults,
    updateApiConfig
  } = useLiveStats();

  // Custom Video Manager Hook (CRUD + persistent storage)
  const {
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    resetVideos,
    moveVideo
  } = useVideos();

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

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/oldbijonumbers');
    } catch {
      // fallback
    }
    window.location.hash = 'oldbijonumbers';
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // fallback
    }
    window.location.hash = '';
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
        platforms={platforms}
        isSyncing={isSyncing}
        syncSource={syncSource}
        onRefresh={refreshNow}
        onUpdateMultipleCounts={updateMultipleCounts}
        onResetDefaults={resetToDefaults}
        onNavigateHome={navigateToHome}
        videos={videos}
        onAddVideo={addVideo}
        onUpdateVideo={updateVideo}
        onDeleteVideo={deleteVideo}
        onResetVideos={resetVideos}
        onMoveVideo={moveVideo}
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
        onOpenStats={navigateToAdmin}
        onCopyLink={handleCopyProfileLink}
        copied={copiedLink}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          platforms={platforms}
          onSelectPlatform={handleSelectPlatform}
          onOpenStats={navigateToAdmin}
        />

        {/* Endless Scrolling Ribbon with Dynamic Numbers */}
        <MarqueeTicker lang={lang} platforms={platforms} />

        {/* All Official Social Media Accounts Grid (Instagram, Facebook, YouTube, TikTok) */}
        <SocialPlatformsGrid
          lang={lang}
          platforms={platforms}
          onSelectPreview={(platform) => handleSelectPlatform(platform.id)}
          onOpenStats={navigateToAdmin}
          selectedPlatformId={highlightedPlatformId}
        />

        {/* Second Endless Scrolling Ribbon with Dynamic Numbers */}
        <MarqueeTicker lang={lang} speed="fast" reverse={true} platforms={platforms} />

        {/* Real YouTube Featured Videos Player */}
        <RealVideosSection
          lang={lang}
          platforms={platforms}
          videos={videos}
          onNavigateAdmin={navigateToAdmin}
        />

        {/* Direct Contact & Fan Hype Section */}
        <DirectContactSection lang={lang} platforms={platforms} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        platforms={platforms}
        onNavigateAdmin={navigateToAdmin}
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

      {/* Real Live Stats & API Manager Modal */}
      <StatsManagerModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        lang={lang}
        platforms={platforms}
        isSyncing={isSyncing}
        syncSource={syncSource}
        onRefresh={refreshNow}
        onUpdateManualCount={updateManualCount}
        onUpdateApiConfig={updateApiConfig}
      />
    </div>
  );
}
