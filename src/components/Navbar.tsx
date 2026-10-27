import React, { useState, useEffect } from 'react';
import { BadgeCheck, Share2, QrCode, Globe, Mail } from 'lucide-react';
import { Language } from '../data/influencerData';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenQr: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenQr,
  onCopyLink,
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
          ? 'bg-[#070614]/90 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-indigo-950/70 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Name: ALWAYS MEHDI PITA ONLY */}
        <a
          href="#"
          className="flex items-center gap-2 group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <span className="font-display text-2xl sm:text-3xl font-black tracking-tight uppercase bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-cyan-200 transition-all font-mono">
            MEHDI PITA
          </span>
          <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0" aria-label="Verified" />
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-zinc-300">
          <a
            href="#platforms"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'جميع المنصات والمتابعين' : 'Réseaux & Abonnés'}
          </a>
          <a
            href="#videos"
            className="hover:text-violet-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'فيديوهات يوتيوب' : 'Vidéos YouTube'}
          </a>
          <a
            href="#contact"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
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
            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-600/40 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-black">{isAr ? 'FR' : 'العربية'}</span>
          </button>

          <button
            onClick={onCopyLink}
            title={copied ? (isAr ? "تم النسخ!" : "Lien copié !") : (isAr ? "نسخ الرابط" : "Copier le lien")}
            aria-label="Share"
            className="p-2 text-zinc-400 hover:text-cyan-300 hover:bg-purple-950/40 rounded-xl transition-all border border-purple-900/40 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenQr}
            title={isAr ? "باركود الهاتف" : "QR Code"}
            aria-label="QR Code"
            className="p-2 text-zinc-400 hover:text-cyan-300 hover:bg-purple-950/40 rounded-xl transition-all border border-purple-900/40 hidden sm:inline-flex cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <a
            href="#contact"
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-xl transition-all shadow-lg shadow-indigo-900/40 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Mail size={15} />
            <span>{isAr ? 'تواصل معي' : 'Contact'}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
