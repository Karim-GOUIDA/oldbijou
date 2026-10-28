import React, { useState, useEffect } from 'react';
import { BadgeCheck, Share2, QrCode, Globe, Mail, Gem } from 'lucide-react';
import { Language, INFLUENCER_PROFILE } from '../data/influencerData';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenQr: () => void;
  onCopyLink: () => void;
  onOpenStats?: () => void;
  copied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenQr,
  onCopyLink,
  onOpenStats,
  copied
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAr = lang === 'ar';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090E]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl shadow-black/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand: OLDBIJOU */}
        <a
          href="#"
          className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Gem className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tight uppercase bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-200 transition-all font-mono">
                {INFLUENCER_PROFILE.name}
              </span>
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-label="Verified" />
            </div>
            <span className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase font-mono -mt-1 hidden sm:block">
              Football Hub & Stories
            </span>
          </div>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-zinc-300">
          <a
            href="#platforms"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'المنصات الرسمية والمتابعين' : 'Réseaux & Abonnés'}
          </a>
          <a
            href="#videos"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'فيديوهات وتحليلات YouTube' : 'Vidéos YouTube'}
          </a>
          <a
            href="#contact"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'التواصل والإيميل' : 'Contact & Email'}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switcher Button (AR / FR) */}
          <button
            onClick={onToggleLang}
            title={isAr ? "Passer au français" : "التحويل إلى العربية"}
            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 text-xs font-bold text-amber-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-black">{isAr ? 'FR' : 'العربية'}</span>
          </button>

          {onOpenStats && (
            <button
              onClick={onOpenStats}
              title={isAr ? "إدارة ومزامنة الأرقام الحقيقية (APIs)" : "Gérer les métriques réelles (APIs)"}
              className="p-2 text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 rounded-xl transition-all border border-amber-600/30 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold font-mono hidden lg:inline">
                {isAr ? 'الأرقام الحقيقية' : 'Stats Live'}
              </span>
            </button>
          )}

          <button
            onClick={onCopyLink}
            title={copied ? (isAr ? "تم النسخ!" : "Lien copié !") : (isAr ? "نسخ الرابط" : "Copier le lien")}
            aria-label="Share"
            className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-amber-950/40 rounded-xl transition-all border border-neutral-800 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQr}
            title={isAr ? "باركود الهاتف" : "QR Code"}
            aria-label="QR Code"
            className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-amber-950/40 rounded-xl transition-all border border-neutral-800 hidden sm:inline-flex cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <a
            href="#contact"
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Mail size={15} />
            <span>{isAr ? 'تواصل مع OLDBIJOU' : 'Contact'}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
