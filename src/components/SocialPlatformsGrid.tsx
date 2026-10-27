import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Users } from 'lucide-react';
import { SocialPlatform, Language } from '../data/influencerData';
import { PlatformIcon } from './BrandIcons';

interface SocialPlatformsGridProps {
  lang: Language;
  platforms: SocialPlatform[];
  isSyncing?: boolean;
  lastSynced?: Date;
  onRefresh?: () => void;
  onSelectPreview: (platform: SocialPlatform) => void;
  selectedPlatformId?: string | null;
}

export const SocialPlatformsGrid: React.FC<SocialPlatformsGridProps> = ({
  lang,
  platforms,
  onSelectPreview,
  selectedPlatformId
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isAr = lang === 'ar';

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="platforms" className="py-20 md:py-28 relative scroll-mt-16">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-violet-900/10 via-indigo-900/15 to-cyan-900/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-mono">
            <span>{isAr ? 'جميع المنصات الرسمية وعدد المتابعين' : 'Toutes les plateformes officielles'}</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>{isAr ? 'روابط مباشرة ومؤكدة' : 'Liens directs & certifiés'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
            {isAr ? 'حسابات التواصل الاجتماعي لـ MEHDI PITA' : 'Réseaux sociaux officiels de MEHDI PITA'}
          </h2>
          <p className="text-zinc-300 text-base mt-3">
            {isAr
              ? 'جميع المنصات الرسمية لـ MEHDI PITA بأحدث أرقام المتابعين والمشتركين وروابط الوصول المباشرة.'
              : 'Tous les comptes officiels de MEHDI PITA avec les statistiques exactes et liens d\'accès directs.'}
          </p>
        </div>

        {/* Platforms Grid (Clean 4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const isHighlighted = selectedPlatformId === platform.id;

            return (
              <div
                key={platform.id}
                id={`platform-card-${platform.id}`}
                className={`group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#110e2b]/95 to-[#09071c]/95 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/80 ${
                  isHighlighted
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    : 'border-purple-500/25 hover:border-purple-500/60'
                }`}
              >
                {/* Platform flare */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-13 h-13 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shrink-0"
                        style={{
                          backgroundColor: `${platform.accentColor}25`,
                          color: platform.accentColor
                        }}
                      >
                        <PlatformIcon type={platform.iconType} size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                            {isAr ? platform.name : platform.nameFr}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5" dir="ltr">
                          {platform.handle}
                        </div>
                      </div>
                    </div>

                    {/* Copy handle button */}
                    <button
                      onClick={(e) => handleCopy(platform.id, platform.url, e)}
                      title={isAr ? "نسخ رابط الحساب" : "Copier le lien"}
                      className="p-2 text-zinc-400 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 rounded-xl transition-all border border-purple-800/40 cursor-pointer"
                    >
                      {copiedId === platform.id ? (
                        <Check className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* PROMINENT NUMBER OF FOLLOWERS BOX */}
                  <div className="my-5 p-4 rounded-2xl bg-[#09071c]/90 border border-purple-500/30 group-hover:border-cyan-400/50 transition-colors">
                    <div className="flex items-baseline justify-between">
                      <div className="font-display text-3xl font-black bg-gradient-to-r from-violet-200 via-indigo-100 to-cyan-300 bg-clip-text text-transparent font-mono tabular-nums">
                        {platform.followersCount}
                      </div>
                      {platform.followingCountAr && (
                        <span className="text-[11px] font-bold text-pink-400 font-mono">
                          {isAr ? platform.followingCountAr : platform.followingCountFr}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isAr ? platform.followersLabelAr : platform.followersLabelFr}</span>
                    </div>
                  </div>

                  {/* Highlights tag */}
                  <div className="mb-4 inline-block px-3 py-1 rounded-lg bg-purple-950/50 border border-purple-500/20 text-[11px] font-bold text-zinc-300">
                    {isAr ? platform.highlightsAr : platform.highlightsFr}
                  </div>

                  {/* Platform Description */}
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {isAr ? platform.descriptionAr : platform.descriptionFr}
                  </p>
                </div>

                {/* Direct Action Link */}
                <div className="relative z-10 pt-4 border-t border-purple-900/40">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] shadow-md cursor-pointer"
                    style={{
                      backgroundColor: platform.accentColor,
                      color: platform.id === 'tiktok' ? '#000' : '#fff'
                    }}
                  >
                    <span>{isAr ? platform.directActionLabelAr : platform.directActionLabelFr}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
