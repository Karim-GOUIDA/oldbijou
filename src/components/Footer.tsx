import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { INFLUENCER_PROFILE, SOCIAL_PLATFORMS, Language } from '../data/influencerData';
import { PlatformIcon } from './BrandIcons';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050410] border-t border-purple-950/60 py-16 text-zinc-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-purple-950/80">
          {/* Brand info */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent font-mono">
                {INFLUENCER_PROFILE.name}
              </span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-sm font-bold text-amber-300 mb-1">
              {isAr ? INFLUENCER_PROFILE.mottoAr : INFLUENCER_PROFILE.mottoFr}
            </p>
            <p className="text-xs text-purple-300 font-mono mb-4">
              {isAr ? INFLUENCER_PROFILE.roleAr : INFLUENCER_PROFILE.roleFr} · {INFLUENCER_PROFILE.handle}
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {SOCIAL_PLATFORMS.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${isAr ? platform.name : platform.nameFr} (${platform.followersCount})`}
                  className="p-2.5 text-zinc-400 hover:text-white bg-purple-950/40 hover:bg-gradient-to-r hover:from-violet-600 hover:to-cyan-600 rounded-xl border border-purple-900/40 transition-all hover:scale-105 shadow-md"
                >
                  <PlatformIcon type={platform.iconType} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-4 font-mono">
              {isAr ? 'روابط الموقع' : 'Navigation'}
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <a href="#platforms" className="hover:text-cyan-300 transition-colors">
                  {isAr ? 'جميع المنصات والمتابعين' : 'Réseaux & Abonnés'}
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-violet-400 transition-colors">
                  {isAr ? 'فيديوهات يوتيوب' : 'Vidéos YouTube'}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-300 transition-colors">
                  {isAr ? 'التواصل والإيميل' : 'Contact & Email'}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Email & Official Info */}
          <div className="md:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-4 font-mono">
              {isAr ? 'معلومات التواصل' : 'Contact officiel'}
            </span>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-zinc-500 block text-xs">
                  {isAr ? 'البريد الإلكتروني المعتمد:' : 'Email officiel certifié :'}
                </span>
                <a
                  href={`mailto:${INFLUENCER_PROFILE.email}`}
                  className="text-white hover:text-cyan-300 font-mono transition-colors break-all"
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
                  href="https://www.youtube.com/@Mehdipita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline font-mono"
                  dir="ltr"
                >
                  @Mehdipita (23.1K)
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">
                  {isAr ? 'حساب إنستغرام الرسمي:' : 'Compte Instagram officiel :'}
                </span>
                <a
                  href="https://www.instagram.com/mehdipita/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline font-mono"
                  dir="ltr"
                >
                  @mehdipita (213K)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span>
              {isAr
                ? `الموقع الرسمي لصانع المحتوى ${INFLUENCER_PROFILE.name}`
                : `Site officiel de ${INFLUENCER_PROFILE.name}`}
            </span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
          >
            <span>{isAr ? 'الرجوع للأعلى' : 'Haut de page'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
