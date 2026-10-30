import React, { useState } from 'react';
import { X, Copy, Check, Gem } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { INFLUENCER_PROFILE, Language } from '../data/influencerData';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, lang = 'ar' }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const profileUrl = typeof window === 'undefined'
    ? 'https://oldbijou.fyi/'
    : (() => {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1]?.toLowerCase();
      if (lastSegment === 'oldbijonumbers' || lastSegment === 'oldbijounumbers') {
        pathSegments.pop();
      }
      const publicPath = `/${pathSegments.join('/')}${pathSegments.length ? '/' : ''}`;
      return new URL(publicPath, window.location.origin).toString();
    })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopyError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setCopied(false);
    }
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
          <QRCodeSVG
            value={profileUrl}
            size={192}
            level="M"
            marginSize={2}
            bgColor="#ffffff"
            fgColor="#09090b"
            title={isAr ? 'رمز QR لفتح موقع OLDBIJOU' : 'QR code pour ouvrir le site OLDBIJOU'}
          />
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
        {copyError && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {isAr ? 'تعذر نسخ الرابط. يرجى المحاولة مرة أخرى.' : 'Impossible de copier le lien. Veuillez réessayer.'}
          </p>
        )}
      </div>
    </div>
  );
};
