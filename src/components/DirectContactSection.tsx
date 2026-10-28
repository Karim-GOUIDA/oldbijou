import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Copy, Check, Send, Mail, Gem, Trophy, Globe2 } from 'lucide-react';
import { YoutubeIcon, TikTokIcon, InstagramIcon, FacebookIcon } from './BrandIcons';
import { INFLUENCER_PROFILE, Language, SocialPlatform } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';

interface DirectContactSectionProps {
  lang: Language;
  platforms?: SocialPlatform[];
}

export const DirectContactSection: React.FC<DirectContactSectionProps> = ({ lang, platforms = [] }) => {
  // Starts strictly from 0 as requested, not static
  const [hypeCount, setHypeCount] = useState<number>(0);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isOnlineSyncing, setIsOnlineSyncing] = useState(false);
  const isAr = lang === 'ar';

  const yt = platforms.find((p) => p.id === 'youtube');
  const ig = platforms.find((p) => p.id === 'instagram');
  const fb = platforms.find((p) => p.id === 'facebook');
  const tt = platforms.find((p) => p.id === 'tiktok');

  const ytText = formatFollowerCount(yt?.followersRaw ?? 7690);
  const igText = formatFollowerCount(ig?.followersRaw ?? 48500);
  const fbText = formatFollowerCount(fb?.followersRaw ?? 35200);
  const ttText = formatFollowerCount(tt?.followersRaw ?? 28400);

  const emojis = ['💎', '⚽', '🏆', '🔥', '👑', '⚡'];

  // Fetch online gems count on mount and sync periodically across all users
  useEffect(() => {
    let isMounted = true;

    const fetchGems = async () => {
      try {
        const res = await fetch('/api/gems');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === 'number' && isMounted) {
            setHypeCount(data.count);
          }
        }
      } catch (err) {
        // Fallback silently if offline
      }
    };

    fetchGems();
    // Poll every 4 seconds to sync online clicks from all visitors
    const interval = setInterval(fetchGems, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleHype = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Immediate visual increment
    setHypeCount((prev) => prev + 1);

    // 2. Burst animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top - 20;
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

    // 3. Persist online on the server variable (not in session!)
    try {
      setIsOnlineSyncing(true);
      const res = await fetch('/api/gems/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === 'number') {
          setHypeCount(data.count);
        }
      }
    } catch (err) {
      console.warn('Failed to persist gem to server:', err);
    } finally {
      setIsOnlineSyncing(false);
    }
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

          {/* Interactive Hype Button Column (Jewels & Support) */}
          <div id="hype" className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0d101b] to-[#08090E] border border-amber-500/30 shadow-2xl relative scroll-mt-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-mono mb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'دعم الجمهور وجواهر التشجيع' : 'Force & Soutien communautaire'}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">
              {isAr ? 'أرسل جواهر الدعم لـ OLDBIJOU 💎' : 'Envoyez des joyaux à OLDBIJOU 💎'}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              {isAr
                ? 'اضغط لإرسال الدعم والشغف الكروي مباشرة والمساهمة في رفع العداد التفاعلي الحي!'
                : 'Cliquez pour envoyer votre énergie footballistique et faire grimper le compteur de soutien !'}
            </p>

            <div className="mb-6 p-4 rounded-2xl bg-[#090b12] border border-amber-500/20 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase font-bold text-zinc-400 mb-1">
                  <span>{isAr ? 'إجمالي الجواهر المرسلة' : 'Total de joyaux envoyés'}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAr ? 'أونلاين مباشر' : 'En ligne direct'}
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-mono tabular-nums">
                  {hypeCount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" />
              </div>
            </div>

            {/* Tap to Send Hype Button */}
            <div className="relative">
              <button
                onClick={handleHype}
                className="w-full py-5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none"
              >
                <Gem className="w-6 h-6 text-zinc-950 fill-current animate-bounce" />
                <span>{isAr ? 'أرسل جوهرة دعم كروي 💎' : 'Envoyer un bijou de soutien 💎'}</span>
              </button>

              {/* Floating Emojis */}
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
          </div>
        </div>
      </div>
    </section>
  );
};
