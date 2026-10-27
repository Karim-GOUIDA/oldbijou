import React from 'react';
import { Language } from '../data/influencerData';

interface MarqueeTickerProps {
  speed?: 'normal' | 'fast';
  lang?: Language;
  reverse?: boolean;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  speed = 'normal',
  lang = 'ar',
  reverse = false
}) => {
  const isAr = lang === 'ar';

  const items = isAr
    ? [
        "MEHDI PITA",
        "إنستغرام: 213K متابع (865 يتابعهم)",
        "فيسبوك: 113K متابع (MEHDI PITA)",
        "يوتيوب: 23.1K مشترك (@MEHDIPITA)",
        "تيك توك: 13.2K متابع (@MEHDI.PIITA)",
        "صانع محتوى كروي بستايل كوميدي🤳",
        "✨حب ما تعمل حتى تعمل ما تحب✨",
        "- Mrmlaaaa9",
        "MEHDIPITACONTACT@GMAIL.COM"
      ]
    : [
        "MEHDI PITA",
        "Instagram: 213K abonnés (865 abonnements)",
        "Facebook: 113K abonnés (MEHDI PITA)",
        "YouTube: 23.1K abonnés (@MEHDIPITA)",
        "TikTok: 13.2K abonnés (@MEHDI.PIITA)",
        "Créateur de contenu football & humour 🤳",
        "✨ Aime ce que tu fais jusqu'à ce que tu fasses ce que tu aimes ✨",
        "- Mrmlaaaa9",
        "MEHDIPITACONTACT@GMAIL.COM"
      ];

  // Quadruple items to ensure abundant width on all monitor sizes
  const fullGroup = [...items, ...items];

  // Choose animation class based on speed and direction
  const animationClass = reverse
    ? 'animate-marquee-reverse'
    : speed === 'fast'
      ? 'animate-marquee-fast'
      : 'animate-marquee';

  return (
    <div
      className="w-full bg-gradient-to-r from-purple-950/80 via-[#0e0b29] to-purple-950/80 border-y border-purple-500/25 py-3.5 overflow-hidden select-none backdrop-blur-md shadow-inner pointer-events-none"
      dir="ltr"
    >
      <div className={`flex ${animationClass} whitespace-nowrap`}>
        {/* Set 1: First 50% */}
        <div className="flex shrink-0 items-center">
          {fullGroup.map((text, idx) => (
            <div key={`g1-${idx}`} className="flex items-center mx-5 text-xs sm:text-sm font-black tracking-wide">
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent font-display">
                {text}
              </span>
              <span className="mx-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" aria-hidden="true">
                ⚽
              </span>
            </div>
          ))}
        </div>

        {/* Set 2: Exact duplicate second 50% for 100% seamless, non-stopping infinite loop */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {fullGroup.map((text, idx) => (
            <div key={`g2-${idx}`} className="flex items-center mx-5 text-xs sm:text-sm font-black tracking-wide">
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent font-display">
                {text}
              </span>
              <span className="mx-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" aria-hidden="true">
                ⚽
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
