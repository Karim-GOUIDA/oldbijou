import React, { useState } from 'react';
import { Flame, Sparkles, Copy, Check, Send, Mail, Zap } from 'lucide-react';
import { YoutubeIcon, TikTokIcon, InstagramIcon, FacebookIcon } from './BrandIcons';
import { INFLUENCER_PROFILE, Language } from '../data/influencerData';

interface DirectContactSectionProps {
  lang: Language;
}

export const DirectContactSection: React.FC<DirectContactSectionProps> = ({ lang }) => {
  const [hypeCount, setHypeCount] = useState(84920);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const isAr = lang === 'ar';

  const emojis = ['🔥', '⚡', '⚽', '🏆', '💚', '👑'];

  const handleHype = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHypeCount((prev) => prev + 1);

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
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(INFLUENCER_PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section className="py-20 md:py-28 bg-[#070614] border-t border-purple-950/60 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-violet-600/15 via-indigo-600/20 to-cyan-500/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Reach & Official Contact Info (Anchored by #contact) */}
          <div id="contact" className="lg:col-span-7 space-y-6 scroll-mt-28">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'التواصل المباشر والإيميل الرسمي' : 'Contact direct & Email officiel'}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                {isAr ? 'تواصل مباشرة مع MEHDI PITA' : 'Contactez directement MEHDI PITA'}
              </h2>
              <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                {isAr
                  ? 'للتعاون، الإعلانات، أو التواصل المباشر مع MEHDI PITA، يمكنك مراسلته عبر البريد الإلكتروني الرسمي أو عبر منصات التواصل الرسمية.'
                  : 'Pour tout partenariat, sponsoring ou contact direct avec MEHDI PITA, contactez-le par email officiel ou sur ses réseaux.'}
              </p>
            </div>

            {/* Direct Email Card with 1-Click Copy */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#170e38] to-[#0c0a24] border-2 border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/30 text-cyan-300 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <Mail size={26} />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-zinc-400">
                    {isAr ? 'الإيميل الرسمي المعتمد' : 'Email officiel certifié'}
                  </div>
                  <div className="font-display text-lg sm:text-xl font-black text-white font-mono break-all" dir="ltr">
                    {INFLUENCER_PROFILE.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-purple-900/60 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-purple-700/50 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? (isAr ? "تم النسخ!" : "Copié !") : (isAr ? "نسخ الإيميل" : "Copier")}</span>
                </button>

                <a
                  href={`mailto:${INFLUENCER_PROFILE.email}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال رسالة' : 'Écrire un mail'}</span>
                </a>
              </div>
            </div>

            {/* Direct Channels Cards (4 official platforms) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <a
                href="https://www.instagram.com/mehdipita/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0d0c24] border border-pink-500/30 hover:border-pink-400 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <InstagramIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">Instagram</span>
                <span className="text-[11px] text-pink-400 font-bold font-mono">
                  {isAr ? '213K متابع' : '213K abonnés'}
                </span>
              </a>

              <a
                href="https://www.youtube.com/@Mehdipita"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0d0c24] border border-red-500/30 hover:border-red-500 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <YoutubeIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">YouTube</span>
                <span className="text-[11px] text-red-400 font-bold font-mono">
                  {isAr ? '23.1K مشترك' : '23.1K abonnés'}
                </span>
              </a>

              <a
                href="https://www.tiktok.com/@mehdi.piita"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0d0c24] border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <TikTokIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">TikTok</span>
                <span className="text-[11px] text-cyan-300 font-bold font-mono">
                  {isAr ? '13.2K متابع' : '13.2K abonnés'}
                </span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61563910933144"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0d0c24] border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FacebookIcon size={20} />
                </div>
                <span className="font-bold text-white text-xs">Facebook</span>
                <span className="text-[11px] text-blue-400 font-bold font-mono">
                  {isAr ? '113K متابع' : '113K abonnés'}
                </span>
              </a>
            </div>
          </div>

          {/* Interactive Hype Button Column (Secondary / Fan Support) */}
          <div id="hype" className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#120e2e] via-[#0d0a26] to-[#070617] border border-purple-500/30 shadow-2xl relative scroll-mt-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-mono mb-3">
              <Zap className="w-4 h-4 text-cyan-400 fill-current" />
              <span>{isAr ? 'نبض الجمهور والتفاعل المباشر' : 'Force & Soutien de la commu'}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">
              {isAr ? 'ارسل حماس وتشجيع لـ MEHDI PITA' : 'Envoyez de la force à MEHDI PITA'}
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              {isAr
                ? 'اضغط على الزر لإرسال الدعم والطاقة الإيجابية مباشرة في العداد الحي!'
                : 'Cliquez sur le bouton pour envoyer votre soutien et faire grimper le compteur en direct !'}
            </p>

            <div className="mb-6 p-4 rounded-2xl bg-[#080618] border border-purple-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase font-bold text-zinc-400">
                  {isAr ? 'إجمالي الحماس المرسل' : 'Total de force envoyée'}
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-400 bg-clip-text text-transparent font-mono tabular-nums">
                  {hypeCount.toLocaleString()}
                </div>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Tap to Send Hype Button */}
            <div className="relative">
              <button
                onClick={handleHype}
                className="w-full py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none"
              >
                <Flame className="w-6 h-6 text-cyan-200 fill-current animate-bounce" />
                <span>{isAr ? 'اضغط لإرسال الحماس 🔥' : 'Envoyer de la force 🔥'}</span>
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
