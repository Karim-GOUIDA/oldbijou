import React, { useState } from 'react';
import { X, Copy, Check, Gem } from 'lucide-react';
import { INFLUENCER_PROFILE, Language } from '../data/influencerData';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, lang = 'ar' }) => {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const profileUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.youtube.com/@oldbijou-1/videos';

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-[#0e111a] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 text-center shadow-black/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
            <Gem size={14} className="text-amber-400" />
            <span>{INFLUENCER_PROFILE.name} QR Code</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="p-5 my-5 bg-white rounded-2xl shadow-inner mx-auto inline-block border-2 border-amber-400/40">
          <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
            <rect x="5" y="5" width="26" height="26" fill="#09090b" rx="4" />
            <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
            <rect x="13" y="13" width="10" height="10" fill="#09090b" rx="2" />

            <rect x="69" y="5" width="26" height="26" fill="#09090b" rx="4" />
            <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
            <rect x="77" y="13" width="10" height="10" fill="#09090b" rx="2" />

            <rect x="5" y="69" width="26" height="26" fill="#09090b" rx="4" />
            <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
            <rect x="13" y="77" width="10" height="10" fill="#09090b" rx="2" />

            <rect x="36" y="8" width="6" height="6" fill="#09090b" />
            <rect x="46" y="8" width="6" height="6" fill="#09090b" />
            <rect x="56" y="8" width="6" height="6" fill="#09090b" />
            <rect x="36" y="18" width="6" height="6" fill="#09090b" />
            <rect x="48" y="22" width="6" height="6" fill="#09090b" />
            <rect x="58" y="18" width="6" height="6" fill="#09090b" />

            <rect x="8" y="36" width="6" height="6" fill="#09090b" />
            <rect x="18" y="46" width="6" height="6" fill="#09090b" />
            <rect x="8" y="56" width="6" height="6" fill="#09090b" />

            <rect x="36" y="36" width="28" height="28" fill="#F59E0B" rx="4" />
            <circle cx="50" cy="50" r="8" fill="#09090b" />
            <circle cx="50" cy="50" r="4" fill="#F59E0B" />

            <rect x="72" y="36" width="6" height="6" fill="#09090b" />
            <rect x="82" y="42" width="6" height="6" fill="#09090b" />
            <rect x="72" y="52" width="6" height="6" fill="#09090b" />
            <rect x="86" y="58" width="6" height="6" fill="#09090b" />

            <rect x="36" y="72" width="6" height="6" fill="#09090b" />
            <rect x="46" y="78" width="6" height="6" fill="#09090b" />
            <rect x="56" y="72" width="6" height="6" fill="#09090b" />
            <rect x="42" y="86" width="6" height="6" fill="#09090b" />
            <rect x="72" y="74" width="8" height="8" fill="#09090b" />
            <rect x="84" y="84" width="6" height="6" fill="#09090b" />
          </svg>
        </div>

        <h4 className="font-display text-xl font-black text-white font-mono">
          {INFLUENCER_PROFILE.name}
        </h4>
        <p className="text-xs text-zinc-400 font-mono mb-4 mt-1">
          {isAr ? 'امسح الباركود لفتح جميع حسابات OLDBIJOU' : 'Scannez pour ouvrir les comptes officiels'}
        </p>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isAr ? 'تم نسخ الرابط' : 'Lien copié'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{isAr ? 'نسخ رابط المشاركة' : 'Copier le lien'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
