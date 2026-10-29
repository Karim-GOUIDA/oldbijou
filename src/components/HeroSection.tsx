import React from 'react';
import { ExternalLink, Gem, ShieldCheck, Video, Flame } from 'lucide-react';
import { INFLUENCER_PROFILE, SocialPlatform, Language } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';
import { YoutubeIcon, InstagramIcon, TikTokIcon, FacebookIcon } from './BrandIcons';

interface HeroSectionProps {
  lang: Language;
  platforms: SocialPlatform[];
  onSelectPlatform: (platformId: string) => void;
  onOpenStats?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  platforms,
  onSelectPlatform,
  onOpenStats
}) => {
  const isAr = lang === 'ar';

  // Find platform data from current synced state
  const ytPlatform = platforms.find((p) => p.id === 'youtube');
  const igPlatform = platforms.find((p) => p.id === 'instagram');
  const fbPlatform = platforms.find((p) => p.id === 'facebook');
  const tiktokPlatform = platforms.find((p) => p.id === 'tiktok');

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-amber-900/30">
      {/* Stadium Backdrop with dark fade */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <img
          src={INFLUENCER_PROFILE.stadiumBg}
          alt=""
          aria-hidden="true"
          width={1376}
          height={768}
          className="w-full h-full object-cover object-center filter saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-[#08090E]/80 to-[#08090E]/95" />
      </div>

      {/* Dynamic Gold-Amber & Emerald ambient glow spheres */}
      <div
        className="absolute top-1/4 right-1/4 w-[520px] h-[520px] bg-gradient-to-tr from-amber-500/15 via-yellow-600/10 to-transparent blur-[150px] pointer-events-none rounded-full animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-gradient-to-bl from-emerald-600/10 via-teal-700/10 to-transparent blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Typographic and Content Column */}
          <div className="md:col-span-7 flex flex-col justify-center">
            {/* Main Headline: OLDBIJOU */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5">
              <img
                src={INFLUENCER_PROFILE.avatar}
                alt={isAr ? 'صورة صانع المحتوى الكروي OLDBIJOU' : 'Portrait of OLDBIJOU, football content creator'}
                width={1080}
                height={1080}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg md:hidden shrink-0"
              />
              <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-[4.4rem] font-black tracking-tight text-white leading-[1.05] [text-wrap:balance]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 uppercase font-mono">
                  {INFLUENCER_PROFILE.name}
                </span>
              </h1>
            </div>

            {/* Creator Bio & Quotes */}
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900/80 border border-amber-500/20 text-amber-200 font-bold text-sm">
                <span>⚽</span>
                <span>{isAr ? INFLUENCER_PROFILE.roleAr : INFLUENCER_PROFILE.roleFr}</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-amber-300 font-display">
                {isAr ? INFLUENCER_PROFILE.mottoAr : INFLUENCER_PROFILE.mottoFr}
              </p>
              <div className="text-sm font-bold text-zinc-400 font-mono flex items-center gap-2">
                <span>{INFLUENCER_PROFILE.handle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-red-400">{INFLUENCER_PROFILE.youtubeHandle}</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed max-w-2xl pt-1 whitespace-pre-line">
                {isAr ? INFLUENCER_PROFILE.bioAr : INFLUENCER_PROFILE.bioFr}
              </p>
            </div>

            {/* Direct Action Buttons to Official Platforms */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <a
                href={ytPlatform?.url || "https://www.youtube.com/@oldbijou-1/videos"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center gap-2.5 cursor-pointer whitespace-nowrap hover:scale-105"
              >
                <YoutubeIcon size={18} />
                <span>YouTube ({formatFollowerCount(ytPlatform?.followersRaw ?? 7690)})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={igPlatform?.url || "https://www.instagram.com/oldbijou/?hl=en"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-95 text-white font-black text-sm rounded-xl transition-all shadow-xl shadow-pink-600/20 flex items-center gap-2.5 cursor-pointer whitespace-nowrap hover:scale-105"
              >
                <InstagramIcon size={18} />
                <span>Instagram ({formatFollowerCount(igPlatform?.followersRaw ?? 48500)})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={fbPlatform?.url || "https://www.facebook.com/profile.php?id=61584924197861"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-blue-300 font-extrabold text-sm rounded-xl transition-all border border-[#1877F2]/40 shadow-xl flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105"
              >
                <FacebookIcon size={18} />
                <span>Facebook ({formatFollowerCount(fbPlatform?.followersRaw ?? 35200)})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={tiktokPlatform?.url || "https://www.tiktok.com/@oldbijou"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-extrabold text-sm rounded-xl transition-all border border-emerald-500/30 shadow-xl flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105"
              >
                <TikTokIcon size={18} />
                <span>TikTok ({formatFollowerCount(tiktokPlatform?.followersRaw ?? 28400)})</span>
              </a>
            </div>

            {/* Quick jump to channels */}
            <div className="pt-6 border-t border-neutral-800">
              <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent block mb-3 font-mono">
                {isAr ? 'جميع الحسابات الرسمية والإحصائيات الحية' : 'Comptes officiels & Statistiques'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPlatform(p.id)}
                    className="px-3.5 py-2 text-xs font-bold text-zinc-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 hover:border-amber-400/60 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isAr ? p.name : p.nameFr}</span>
                    <span className="text-amber-400 font-mono text-[11px] font-bold">
                      {p.followersCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo & Clean YouTube Feature Card Column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center w-full mt-6 md:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-sm md:max-w-full lg:max-w-md mx-auto">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

              {/* Clean Portrait Container (NO floating badge over image) */}
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-zinc-950 group">
                <img
                  src={INFLUENCER_PROFILE.avatar}
                  alt={isAr ? 'صورة صانع المحتوى الكروي OLDBIJOU' : 'Portrait of OLDBIJOU, football content creator'}
                  width={1080}
                  height={1080}
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* YouTube Channel Card Placed CLEANLY BELOW the photo */}
              <a
                href={ytPlatform?.url || "https://www.youtube.com/@oldbijou-1/videos"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full p-4 rounded-2xl bg-[#0e1017]/95 border-2 border-red-500/40 shadow-xl flex items-center justify-between gap-3 hover:border-red-400 hover:scale-[1.02] transition-all group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                    <YoutubeIcon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">
                      {isAr ? 'قناة @oldbijou-1 الرسمية' : 'Chaîne officielle @oldbijou-1'}
                    </div>
                    <div className="text-xs text-red-300 font-mono font-bold mt-0.5" dir="ltr">
                      {formatFollowerCount(ytPlatform?.followersRaw ?? 7690)} {isAr ? 'مشترك' : 'abonnés'} · 781 {isAr ? 'فيديو' : 'vidéos'}
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-red-600/20 text-red-300 text-xs font-bold shrink-0 border border-red-500/30">
                  {isAr ? 'اشتراك' : 'S\'abonner'}
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Official Platforms Follower Numbers Strip */}
        <div className="mt-16 pt-10 border-t border-neutral-800 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* YouTube: 7.67K+ */}
          <div className="flex flex-col p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-red-500/40 transition-colors">
            <span className="font-display text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-400 via-amber-200 to-yellow-300 bg-clip-text text-transparent font-mono tabular-nums">
              {ytPlatform?.followersCount || "7,670+"}
            </span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider mt-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>{isAr ? 'يوتيوب (770+ فيديو)' : 'YouTube (770+ vidéos)'}</span>
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5" dir="ltr">@oldbijou-1</span>
          </div>

          {/* Instagram: 48.5K */}
          <div className="flex flex-col p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-pink-500/40 transition-colors">
            <span className="font-display text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-400 via-amber-200 to-yellow-300 bg-clip-text text-transparent font-mono tabular-nums">
              {igPlatform?.followersCount || "48,500"}
            </span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider mt-1">
              {isAr ? 'إنستغرام' : 'Instagram'}
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5" dir="ltr">@oldbijou</span>
          </div>

          {/* Facebook: 35.2K */}
          <div className="flex flex-col p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-blue-500/40 transition-colors">
            <span className="font-display text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent font-mono tabular-nums">
              {fbPlatform?.followersCount || "35,200"}
            </span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider mt-1">
              {isAr ? 'فيسبوك' : 'Facebook'}
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5" dir="ltr">Old bijou Official</span>
          </div>

          {/* TikTok: 28.4K */}
          <div className="flex flex-col p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/40 transition-colors">
            <span className="font-display text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent font-mono tabular-nums">
              {tiktokPlatform?.followersCount || "28,400"}
            </span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider mt-1">
              {isAr ? 'تيك توك' : 'TikTok'}
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5" dir="ltr">@oldbijou</span>
          </div>
        </div>
      </div>
    </section>
  );
};
