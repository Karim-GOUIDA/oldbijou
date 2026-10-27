import React, { useState } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';
import { REAL_YOUTUBE_VIDEOS, RealVideo, Language } from '../data/influencerData';
import { YoutubeIcon } from './BrandIcons';

interface RealVideosSectionProps {
  lang: Language;
}

export const RealVideosSection: React.FC<RealVideosSectionProps> = ({ lang }) => {
  const [activeVideo, setActiveVideo] = useState<RealVideo | null>(null);
  const isAr = lang === 'ar';

  return (
    <section id="videos" className="py-20 md:py-28 bg-[#080718] border-t border-purple-950/60 scroll-mt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-mono">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>{isAr ? 'فيديوهات يوتيوب الرسمية' : 'Vidéos YouTube officielles'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white [text-wrap:balance]">
              {isAr ? 'أحدث فيديوهات MEHDI PITA على YouTube' : 'Dernières vidéos YouTube de MEHDI PITA'}
            </h2>
            <p className="text-zinc-300 text-base max-w-xl mt-3">
              {isAr
                ? 'شاهد الفيديوهات الحصرية مباشرة عبر الموقع أو افتحها على تطبيق يوتيوب بضغطة زر واحدة.'
                : 'Regardez les vidéos exclusives directement sur le site ou ouvrez-les sur l\'application YouTube en un clic.'}
            </p>
          </div>

          <a
            href="https://www.youtube.com/@Mehdipita"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <YoutubeIcon className="w-4 h-4" />
            <span>{isAr ? 'قناة @Mehdipita (23.1K مشترك)' : 'Chaîne @Mehdipita (23.1K abonnés)'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Real YouTube Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REAL_YOUTUBE_VIDEOS.map((video, idx) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative rounded-3xl overflow-hidden border border-purple-500/25 bg-[#0c0a22] cursor-pointer shadow-xl hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] transition-all flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={video.thumbnail}
                  alt={isAr ? video.titleAr : video.titleFr}
                  onError={(e) => {
                    e.currentTarget.src = video.fallbackThumbnail;
                  }}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a22] via-black/20 to-transparent" />

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-cyan-300 border border-purple-500/30 font-mono">
                  {isAr ? `فيديو #${idx + 1}` : `Vidéo #${idx + 1}`}
                </div>
              </div>

              {/* Info Bottom */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                    <span className="text-red-400 font-bold">YouTube</span>
                    <span>·</span>
                    <span>{isAr ? video.tagAr : video.tagFr}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {isAr ? video.titleAr : video.titleFr}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-purple-900/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 group-hover:underline flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'تشغيل الفيديو الآن' : 'Lire la vidéo'}</span>
                  </span>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-zinc-400 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 rounded-lg transition-colors border border-purple-800/40"
                    title={isAr ? "فتح في يوتيوب" : "Ouvrir sur YouTube"}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0c0a22] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-[#070614]/80">
              <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase font-mono">
                <YoutubeIcon className="w-4 h-4" />
                <span className="text-white font-display text-sm font-bold truncate max-w-md sm:max-w-xl">
                  {isAr ? activeVideo.titleAr : activeVideo.titleFr}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-purple-950 transition-colors cursor-pointer"
                aria-label={isAr ? "إغلاق المشغل" : "Fermer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Iframe */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={activeVideo.embedUrl}
                title={isAr ? activeVideo.titleAr : activeVideo.titleFr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-4 bg-[#09071c]">
              <div className="text-xs text-zinc-400 font-mono">
                {isAr ? 'معرف الفيديو:' : 'ID vidéo :'} <strong className="text-cyan-300">{activeVideo.youtubeId}</strong>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{isAr ? 'فتح في تطبيق YouTube' : 'Ouvrir sur YouTube'}</span>
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
