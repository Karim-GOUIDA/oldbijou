/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeTicker } from './components/MarqueeTicker';
import { SocialPlatformsGrid } from './components/SocialPlatformsGrid';
import { RealVideosSection } from './components/RealVideosSection';
import { DirectContactSection } from './components/DirectContactSection';
import { QRCodeModal } from './components/QRCodeModal';
import { QuickDock } from './components/QuickDock';
import { Footer } from './components/Footer';
import { Language } from './data/influencerData';
import { useLiveStats } from './services/statsSync';
import { Check } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [highlightedPlatformId, setHighlightedPlatformId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Auto-Syncing Hook for real-time stats
  const { platforms } = useLiveStats();

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  const handleCopyProfileLink = () => {
    const url = window.location.href;
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

  return (
    <div
      className="min-h-screen bg-[#070614] text-zinc-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-zinc-950 transition-colors duration-300"
      dir={isAr ? 'rtl' : 'ltr'}
      lang={lang}
    >
      {/* Toast Notification */}
      {copiedLink && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black text-xs rounded-full shadow-2xl shadow-indigo-900/80 flex items-center gap-2 animate-bounce border border-cyan-400/50">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>
            {isAr ? 'تم نسخ رابط الموقع الرسمي لـ MEHDI PITA!' : 'Lien officiel de MEHDI PITA copié !'}
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
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          platforms={platforms}
          onSelectPlatform={handleSelectPlatform}
        />

        {/* Endless Scrolling Ribbon */}
        <MarqueeTicker lang={lang} />

        {/* All Official Social Media Accounts Grid (Instagram, Facebook, YouTube, TikTok) */}
        <SocialPlatformsGrid
          lang={lang}
          platforms={platforms}
          onSelectPreview={(platform) => handleSelectPlatform(platform.id)}
          selectedPlatformId={highlightedPlatformId}
        />

        {/* Second Endless Scrolling Ribbon (Opposite direction, never stopping) */}
        <MarqueeTicker lang={lang} speed="fast" reverse={true} />

        {/* Real YouTube Featured Videos Player */}
        <RealVideosSection lang={lang} />

        {/* Direct Contact & Fan Hype Section */}
        <DirectContactSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} />

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
