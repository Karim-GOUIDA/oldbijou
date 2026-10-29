import React, { useState } from 'react';
import { Play, ExternalLink, X, Clock, Video, Plus, Sliders, Copy, Check } from 'lucide-react';
import { RealVideo, Language, SocialPlatform } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';
import { YoutubeIcon } from './BrandIcons';

interface RealVideosSectionProps {
  lang: Language;
  platforms?: SocialPlatform[];
  videos?: RealVideo[];
  onNavigateAdmin?: () => void;
}

export const RealVideosSection: React.FC<RealVideosSectionProps> = ({
  lang,
  platforms = [],
  videos = [],
  onNavigateAdmin
}) => {
  const [activeVideo, setActiveVideo] = useState<RealVideo | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const isAr = lang === 'ar';

  const yt = platforms.find((p) => p.id === 'youtube');
  const ytFormatted = formatFollowerCount(yt?.followersRaw ?? 7690);

  const handleCopyVideoUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="videos" className="py-20 md:py-28 bg-[#090b11] border-t border-amber-950/40 scroll-mt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent mb-2 font-mono">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>{isAr ? 'فيديوهات وتحليلات YouTube الرسمية' : 'Vidéos YouTube officielles'}</span>
              <span className="text-zinc-600" aria-hidden="true">·</span>
              <span className="text-amber-400/90 font-mono">
                {videos.length} {isAr ? 'فيديو' : 'vidéos'}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
              {isAr ? 'أحدث تحليلات وفيديوهات OLDBIJOU' : 'Dernières analyses et vidéos d\'OLDBIJOU'}
            </h2>
            <p className="text-zinc-300 text-base max-w-xl mt-3">
              {isAr
                ? 'استكشف أهم التحليلات التكتيكية، قصص الأساطير، وكواليس البطولات العالمية عبر قناة OLDBIJOU الرسمية.'
                : 'Découvrez les analyses tactiques, récits historiques et coulisses du football mondial sur la chaîne officielle d\'OLDBIJOU.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-300 hover:text-white font-bold text-xs rounded-xl transition-all border border-amber-500/30 flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105"
                title={isAr ? "إضافة أو تعديل الفيديوهات" : "Gérer les vidéos"}
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'إدارة وتعديل الفيديوهات ✏️' : 'Gérer les vidéos ✏️'}</span>
              </button>
            )}

            <a
              href="https://www.youtube.com/@oldbijou-1/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>{isAr ? `قناة @oldbijou-1 (${ytFormatted} مشترك · 781 فيديو)` : `Chaîne @oldbijou-1 (${ytFormatted} abonnés · 781 vidéos)`}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Real Featured Videos Grid */}
        {videos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0e111a] border border-neutral-800 text-center max-w-md mx-auto my-12">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-white mb-2">
              {isAr ? 'لا توجد فيديوهات مضافة حالياً' : 'Aucune vidéo pour le moment'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              {isAr ? 'يمكنك إضافة روابط الفيديوهات من لوحة التحكم' : 'Ajoutez vos vidéos depuis le panneau d\'administration'}
            </p>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة أول فيديو الآن' : 'Ajouter une vidéo'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <article
                key={video.id}
                className="group relative rounded-3xl overflow-hidden border border-neutral-800 bg-[#0e111a] shadow-xl hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    aria-label={isAr ? `مشاهدة الفيديو: ${video.titleAr}` : `Regarder la vidéo : ${video.titleFr || video.titleAr}`}
                    className="absolute inset-0 z-10 w-full cursor-pointer"
                  >
                    <img
                      src={video.thumbnail}
                      alt=""
                      width={480}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (video.fallbackThumbnail && e.currentTarget.src !== video.fallbackThumbnail) {
                          e.currentTarget.src = video.fallbackThumbnail;
                        }
                      }}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-black/30 to-transparent" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </span>
                    </span>
                  </button>

                  {/* Top Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30 font-mono">
                    {isAr ? `فيديو #${idx + 1}` : `Vidéo #${idx + 1}`}
                  </div>

                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-zinc-300 flex items-center gap-1">
                      <Clock size={11} />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Info Bottom */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <Video size={13} />
                        YouTube
                      </span>
                      <span>·</span>
                      <span className="text-amber-400/90">
                        {isAr ? video.tagAr : (video.tagFr || video.tagAr)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {isAr ? video.titleAr : (video.titleFr || video.titleAr)}
                    </h3>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 group-hover:underline flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAr ? 'مشاهدة التحليل الآن' : 'Visionner l\'analyse'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopyVideoUrl(video.url, e)}
                        className="p-2 text-zinc-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800 cursor-pointer"
                        title={isAr ? "نسخ رابط الفيديو" : "Copier le lien"}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-zinc-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800 cursor-pointer"
                        title={isAr ? "فتح في يوتيوب" : "Ouvrir sur YouTube"}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0e111a] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/90"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#08090E]/90">
              <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase font-mono">
                <YoutubeIcon className="w-4 h-4" />
                <span className="text-white font-display text-sm font-bold truncate max-w-md sm:max-w-xl">
                  {isAr ? activeVideo.titleAr : (activeVideo.titleFr || activeVideo.titleAr)}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label={isAr ? "إغلاق المشغل" : "Fermer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Iframe */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={activeVideo.embedUrl}
                title={isAr ? activeVideo.titleAr : (activeVideo.titleFr || activeVideo.titleAr)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-4 bg-[#0a0c13]">
              <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                <span>{isAr ? 'قناة OLDBIJOU الرسمية:' : 'Chaîne officielle :'}</span>
                <strong className="text-amber-300">@oldbijou-1</strong>
                {copiedLink && (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تم نسخ الرابط!' : 'Lien copié !'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleCopyVideoUrl(activeVideo.url, e)}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-bold text-xs rounded-xl transition-all border border-neutral-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مشاركة' : 'Partager'}</span>
                </button>

                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{isAr ? 'فتح على تطبيق YouTube' : 'Ouvrir sur YouTube'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
