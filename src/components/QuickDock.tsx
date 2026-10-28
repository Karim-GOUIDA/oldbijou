import React, { useState, useEffect } from 'react';
import { SOCIAL_PLATFORMS, SocialPlatform, Language } from '../data/influencerData';
import { PlatformIcon } from './BrandIcons';
import { QrCode, Mail } from 'lucide-react';

interface QuickDockProps {
  lang: Language;
  platforms?: SocialPlatform[];
  onOpenQr: () => void;
  onSelectPlatform: (id: string) => void;
}

export const QuickDock: React.FC<QuickDockProps> = ({
  lang,
  platforms = SOCIAL_PLATFORMS,
  onOpenQr,
  onSelectPlatform
}) => {
  const [visible, setVisible] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label={isAr ? "شريط الوصول السريع" : "Barre d'accès rapide"}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-auto"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0b0e17]/95 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-black/90">
        <div className="flex items-center gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              title={`${isAr ? platform.name : platform.nameFr} (${platform.followersCount})`}
              className="p-2 text-zinc-400 hover:text-amber-300 rounded-xl hover:bg-neutral-800 transition-colors shrink-0 group relative cursor-pointer"
            >
              <PlatformIcon type={platform.iconType} size={18} />
              <span className="hidden sm:group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-[#0e111a] border border-amber-500/30 text-[10px] font-bold text-amber-300 whitespace-nowrap shadow-xl">
                {isAr ? platform.name : platform.nameFr} ({platform.followersCount})
              </span>
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-neutral-800 shrink-0" />

        <button
          onClick={onOpenQr}
          title={isAr ? "باركود الهاتف" : "QR Code"}
          className="p-2 text-zinc-400 hover:text-amber-300 rounded-xl hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer hidden sm:block"
        >
          <QrCode className="w-4 h-4" />
        </button>

        <a
          href="#contact"
          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Mail size={13} />
          <span>{isAr ? 'تواصل' : 'Contact'}</span>
        </a>
      </div>
    </aside>
  );
};
