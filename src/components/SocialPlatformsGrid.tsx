import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Users, Gem } from 'lucide-react';
import { SocialPlatform, Language } from '../data/influencerData';
import { PlatformIcon } from './BrandIcons';

interface SocialPlatformsGridProps {
  lang: Language;
  platforms: SocialPlatform[];
  isSyncing?: boolean;
  lastSynced?: Date;
  onRefresh?: () => void;
  onSelectPreview: (platform: SocialPlatform) => void;
  onOpenStats?: () => void;
  selectedPlatformId?: string | null;
}

export const SocialPlatformsGrid: React.FC<SocialPlatformsGridProps> = ({
  lang,
  platforms,
  onSelectPreview,
  onOpenStats,
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-amber-900/10 via-yellow-900/10 to-emerald-900/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent mb-2 font-mono">
            <Gem className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'المنصات الرسمية وعدد المتابعين' : 'Plateformes officielles certifiées'}</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>{isAr ? 'روابط وصول موثوقة' : 'Accès directs & vérifiés'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
            {isAr ? 'حسابات التواصل الاجتماعي لـ OLDBIJOU' : 'Réseaux sociaux officiels d\'OLDBIJOU'}
          </h2>
          <p className="text-zinc-300 text-base mt-3">
            {isAr
              ? 'تابع OLDBIJOU على جميع المنصات الرسمية لمواكبة أحدث التحليلات الكروية، قصص الأساطير، والريلز اليومية.'
              : 'Suivez OLDBIJOU sur l\'ensemble des réseaux officiels pour ne rien manquer des analyses, récits et exclusivités.'}
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
                className={`group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#111420]/95 to-[#0b0d15]/95 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-950/40 ${
                  isHighlighted
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                    : 'border-amber-500/20 hover:border-amber-400/50'
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
                          backgroundColor: `${platform.accentColor}20`,
                          color: platform.accentColor
                        }}
                      >
                        <PlatformIcon type={platform.iconType} size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                            {isAr ? platform.name : platform.nameFr}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
                      className="p-2 text-zinc-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 rounded-xl transition-all border border-neutral-700/50 cursor-pointer"
                    >
                      {copiedId === platform.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* PROMINENT NUMBER OF FOLLOWERS BOX */}
                  <div className="my-5 p-4 rounded-2xl bg-[#08090E]/90 border border-amber-500/20 group-hover:border-amber-400/40 transition-colors">
                    <div className="flex items-baseline justify-between">
                      <div className="font-display text-3xl font-black bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-mono tabular-nums">
                        {platform.followersCount}
                      </div>
                      {platform.followingCountAr && (
                        <span className="text-[11px] font-bold text-amber-400/80 font-mono">
                          {isAr ? platform.followingCountAr : platform.followingCountFr}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? platform.followersLabelAr : platform.followersLabelFr}</span>
                      </div>

                      {onOpenStats && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStats();
                          }}
                          className="text-[10px] text-amber-300 hover:text-white font-mono hover:underline cursor-pointer"
                        >
                          {isAr ? 'تعديل ✏️' : 'Modifier ✏️'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Highlights tag */}
                  <div className="mb-4 inline-block px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-700/60 text-[11px] font-bold text-zinc-300">
                    {isAr ? platform.highlightsAr : platform.highlightsFr}
                  </div>

                  {/* Platform Description */}
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {isAr ? platform.descriptionAr : platform.descriptionFr}
                  </p>
                </div>

                {/* Direct Action Link */}
                <div className="relative z-10 pt-4 border-t border-neutral-800">
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
