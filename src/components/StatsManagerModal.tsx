import React, { useState } from 'react';
import { X, RefreshCw, Check, ShieldCheck, Zap, Sliders, Database, ExternalLink, HelpCircle } from 'lucide-react';
import { Language, SocialPlatform } from '../data/influencerData';
import { getStoredStatsConfig } from '../services/statsSync';
import { PlatformIcon } from './BrandIcons';

interface StatsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  platforms: SocialPlatform[];
  isSyncing: boolean;
  syncSource: string;
  onRefresh: () => void;
  onUpdateManualCount: (platformId: string, count: number) => void;
  onUpdateApiConfig: (apiUrl: string, apiKey?: string) => void;
}

export const StatsManagerModal: React.FC<StatsManagerModalProps> = ({
  isOpen,
  onClose,
  lang,
  platforms,
  isSyncing,
  syncSource,
  onRefresh,
  onUpdateManualCount,
  onUpdateApiConfig
}) => {
  const isAr = lang === 'ar';
  const currentConfig = getStoredStatsConfig();

  const [inputCounts, setInputCounts] = useState<{ [key: string]: string }>({
    youtube: currentConfig.manualOverrides.youtube?.toString() || '7690',
    instagram: currentConfig.manualOverrides.instagram?.toString() || '48500',
    facebook: currentConfig.manualOverrides.facebook?.toString() || '35200',
    tiktok: currentConfig.manualOverrides.tiktok?.toString() || '28400'
  });

  const [apiUrl, setApiUrl] = useState(currentConfig.apiUrl || '');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'real_numbers' | 'api_integration'>('real_numbers');

  if (!isOpen) return null;

  const handleSaveNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(inputCounts).forEach(([platformId, val]) => {
      const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        onUpdateManualCount(platformId, parsed);
      }
    });

    if (apiUrl.trim()) {
      onUpdateApiConfig(apiUrl.trim(), apiKey.trim() || undefined);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e111a] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/95 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#08090E]/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                {isAr ? 'مركز إدارة الأرقام الحقيقية وربط الـ APIs' : 'Gestion des Métriques Réelles & APIs'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                {isAr ? `المصدر الحالي: ${syncSource}` : `Source : ${syncSource}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-800 px-6 bg-[#0a0c14]">
          <button
            onClick={() => setActiveTab('real_numbers')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'real_numbers'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{isAr ? 'الأرقام الحقيقية المعتمدة' : 'Métriques réelles'}</span>
          </button>

          <button
            onClick={() => setActiveTab('api_integration')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'api_integration'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Database size={14} />
            <span>{isAr ? 'ربط APIs خارجية (Metrika / RapidAPI)' : 'APIs externes'}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'real_numbers' ? (
            <form onSubmit={handleSaveNumbers} className="space-y-6">
              {/* Notice Box explaining API mechanics */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-bold mb-1">
                    {isAr ? 'شفافية وتحديث الأرقام بنسبة 100%' : 'Mise à jour 100% exacte'}
                  </strong>
                  {isAr
                    ? 'يتم جلب يوتيوب آلياً من القناة الرسمية (@oldbijou-1). نظراً لطلب Meta وTikTok صلاحيات خاصة (OAuth Tokens) للحسابات، يمكنك كتابة أرقامك الحقيقية الدقيقة هنا بضغطة زر لحفظها وتحديث الموقع بالكامل فوراً!'
                    : 'YouTube est synchronisé automatiquement avec @oldbijou-1. Pour Instagram, Facebook et TikTok nécessitant des jetons Meta/TikTok, vous pouvez saisir ici vos chiffres exacts pour mettre à jour tout le site.'}
                </div>
              </div>

              {/* Grid of Inputs for each platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="p-4 rounded-2xl bg-[#090b12] border border-neutral-800 focus-within:border-amber-400/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlatformIcon type={platform.iconType} size={18} />
                        <span className="font-bold text-white text-xs">
                          {isAr ? platform.name : platform.nameFr}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono" dir="ltr">
                        {platform.handle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={inputCounts[platform.id] || ''}
                        onChange={(e) =>
                          setInputCounts({ ...inputCounts, [platform.id]: e.target.value })
                        }
                        className="w-full bg-[#121624] border border-neutral-700/60 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                        dir="ltr"
                      />
                      <span className="text-xs text-zinc-400 whitespace-nowrap font-bold">
                        {platform.id === 'youtube'
                          ? (isAr ? 'مشترك' : 'subs')
                          : (isAr ? 'متابع' : 'followers')}
                      </span>
                    </div>

                    {platform.id === 'youtube' && (
                      <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Zap size={11} />
                        <span>{isAr ? 'مزامنة حية نشطة (7.69K / 781 فيديو)' : 'Synchronisé en direct'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isSyncing}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isAr ? 'إعادة فحص الـ APIs الآن' : 'Actualiser les APIs'}</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{isAr ? 'تم حفظ الأرقام وتحديث الموقع!' : 'Enregistré et mis à jour !'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'حفظ وتطبيق الأرقام الحقيقية' : 'Enregistrer les métriques'}</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-zinc-300 leading-relaxed">
                <p className="mb-2">
                  {isAr
                    ? 'إذا كنت تستخدم خدمة API موحدة (مثل Metrika API أو RapidAPI أو Scrape Everything) لجلب الأرقام في رابط واحد JSON، ضع الرابط هنا:'
                    : 'Si vous utilisez un service d\'API unifiée (ex: Metrika, RapidAPI, Scrape Everything) renvoyant un JSON avec les statistiques :'}
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 font-mono text-[11px] text-amber-300" dir="ltr">
                  &#123; "youtube": 7690, "instagram": 48500, "facebook": 35200, "tiktok": 28400 &#125;
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  {isAr ? 'رابط الـ API الموحد (API Endpoint URL)' : 'URL de l\'endpoint API'}
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-[#121624] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  {isAr ? 'مفتاح الـ API (API Key / Bearer Token - اختياري)' : 'Clé API / Token (Optionnel)'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#121624] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNumbers}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <span>{isAr ? 'حفظ إعدادات الـ API' : 'Enregistrer la configuration'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
