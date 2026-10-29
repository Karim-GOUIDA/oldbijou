import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, Mail, Trophy } from 'lucide-react';
import { YoutubeIcon, TikTokIcon, InstagramIcon, FacebookIcon } from './BrandIcons';
import { INFLUENCER_PROFILE, Language, SocialPlatform } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';

interface DirectContactSectionProps {
  lang: Language;
  platforms?: SocialPlatform[];
  gemsCount: number;
  onSendSupport: () => Promise<number>;
}

export const DirectContactSection: React.FC<DirectContactSectionProps> = ({
  lang,
  platforms = [],
  gemsCount,
  onSendSupport,
}) => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);
  const isAr = lang === 'ar';

  const yt = platforms.find((p) => p.id === 'youtube');
  const ig = platforms.find((p) => p.id === 'instagram');
  const fb = platforms.find((p) => p.id === 'facebook');
  const tt = platforms.find((p) => p.id === 'tiktok');

  const ytText = formatFollowerCount(yt?.followersRaw ?? 7690);
  const igText = formatFollowerCount(ig?.followersRaw ?? 48500);
  const fbText = formatFollowerCount(fb?.followersRaw ?? 35200);
  const ttText = formatFollowerCount(tt?.followersRaw ?? 28400);

  const emojis = ['⚽', '🏆', '🔥', '👏', '💚', '⚡'];

  const handleSupportClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSendingSupport) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top - 20;
    setIsSendingSupport(true);
    setSupportError(null);
    try {
      await onSendSupport();
    } catch (error) {
      setSupportError(
        error instanceof Error
          ? error.message
          : (isAr ? 'تعذر إرسال الدعم. حاول مرة أخرى.' : 'Impossible d’envoyer le soutien. Réessayez.')
      );
      setIsSendingSupport(false);
      return;
    }

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newBurst = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: randomEmoji
    };

    setBursts((prev) => [...prev.slice(-15), newBurst]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 1200);
    setIsSendingSupport(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(INFLUENCER_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section className="py-20 md:py-28 bg-[#08090E] border-t border-amber-950/30 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-emerald-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Reach & Official Contact Info (Anchored by #contact) */}
          <div id="contact" className="lg:col-span-7 space-y-6 scroll-mt-28">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'التواصل المباشر والإيميل الرسمي' : 'Contact direct & Email officiel'}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                {isAr ? 'تواصل مباشرة مع OLDBIJOU' : 'Contactez directement OLDBIJOU'}
              </h2>
              <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                {isAr
                  ? 'للتعاون الإعلامي، الرعاية الرياضية، الشراكات الإعلانية، أو الاستفسارات، تواصل مع فريق OLDBIJOU عبر البريد الإلكتروني الرسمي.'
                  : 'Pour les collaborations médias, sponsorings sportifs ou partenariats, écrivez directement à l\'équipe d\'OLDBIJOU.'}
              </p>
            </div>

            {/* Direct Email Card with 1-Click Copy */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#141724] to-[#0c0f18] border-2 border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Mail size={26} />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-zinc-400">
                    {isAr ? 'البريد الإلكتروني الرسمي المعتمد' : 'Email officiel certifié'}
                  </div>
                  <div className="font-display text-lg sm:text-xl font-black text-amber-100 font-mono break-all" dir="ltr">
                    {INFLUENCER_PROFILE.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? (isAr ? "تم النسخ!" : "Copié !") : (isAr ? "نسخ الإيميل" : "Copier")}</span>
                </button>

                <a
                  href={`mailto:${INFLUENCER_PROFILE.email}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال رسالة' : 'Écrire un mail'}</span>
                </a>
              </div>
            </div>

            {/* Direct Channels Cards (4 official platforms) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <a
                href={yt?.url || "https://www.youtube.com/@oldbijou-1/videos"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0e111a] border border-red-500/30 hover:border-red-400 transition-all flex flex-col items-center text-center group cursor-pointer hover:scale-105"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <YoutubeIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">YouTube</span>
                <span className="text-[11px] text-red-400 font-bold font-mono">
                  {ytText} {isAr ? 'مشترك' : 'abonnés'}
                </span>
              </a>

              <a
                href={ig?.url || "https://www.instagram.com/oldbijou/?hl=en"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0e111a] border border-pink-500/30 hover:border-pink-400 transition-all flex flex-col items-center text-center group cursor-pointer hover:scale-105"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <InstagramIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">Instagram</span>
                <span className="text-[11px] text-pink-400 font-bold font-mono">
                  {igText} {isAr ? 'متابع' : 'abonnés'}
                </span>
              </a>

              <a
                href={fb?.url || "https://www.facebook.com/profile.php?id=61584924197861"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0e111a] border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col items-center text-center group cursor-pointer hover:scale-105"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FacebookIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">Facebook</span>
                <span className="text-[11px] text-blue-400 font-bold font-mono">
                  {fbText} {isAr ? 'متابع' : 'abonnés'}
                </span>
              </a>

              <a
                href={tt?.url || "https://www.tiktok.com/@oldbijou"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0e111a] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col items-center text-center group cursor-pointer hover:scale-105"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <TikTokIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">TikTok</span>
                <span className="text-[11px] text-emerald-400 font-bold font-mono">
                  {ttText} {isAr ? 'متابع' : 'abonnés'}
                </span>
              </a>
            </div>
          </div>

          {/* Interactive football support */}
          <div id="hype" className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#08251b] via-[#0d1715] to-[#08090E] border border-emerald-500/35 shadow-2xl relative scroll-mt-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 font-mono mb-3">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تشجيع الجمهور' : 'Encouragement des supporters'}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">
              {isAr ? 'شجّع OLDBIJOU ⚽' : 'Encouragez OLDBIJOU ⚽'}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              {isAr
                ? 'أرسل تشجيعك الكروي وساهم في عدّاد دعم الجمهور!'
                : 'Envoyez votre encouragement football et faites monter le compteur des supporters !'}
            </p>

            <div className="mb-6 p-4 rounded-2xl bg-[#090f0d] border border-emerald-500/25 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase font-bold text-zinc-400 mb-1">
                  <span>{isAr ? 'إجمالي تشجيعات الجمهور' : 'Total des encouragements'}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAr ? 'مباشر' : 'En direct'}
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-200 via-green-300 to-lime-300 bg-clip-text text-transparent font-mono tabular-nums">
                  {gemsCount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl" aria-hidden="true">⚽</span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={handleSupportClick}
                disabled={isSendingSupport}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 disabled:opacity-70 disabled:cursor-wait text-zinc-950 font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none"
              >
                <span className="text-2xl" aria-hidden="true">⚽</span>
                <span>
                  {isSendingSupport
                    ? (isAr ? 'جارٍ إرسال التشجيع...' : 'Envoi en cours...')
                    : (isAr ? 'أرسل تشجيعًا كرويًا' : 'Envoyer un soutien football')}
                </span>
              </button>

              {bursts.map((burst) => (
                <span
                  key={burst.id}
                  style={{
                    left: `${burst.x}px`,
                    top: `${burst.y}px`
                  }}
                  className="absolute pointer-events-none text-2xl animate-float-up transition-all font-sans"
                >
                  {burst.emoji}
                </span>
              ))}
            </div>
            {supportError && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {supportError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
