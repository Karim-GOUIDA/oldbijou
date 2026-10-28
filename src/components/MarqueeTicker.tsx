import React from 'react';
import { Language, SocialPlatform } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';

interface MarqueeTickerProps {
  speed?: 'normal' | 'fast';
  lang?: Language;
  reverse?: boolean;
  platforms?: SocialPlatform[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  speed = 'normal',
  lang = 'ar',
  reverse = false,
  platforms = []
}) => {
  const isAr = lang === 'ar';

  const yt = platforms.find((p) => p.id === 'youtube');
  const ig = platforms.find((p) => p.id === 'instagram');
  const fb = platforms.find((p) => p.id === 'facebook');
  const tt = platforms.find((p) => p.id === 'tiktok');

  const ytText = formatFollowerCount(yt?.followersRaw ?? 7690);
  const igText = formatFollowerCount(ig?.followersRaw ?? 48500);
  const fbText = formatFollowerCount(fb?.followersRaw ?? 35200);
  const ttText = formatFollowerCount(tt?.followersRaw ?? 28400);

  const items = isAr
    ? [
        "OLDBIJOU (Khalil) 💎",
        `يوتيوب: ${ytText} مشترك · 781 فيديو (@OLDBIJOU-1)`,
        `إنستغرام: ${igText} متابع (@OLDBIJOU)`,
        `فيسبوك: ${fbText} متابع (OLD BIJOU OFFICIAL)`,
        `تيك توك: ${ttText} متابع (@OLDBIJOU)`,
        "صانع محتوى وستوريات كروية ⚽🎭 والمبالغة فنّ بوحدو",
        "✨لكل أسطورة بداية.. ولكل جوهرة كروية حكاية✨",
        "OLDBIJOUCO@GMAIL.COM"
      ]
    : [
        "OLDBIJOU 💎",
        `YouTube: ${ytText} abonnés · 781 vidéos (@OLDBIJOU-1)`,
        `Instagram: ${igText} abonnés (@OLDBIJOU)`,
        `Facebook: ${fbText} abonnés (OLD BIJOU OFFICIAL)`,
        `TikTok: ${ttText} abonnés (@OLDBIJOU)`,
        "Analyste & Créateur Football ⚽💎 Histoires & Légendes",
        "✨ Chaque légende a son histoire, chaque bijou son éclat ✨",
        "OLDBIJOUCO@GMAIL.COM"
      ];

  const fullGroup = [...items, ...items];

  const animationClass = reverse
    ? 'animate-marquee-reverse'
    : speed === 'fast'
      ? 'animate-marquee-fast'
      : 'animate-marquee';

  return (
    <div
      className="w-full bg-gradient-to-r from-[#0a0c12] via-[#101420] to-[#0a0c12] border-y border-amber-500/20 py-3.5 overflow-hidden select-none backdrop-blur-md shadow-inner pointer-events-none"
      dir="ltr"
    >
      <div className={`flex ${animationClass} whitespace-nowrap`}>
        {/* Set 1 */}
        <div className="flex shrink-0 items-center">
          {fullGroup.map((text, idx) => (
            <div key={`g1-${idx}`} className="flex items-center mx-5 text-xs sm:text-sm font-black tracking-wide">
              <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-display">
                {text}
              </span>
              <span className="mx-4 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" aria-hidden="true">
                ⚽
              </span>
            </div>
          ))}
        </div>

        {/* Set 2 */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {fullGroup.map((text, idx) => (
            <div key={`g2-${idx}`} className="flex items-center mx-5 text-xs sm:text-sm font-black tracking-wide">
              <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-display">
                {text}
              </span>
              <span className="mx-4 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" aria-hidden="true">
                ⚽
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
