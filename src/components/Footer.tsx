import React from 'react';
import { ArrowUp, ShieldCheck, Gem, Lock } from 'lucide-react';
import { INFLUENCER_PROFILE, Language, SocialPlatform } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';
import { PlatformIcon } from './BrandIcons';

interface FooterProps {
  lang: Language;
  platforms?: SocialPlatform[];
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, platforms = [], onNavigateAdmin }) => {
  const isAr = lang === 'ar';

  const yt = platforms.find((p) => p.id === 'youtube');
  const ig = platforms.find((p) => p.id === 'instagram');
  const ytText = formatFollowerCount(yt?.followersRaw ?? 7690);
  const igText = formatFollowerCount(ig?.followersRaw ?? 48500);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05060A] border-t border-amber-950/40 py-16 text-zinc-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand info */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md">
                <Gem className="w-4 h-4 fill-current" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-mono">
                {INFLUENCER_PROFILE.name}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-amber-300 mb-1">
              {isAr ? INFLUENCER_PROFILE.mottoAr : INFLUENCER_PROFILE.mottoFr}
            </p>
            <p className="text-xs text-zinc-400 font-mono mb-4">
              {isAr ? INFLUENCER_PROFILE.roleAr : INFLUENCER_PROFILE.roleFr} · {INFLUENCER_PROFILE.handle}
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${isAr ? platform.name : platform.nameFr} (${platform.followersCount})`}
                  className="p-2.5 text-zinc-400 hover:text-white bg-neutral-900/60 hover:bg-amber-500 hover:text-zinc-950 rounded-xl border border-neutral-800 transition-all hover:scale-105 shadow-md"
                >
                  <PlatformIcon type={platform.iconType} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label={isAr ? 'روابط الموقع' : 'Navigation du site'} className="md:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-4 font-mono">
              {isAr ? 'روابط الموقع' : 'Navigation'}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <a href="#platforms" className="hover:text-amber-300 transition-colors">
                  {isAr ? 'المنصات الرسمية والمتابعين' : 'Réseaux & Abonnés'}
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-amber-300 transition-colors">
                  {isAr ? 'فيديوهات وتحليلات YouTube' : 'Vidéos YouTube'}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors">
                  {isAr ? 'التواصل والإيميل' : 'Contact & Email'}
                </a>
              </li>
              {onNavigateAdmin && (
                <li className="pt-2">
                  <button
                    onClick={onNavigateAdmin}
                    className="text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>/oldbijonumbers</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Direct Email & Official Info */}
          <section aria-labelledby="footer-contact-heading" className="md:col-span-3">
            <h2 id="footer-contact-heading" className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-4 font-mono">
              {isAr ? 'معلومات التواصل المعتمدة' : 'Contact officiel'}
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-zinc-500 block text-xs">
                  {isAr ? 'البريد الإلكتروني المعتمد:' : 'Email officiel certifié :'}
                </span>
                <a
                  href={`mailto:${INFLUENCER_PROFILE.email}`}
                  className="text-white hover:text-amber-300 font-mono transition-colors break-all"
                  dir="ltr"
                >
                  {INFLUENCER_PROFILE.email}
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">
                  {isAr ? 'قناة يوتيوب الرسمية:' : 'Chaîne YouTube officielle :'}
                </span>
                <a
                  href="https://www.youtube.com/@oldbijou-1/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline font-mono"
                  dir="ltr"
                >
                  @oldbijou-1 ({ytText} / 781 vidéos)
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">
                  {isAr ? 'حساب إنستغرام الرسمي:' : 'Compte Instagram officiel :'}
                </span>
                <a
                  href="https://www.instagram.com/oldbijou/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-mono"
                  dir="ltr"
                >
                  @oldbijou ({igText})
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Quiet copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span>
              {isAr
                ? `الموقع والمنصة الرسمية لـ ${INFLUENCER_PROFILE.name}`
                : `Site officiel de ${INFLUENCER_PROFILE.name}`}
            </span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer font-bold"
          >
            <span>{isAr ? 'الرجوع للأعلى' : 'Haut de page'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
