import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  Eye,
  Sliders,
  Sparkles,
  Gem,
  AlertCircle,
  Video,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Play,
  Clock,
  Film,
  X,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  Zap,
  Layers,
  Globe
} from 'lucide-react';
import { SocialPlatform, Language, RealVideo } from '../data/influencerData';
import { formatFollowerCount } from '../services/statsSync';
import { extractYouTubeId } from '../services/videoManager';
import { YoutubeIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '../components/BrandIcons';

interface NumbersAdminPageProps {
  lang: Language;
  onToggleLang?: () => void;
  platforms: SocialPlatform[];
  isSyncing: boolean;
  syncSource: string;
  onRefresh: () => void;
  onUpdateMultipleCounts: (counts: {
    youtube?: number;
    instagram?: number;
    facebook?: number;
    tiktok?: number;
  }) => void;
  onResetDefaults: () => void;
  onNavigateHome: () => void;
  videos: RealVideo[];
  onAddVideo: (data: {
    youtubeInput: string;
    titleAr: string;
    titleFr?: string;
    tagAr?: string;
    tagFr?: string;
    duration?: string;
  }) => boolean;
  onUpdateVideo: (
    id: string,
    data: {
      youtubeInput?: string;
      titleAr?: string;
      titleFr?: string;
      tagAr?: string;
      tagFr?: string;
      duration?: string;
    }
  ) => boolean;
  onDeleteVideo: (id: string) => void;
  onResetVideos: () => void;
  onMoveVideo: (idx: number, direction: 'up' | 'down') => void;
}

const AUTH_STORAGE_KEY = 'oldbijou_admin_authenticated_session';

export const NumbersAdminPage: React.FC<NumbersAdminPageProps> = ({
  lang,
  onToggleLang,
  platforms,
  isSyncing,
  syncSource,
  onRefresh,
  onUpdateMultipleCounts,
  onResetDefaults,
  onNavigateHome,
  videos,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  onResetVideos,
  onMoveVideo
}) => {
  const [adminLang, setAdminLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('oldbijou_admin_lang');
      if (saved === 'fr' || saved === 'ar') return saved as Language;
    } catch {
      // ignore
    }
    return lang || 'ar';
  });

  useEffect(() => {
    if (lang && lang !== adminLang) {
      setAdminLang(lang);
    }
  }, [lang]);

  const handleToggleLanguage = () => {
    const next = adminLang === 'ar' ? 'fr' : 'ar';
    setAdminLang(next);
    try {
      localStorage.setItem('oldbijou_admin_lang', next);
    } catch {
      // ignore
    }
    if (onToggleLang) {
      onToggleLang();
    }
  };

  const isAr = adminLang === 'ar';

  // Navigation tab inside Admin: 'numbers' | 'videos'
  const [activeTab, setActiveTab] = useState<'numbers' | 'videos'>('numbers');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Values for the 4 platforms
  const yt = platforms.find((p) => p.id === 'youtube');
  const ig = platforms.find((p) => p.id === 'instagram');
  const fb = platforms.find((p) => p.id === 'facebook');
  const tt = platforms.find((p) => p.id === 'tiktok');

  const [ytCount, setYtCount] = useState<string>(() => (yt?.followersRaw ?? 7690).toString());
  const [igCount, setIgCount] = useState<string>(() => (ig?.followersRaw ?? 48500).toString());
  const [fbCount, setFbCount] = useState<string>(() => (fb?.followersRaw ?? 35200).toString());
  const [ttCount, setTtCount] = useState<string>(() => (tt?.followersRaw ?? 28400).toString());

  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Video Form States (NO placeholders)
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoTag, setNewVideoTag] = useState('تحليل تكتيكي');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [videoFormError, setVideoFormError] = useState('');

  // Editing Video state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Previewing Video in modal
  const [previewVideo, setPreviewVideo] = useState<RealVideo | null>(null);

  // Sync inputs if platforms change from external sync
  useEffect(() => {
    if (yt?.followersRaw) setYtCount(yt.followersRaw.toString());
    if (ig?.followersRaw) setIgCount(ig.followersRaw.toString());
    if (fb?.followersRaw) setFbCount(fb.followersRaw.toString());
    if (tt?.followersRaw) setTtCount(tt.followersRaw.toString());
  }, [yt?.followersRaw, ig?.followersRaw, fb?.followersRaw, tt?.followersRaw]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim().toLowerCase();

    if (cleanUser === 'oldbijou' && cleanPass === 'oldbijou') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    } else {
      setAuthError(
        isAr
          ? 'اسم المستخدم أو الرمز السري غير صحيح. يرجى التأكد من إدخال oldbijou / oldbijou'
          : 'Nom d\'utilisateur ou code secret incorrect. Utilisez oldbijou / oldbijou'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Helper to parse numeric string safely
  const parseNum = (str: string, fallback: number) => {
    const cleaned = str.replace(/[^0-9]/g, '');
    if (!cleaned) return 0;
    const val = parseInt(cleaned, 10);
    return isNaN(val) ? fallback : val;
  };

  const currentYt = parseNum(ytCount, 7690);
  const currentIg = parseNum(igCount, 48500);
  const currentFb = parseNum(fbCount, 35200);
  const currentTt = parseNum(ttCount, 28400);

  // Single Input Controller: adjust single platform number
  const adjustSingle = (platform: 'youtube' | 'instagram' | 'facebook' | 'tiktok', delta: number) => {
    if (platform === 'youtube') {
      const next = Math.max(0, currentYt + delta);
      setYtCount(next.toString());
    } else if (platform === 'instagram') {
      const next = Math.max(0, currentIg + delta);
      setIgCount(next.toString());
    } else if (platform === 'facebook') {
      const next = Math.max(0, currentFb + delta);
      setFbCount(next.toString());
    } else if (platform === 'tiktok') {
      const next = Math.max(0, currentTt + delta);
      setTtCount(next.toString());
    }
  };

  // Master Control: adjust all 4 input numbers simultaneously
  const adjustAll = (delta: number) => {
    setYtCount(Math.max(0, currentYt + delta).toString());
    setIgCount(Math.max(0, currentIg + delta).toString());
    setFbCount(Math.max(0, currentFb + delta).toString());
    setTtCount(Math.max(0, currentTt + delta).toString());
  };

  // Master Control: Apply a preset bundle to all numbers
  const applyPresetBundle = (bundle: { yt: number; ig: number; fb: number; tt: number }, label: string) => {
    setYtCount(bundle.yt.toString());
    setIgCount(bundle.ig.toString());
    setFbCount(bundle.fb.toString());
    setTtCount(bundle.tt.toString());
    setSavedSuccess(isAr ? `تم تطبيق حزمة: ${label}` : `Préréglage appliqué : ${label}`);
    setTimeout(() => setSavedSuccess(null), 2500);
  };

  // Clear single platform number
  const clearSingle = (platform: 'youtube' | 'instagram' | 'facebook' | 'tiktok') => {
    if (platform === 'youtube') setYtCount('0');
    if (platform === 'instagram') setIgCount('0');
    if (platform === 'facebook') setFbCount('0');
    if (platform === 'tiktok') setTtCount('0');
  };

  // Save all numbers at once
  const handleSaveNumbers = () => {
    onUpdateMultipleCounts({
      youtube: currentYt,
      instagram: currentIg,
      facebook: currentFb,
      tiktok: currentTt
    });

    setSavedSuccess(isAr ? 'تم حفظ وتحديث الأرقام على جميع الأزرار والبطاقات بنجاح!' : 'Métriques enregistrées avec succès !');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // Reset Numbers
  const handleResetNumbers = () => {
    onResetDefaults();
    setYtCount('7690');
    setIgCount('48500');
    setFbCount('35200');
    setTtCount('28400');
    setSavedSuccess(isAr ? 'تمت استعادة الأرقام الافتراضية بنجاح' : 'Métriques réinitialisées par défaut');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // Video Management: Add Video (NO placeholders)
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoFormError('');

    if (!newVideoUrl.trim()) {
      setVideoFormError(isAr ? 'يرجى إدخال رابط فيديو YouTube أو كود الفيديو' : 'Veuillez saisir un lien ou ID YouTube');
      return;
    }

    const ytId = extractYouTubeId(newVideoUrl);
    if (!ytId) {
      setVideoFormError(
        isAr
          ? 'الرابط غير صالح. يرجى إدخال رابط يوتيوب صحيح'
          : 'Lien YouTube invalide. Utilisez un format watch?v=... ou l\'ID de la vidéo'
      );
      return;
    }

    if (!newVideoTitle.trim()) {
      setVideoFormError(isAr ? 'يرجى إدخال عنوان الفيديو' : 'Veuillez saisir le titre de la vidéo');
      return;
    }

    const success = onAddVideo({
      youtubeInput: ytId,
      titleAr: newVideoTitle.trim(),
      tagAr: newVideoTag.trim() || 'تحليل كروي',
      duration: newVideoDuration.trim() || undefined
    });

    if (success) {
      setNewVideoUrl('');
      setNewVideoTitle('');
      setNewVideoDuration('');
      setVideoFormError('');
      setSavedSuccess(isAr ? 'تمت إضافة الفيديو الجديد بنجاح!' : 'Vidéo ajoutée avec succès !');
      setTimeout(() => setSavedSuccess(null), 3000);
    }
  };

  // Start editing a video
  const handleStartEdit = (video: RealVideo) => {
    setEditingVideoId(video.id);
    setEditUrl(video.url);
    setEditTitle(video.titleAr);
    setEditTag(video.tagAr);
    setEditDuration(video.duration || '');
  };

  // Save edited video
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideoId) return;

    onUpdateVideo(editingVideoId, {
      youtubeInput: editUrl,
      titleAr: editTitle,
      tagAr: editTag,
      duration: editDuration
    });

    setEditingVideoId(null);
    setSavedSuccess(isAr ? 'تم تحديث الفيديو بنجاح!' : 'Vidéo modifiée avec succès !');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // Delete Video
  const handleDeleteVideo = (id: string, title: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف الفيديو: "${title}"؟` : `Supprimer la vidéo "${title}" ?`)) {
      onDeleteVideo(id);
      setSavedSuccess(isAr ? 'تم حذف الفيديو بنجاح' : 'Vidéo supprimée avec succès');
      setTimeout(() => setSavedSuccess(null), 3000);
    }
  };

  // If not authenticated, render Login Screen (NO placeholders)
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-[#06070B] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
        lang={adminLang}
      >
        {/* Top bar with Language Switcher (FR / AR) */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30">
          <button
            type="button"
            onClick={handleToggleLanguage}
            title={isAr ? "Passer en Français" : "التحويل إلى العربية"}
            className="px-3.5 py-2 rounded-xl bg-[#0e111a]/90 hover:bg-[#151928] border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-2xl cursor-pointer"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'FR (Français)' : 'العربية (AR)'}</span>
          </button>
        </div>

        {/* Ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-yellow-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-zinc-950 shadow-2xl shadow-amber-500/30 mb-4">
              <Gem className="w-8 h-8 fill-current" />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white uppercase font-mono">
              OLDBIJOU CONTROL CENTER
            </h1>
            <p className="text-amber-400 text-xs font-bold font-mono tracking-widest mt-1">
              /oldbijonumbers · {isAr ? 'الأرقام والفيديوهات' : 'Chiffres & Vidéos'}
            </p>
            <p className="text-zinc-400 text-sm mt-3">
              {isAr
                ? 'لوحة التحكم الرسمية لتعديل الأرقام وإدارة فيديوهات وتحليلات القناة'
                : 'Panneau officiel de modification des chiffres et gestion des vidéos'}
            </p>
          </div>

          {/* Login Form Box (NO placeholders) */}
          <div className="p-8 rounded-3xl bg-[#0d101a] border border-amber-500/30 shadow-2xl shadow-black/80 backdrop-blur-xl">
            <form onSubmit={handleLogin} className="space-y-5">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 font-mono mb-2">
                  {isAr ? 'اسم المستخدم (User):' : 'Nom d\'utilisateur (User) :'}
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-300 font-mono mb-2">
                  {isAr ? 'الرمز السري (Code):' : 'Code secret (Code) :'}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-mono"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Lock className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Accéder au panneau de contrôle'}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
              <button
                onClick={onNavigateHome}
                className="text-xs text-zinc-400 hover:text-amber-300 font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'العودة إلى الموقع الرئيسي' : 'Retourner au site principal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  const extractedNewYtId = extractYouTubeId(newVideoUrl);

  return (
    <div
      className="min-h-screen bg-[#07080E] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950 pb-20"
      dir={isAr ? 'rtl' : 'ltr'}
      lang={adminLang}
    >
      {/* Toast */}
      {savedSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-black text-sm rounded-full shadow-2xl flex items-center gap-2.5 animate-bounce border-2 border-emerald-200">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#090b12]/95 backdrop-blur-xl border-b border-amber-500/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-md">
              <Gem className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-black uppercase text-white font-mono">
                  OLDBIJOU
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/40">
                  {isAr ? 'لوحة التحكم' : 'Panneau de contrôle'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                {isAr ? 'المشرف:' : 'Admin :'} <code className="text-amber-400">oldbijou</code> · Route: <code className="text-zinc-300">/oldbijonumbers</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher (FR / AR) */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              title={isAr ? "Passer en Français" : "التحويل إلى العربية"}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 hover:text-white rounded-xl text-xs font-bold font-mono transition-all border border-neutral-700 hover:border-amber-400/60 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'FR' : 'العربية'}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all border border-neutral-700 flex items-center gap-1.5 cursor-pointer hover:border-amber-400/60"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'عرض الموقع الرئيسي' : 'Voir le site'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-bold transition-all border border-red-500/30 cursor-pointer"
            >
              {isAr ? 'تسجيل الخروج' : 'Déconnexion'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'numbers'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-zinc-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isAr ? '1. إحصائيات وأرقام المنصات (Followers)' : '1. Statistiques des réseaux'}</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900 text-zinc-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{isAr ? '2. إدارة وتعديل الفيديوهات (Videos Manager)' : '2. Gestion des vidéos'}</span>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[11px] font-mono">
              {videos.length}
            </span>
          </button>
        </div>

        {/* TAB 1: FOLLOWERS & NUMBERS MANAGER */}
        {activeTab === 'numbers' && (
          <div>
            {/* Intro Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#101422] to-[#0c0f18] border border-amber-500/30 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 font-mono mb-1">
                  <Sliders className="w-4 h-4" />
                  <span>{isAr ? 'التحكم الفوري في إحصائيات المتابعين' : 'Contrôle direct des statistiques'}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'تحديث وتخصيص أرقام الحسابات الرسمية' : 'Mise à jour des métriques officielles'}
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-2xl">
                  {isAr
                    ? 'تم توفير أزرار تحكم كاملة (+ / - وسريعة) لكل رقم على حدة، بالإضافة إلى لوحة تحكم جماعية لكافة الأرقام أدناه.'
                    : 'Commandes complètes d\'ajustement (+ / - et pas rapides) pour chaque entrée, et contrôle global ci-dessous.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveNumbers}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ وتطبيق الآن ⚡' : 'Enregistrer & Appliquer'}</span>
                </button>

                <button
                  onClick={handleResetNumbers}
                  title={isAr ? "استعادة الأرقام الافتراضية" : "Réinitialiser"}
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white rounded-xl border border-neutral-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MASTER CONTROL BAR FOR ALL INPUT NUMBERS */}
            <div className="p-6 rounded-3xl bg-[#0d101a] border-2 border-amber-500/40 shadow-2xl mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-white text-base">
                      {isAr ? 'لوحة التحكم الجماعي في جميع الأرقام (Master Number Controls)' : 'Contrôle Global de Tous les Chiffres'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {isAr ? 'تحكم في أرقام المنصات الأربعة معاً دفعة واحدة بنقرة واحدة' : 'Ajustez les 4 chiffres simultanément'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-amber-400/90 font-bold bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/30">
                  {isAr ? 'تحكم شامل' : 'Contrôle Master'}
                </span>
              </div>

              {/* Master Control Buttons */}
              <div className="space-y-4">
                {/* 1. Global Steppers */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-zinc-400 font-mono w-full sm:w-auto">
                    {isAr ? 'زيادة الكل بـ:' : 'Ajouter à tous :'}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustAll(1000)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+1,000 (+1K)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustAll(10000)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+10,000 (+10K)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustAll(100000)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+100,000 (+100K)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustAll(1000000)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono font-black text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>+1,000,000 (+1M)</span>
                  </button>

                  <div className="hidden sm:block h-5 w-[1px] bg-neutral-800 mx-1" />

                  <span className="text-xs font-bold text-zinc-400 font-mono w-full sm:w-auto">
                    {isAr ? 'إنقاص الكل:' : 'Diminuer :'}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustAll(-1000)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 hover:text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MinusCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>-1K</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustAll(-10000)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 hover:text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MinusCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>-10K</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustAll(-100000)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 hover:text-white font-mono font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MinusCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>-100K</span>
                  </button>
                </div>

                {/* 2. Quick Bundle Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/80">
                  <span className="text-xs font-bold text-zinc-400 font-mono">
                    {isAr ? 'حزم سريعة جاهزة للكل:' : 'Préréglages globaux :'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      applyPresetBundle(
                        { yt: 7690, ig: 48500, fb: 35200, tt: 28400 },
                        isAr ? 'الأرقام الحقيقية الموثقة' : 'Chiffres réels vérifiés'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 hover:text-white text-xs font-mono font-bold border border-neutral-800 hover:border-amber-400/50 cursor-pointer"
                  >
                    ⚽ {isAr ? 'الأرقام الأصلية' : 'Chiffres originaux'} (7.69K / 48.5K / 35.2K / 28.4K)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyPresetBundle(
                        { yt: 1250000, ig: 4850000, fb: 2350000, tt: 1900000 },
                        isAr ? 'حزمة الملايين (1M+)' : 'Pack Millions'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-300 hover:text-white text-xs font-mono font-bold border border-neutral-800 hover:border-emerald-400/50 cursor-pointer"
                  >
                    🚀 {isAr ? 'حزمة الملايين' : 'Millions'} (1.25M / 4.85M / 2.35M / 1.9M)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyPresetBundle(
                        { yt: 100000000000, ig: 4850000, fb: 352000000, tt: 28400000 },
                        isAr ? 'حزمة 100B' : 'Pack 100B'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white text-xs font-mono font-bold border border-neutral-800 hover:border-purple-400/50 cursor-pointer"
                  >
                    💎 100B / 4.85M / 352M / 28.4M
                  </button>
                </div>
              </div>
            </div>

            {/* 4 PLATFORMS CARDS (NO PLACEHOLDERS, FULL STEPPER CONTROLS ON EACH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* 1. YouTube */}
              <div className="p-6 rounded-3xl bg-[#0e111a] border border-red-500/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                        <YoutubeIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-white text-base">YouTube</h3>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">@oldbijou-1</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-950 text-red-300 font-mono font-bold border border-red-500/30">
                      {isAr ? 'قناة رسمية' : 'Chaîne officielle'}
                    </span>
                  </div>

                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 font-mono">
                    {isAr ? 'عدد المشتركين (Subscribers):' : 'Nombre d\'abonnés :'}
                  </label>

                  {/* Input with Side Controls and NO placeholder */}
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-neutral-700 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-500/20 bg-[#07080e]">
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', -1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-l border-neutral-700 transition-colors cursor-pointer select-none"
                      title="-1K"
                    >
                      -1K
                    </button>
                    <input
                      type="text"
                      value={ytCount}
                      onChange={(e) => setYtCount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-3 bg-transparent text-center text-white font-mono font-black text-lg focus:outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', 1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-r border-neutral-700 transition-colors cursor-pointer select-none"
                      title="+1K"
                    >
                      +1K
                    </button>
                  </div>

                  {/* Quick Increment/Decrement Controls for YouTube */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', 10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +10K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', 100000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +100K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', 1000000)}
                      className="px-2 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-[11px] font-mono text-red-300 border border-red-500/30 cursor-pointer"
                    >
                      +1M
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('youtube', -10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-400 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      -10K
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSingle('youtube')}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-500 hover:text-red-400 border border-neutral-800 cursor-pointer ml-auto"
                      title={isAr ? "تصفير" : "Effacer"}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dynamic Preview Box for YouTube */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#07080e] border border-neutral-800">
                    <div className="text-[11px] text-zinc-400 font-mono mb-1">
                      {isAr ? 'الشكل في الموقع والأزرار:' : 'Affichage sur le site :'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-red-400 text-xl tabular-nums">
                        {currentYt.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 text-xs font-black font-mono border border-red-500/30">
                        {formatFollowerCount(currentYt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setYtCount('7690')}
                    className="text-[11px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    7,690
                  </button>
                  <button
                    type="button"
                    onClick={() => setYtCount('100000000000')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                  >
                    100B
                  </button>
                </div>
              </div>

              {/* 2. Instagram */}
              <div className="p-6 rounded-3xl bg-[#0e111a] border border-pink-500/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-600/30">
                        <InstagramIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-white text-base">Instagram</h3>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">@oldbijou</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-950 text-pink-300 font-mono font-bold border border-pink-500/30">
                      {isAr ? 'موثق' : 'Vérifié'}
                    </span>
                  </div>

                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 font-mono">
                    {isAr ? 'عدد المتابعين (Followers):' : 'Nombre de followers :'}
                  </label>

                  {/* Input with Side Controls and NO placeholder */}
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-neutral-700 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-500/20 bg-[#07080e]">
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', -1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-l border-neutral-700 transition-colors cursor-pointer select-none"
                      title="-1K"
                    >
                      -1K
                    </button>
                    <input
                      type="text"
                      value={igCount}
                      onChange={(e) => setIgCount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-3 bg-transparent text-center text-white font-mono font-black text-lg focus:outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', 1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-r border-neutral-700 transition-colors cursor-pointer select-none"
                      title="+1K"
                    >
                      +1K
                    </button>
                  </div>

                  {/* Quick Increment/Decrement Controls for Instagram */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', 10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +10K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', 100000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +100K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', 1000000)}
                      className="px-2 py-1 rounded-lg bg-pink-950/50 hover:bg-pink-900/60 text-[11px] font-mono text-pink-300 border border-pink-500/30 cursor-pointer"
                    >
                      +1M
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('instagram', -10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-400 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      -10K
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSingle('instagram')}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-500 hover:text-pink-400 border border-neutral-800 cursor-pointer ml-auto"
                      title={isAr ? "تصفير" : "Effacer"}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dynamic Preview Box for Instagram */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#07080e] border border-neutral-800">
                    <div className="text-[11px] text-zinc-400 font-mono mb-1">
                      {isAr ? 'الشكل في الموقع والأزرار:' : 'Affichage sur le site :'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-pink-400 text-xl tabular-nums">
                        {currentIg.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-pink-600/20 text-pink-300 text-xs font-black font-mono border border-pink-500/30">
                        {formatFollowerCount(currentIg)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIgCount('48500')}
                    className="text-[11px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    48,500
                  </button>
                  <button
                    type="button"
                    onClick={() => setIgCount('4850000')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                  >
                    4.85M
                  </button>
                </div>
              </div>

              {/* 3. Facebook */}
              <div className="p-6 rounded-3xl bg-[#0e111a] border border-blue-500/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <FacebookIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-white text-base">Facebook</h3>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">Old bijou Official</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 font-mono font-bold border border-blue-500/30">
                      {isAr ? 'صفحة معتمدة' : 'Page officielle'}
                    </span>
                  </div>

                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 font-mono">
                    {isAr ? 'عدد المتابعين (Followers):' : 'Nombre de followers :'}
                  </label>

                  {/* Input with Side Controls and NO placeholder */}
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-neutral-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 bg-[#07080e]">
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', -1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-l border-neutral-700 transition-colors cursor-pointer select-none"
                      title="-1K"
                    >
                      -1K
                    </button>
                    <input
                      type="text"
                      value={fbCount}
                      onChange={(e) => setFbCount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-3 bg-transparent text-center text-white font-mono font-black text-lg focus:outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', 1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-r border-neutral-700 transition-colors cursor-pointer select-none"
                      title="+1K"
                    >
                      +1K
                    </button>
                  </div>

                  {/* Quick Increment/Decrement Controls for Facebook */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', 10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +10K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', 100000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +100K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', 1000000)}
                      className="px-2 py-1 rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-[11px] font-mono text-blue-300 border border-blue-500/30 cursor-pointer"
                    >
                      +1M
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('facebook', -10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-400 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      -10K
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSingle('facebook')}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-500 hover:text-blue-400 border border-neutral-800 cursor-pointer ml-auto"
                      title={isAr ? "تصفير" : "Effacer"}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dynamic Preview Box for Facebook */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#07080e] border border-neutral-800">
                    <div className="text-[11px] text-zinc-400 font-mono mb-1">
                      {isAr ? 'الشكل في الموقع والأزرار:' : 'Affichage sur le site :'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-blue-400 text-xl tabular-nums">
                        {currentFb.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 text-xs font-black font-mono border border-blue-500/30">
                        {formatFollowerCount(currentFb)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setFbCount('35200')}
                    className="text-[11px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    35,200
                  </button>
                  <button
                    type="button"
                    onClick={() => setFbCount('352000000')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                  >
                    352M
                  </button>
                </div>
              </div>

              {/* 4. TikTok */}
              <div className="p-6 rounded-3xl bg-[#0e111a] border border-emerald-500/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                        <TikTokIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-white text-base">TikTok</h3>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">@oldbijou</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                      {isAr ? 'شورتس' : 'Shorts'}
                    </span>
                  </div>

                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 font-mono">
                    {isAr ? 'عدد المتابعين (Followers):' : 'Nombre de followers :'}
                  </label>

                  {/* Input with Side Controls and NO placeholder */}
                  <div className="flex items-stretch rounded-xl overflow-hidden border border-neutral-700 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-[#07080e]">
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', -1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-l border-neutral-700 transition-colors cursor-pointer select-none"
                      title="-1K"
                    >
                      -1K
                    </button>
                    <input
                      type="text"
                      value={ttCount}
                      onChange={(e) => setTtCount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-3 bg-transparent text-center text-white font-mono font-black text-lg focus:outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', 1000)}
                      className="px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white font-mono font-bold text-xs border-r border-neutral-700 transition-colors cursor-pointer select-none"
                      title="+1K"
                    >
                      +1K
                    </button>
                  </div>

                  {/* Quick Increment/Decrement Controls for TikTok */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', 10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +10K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', 100000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-300 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      +100K
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', 1000000)}
                      className="px-2 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 cursor-pointer"
                    >
                      +1M
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSingle('tiktok', -10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-400 hover:text-white border border-neutral-800 cursor-pointer"
                    >
                      -10K
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSingle('tiktok')}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-zinc-500 hover:text-emerald-400 border border-neutral-800 cursor-pointer ml-auto"
                      title={isAr ? "تصفير" : "Effacer"}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dynamic Preview Box for TikTok */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#07080e] border border-neutral-800">
                    <div className="text-[11px] text-zinc-400 font-mono mb-1">
                      {isAr ? 'الشكل في الموقع والأزرار:' : 'Affichage sur le site :'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-emerald-400 text-xl tabular-nums">
                        {currentTt.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 text-xs font-black font-mono border border-emerald-500/30">
                        {formatFollowerCount(currentTt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setTtCount('28400')}
                    className="text-[11px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    28,400
                  </button>
                  <button
                    type="button"
                    onClick={() => setTtCount('28400000')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                  >
                    28.4M
                  </button>
                </div>
              </div>
            </div>

            {/* Live Buttons Preview Simulation Section */}
            <div className="p-8 rounded-3xl bg-[#0c0f18] border border-amber-500/30 shadow-2xl mb-12">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display text-lg font-black text-white">
                    {isAr ? 'معاينة حية ومباشرة للأزرار في واجهة الموقع' : 'Aperçu en direct des boutons du site'}
                  </h3>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {isAr ? 'تتحدث فورياً مع أي تغيير في الأرقام' : 'Mise à jour en temps réel'}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-zinc-400 block mb-3 font-mono">
                    {isAr ? '1. الأزرار العلوية الرئيسية (Hero Action Buttons):' : '1. Boutons d\'action Hero :'}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-5 py-3.5 bg-red-600 text-white font-black text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-red-600/20">
                      <YoutubeIcon size={18} />
                      <span>YouTube ({formatFollowerCount(currentYt)})</span>
                    </div>

                    <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-black text-sm rounded-xl flex items-center gap-2.5 shadow-lg shadow-pink-600/20">
                      <InstagramIcon size={18} />
                      <span>Instagram ({formatFollowerCount(currentIg)})</span>
                    </div>

                    <div className="px-5 py-3.5 bg-[#1877F2]/20 text-blue-300 font-extrabold text-sm rounded-xl border border-[#1877F2]/40 flex items-center gap-2">
                      <FacebookIcon size={18} />
                      <span>Facebook ({formatFollowerCount(currentFb)})</span>
                    </div>

                    <div className="px-5 py-3.5 bg-emerald-950/40 text-emerald-300 font-extrabold text-sm rounded-xl border border-emerald-500/30 flex items-center gap-2">
                      <TikTokIcon size={18} />
                      <span>TikTok ({formatFollowerCount(currentTt)})</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-zinc-400 block mb-3 font-mono">
                    {isAr ? '2. بطاقات الإحصائيات (Hero Stats Grid):' : '2. Cartes statistiques :'}
                  </span>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                      <span className="font-display text-2xl font-black text-red-400 font-mono">
                        {currentYt.toLocaleString()}
                      </span>
                      <div className="text-xs text-zinc-400 mt-1">يوتيوب (@oldbijou-1)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                      <span className="font-display text-2xl font-black text-pink-400 font-mono">
                        {currentIg.toLocaleString()}
                      </span>
                      <div className="text-xs text-zinc-400 mt-1">إنستغرام (@oldbijou)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                      <span className="font-display text-2xl font-black text-blue-400 font-mono">
                        {currentFb.toLocaleString()}
                      </span>
                      <div className="text-xs text-zinc-400 mt-1">فيسبوك (Old bijou)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                      <span className="font-display text-2xl font-black text-emerald-400 font-mono">
                        {currentTt.toLocaleString()}
                      </span>
                      <div className="text-xs text-zinc-400 mt-1">تيك توك (@oldbijou)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action inside preview */}
              <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleSaveNumbers}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-base rounded-2xl transition-all shadow-2xl shadow-amber-500/30 hover:scale-105 cursor-pointer flex items-center gap-2.5"
                >
                  <Save className="w-5 h-5 stroke-[2.5]" />
                  <span>{isAr ? 'حفظ جميع الأرقام الآن وتطبيقها فوراً' : 'Enregistrer et appliquer maintenant'}</span>
                </button>

                <button
                  onClick={onNavigateHome}
                  className="px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-sm font-bold transition-all border border-neutral-700 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'الذهاب إلى الموقع لرؤية النتيجة' : 'Voir le résultat sur le site'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEOS MANAGER (ADD / EDIT / DELETE / REORDER - NO PLACEHOLDERS) */}
        {activeTab === 'videos' && (
          <div className="space-y-10">
            {/* Top Form: Add New Video (NO PLACEHOLDERS) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111422] to-[#0c0e17] border-2 border-amber-500/30 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white">
                      {isAr ? 'إضافة فيديو جديد إلى الموقع' : 'Ajouter une nouvelle vidéo'}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {isAr
                        ? 'ضع رابط فيديو YouTube وسيتم استخراج الفيديو والصورة المصغرة آلياً'
                        : 'Collez le lien YouTube pour générer automatiquement l\'aperçu'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onResetVideos}
                  className="text-xs text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استعادة الفيديوهات الافتراضية' : 'Réinitialiser les vidéos'}</span>
                </button>
              </div>

              {videoFormError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{videoFormError}</span>
                </div>
              )}

              <form onSubmit={handleAddVideoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Inputs Column (NO PLACEHOLDERS) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-mono">
                        {isAr ? 'رابط الفيديو على YouTube أو كود الفيديو:' : 'Lien de la vidéo YouTube :'}
                      </label>
                      <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                        dir="ltr"
                      />
                      <span className="text-[11px] text-zinc-500 mt-1 block font-mono">
                        يدعم جميع الروابط: watch?v=, youtu.be/, shorts/, أو المعرف 11 حرفاً
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-mono">
                        {isAr ? 'عنوان الفيديو / التحليل:' : 'Titre de la vidéo :'}
                      </label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-mono">
                          {isAr ? 'التصنيف / الفئة:' : 'Catégorie :'}
                        </label>
                        <input
                          type="text"
                          value={newVideoTag}
                          onChange={(e) => setNewVideoTag(e.target.value)}
                          className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-mono">
                          {isAr ? 'مدة الفيديو (اختياري):' : 'Durée (optionnel) :'}
                        </label>
                        <input
                          type="text"
                          value={newVideoDuration}
                          onChange={(e) => setNewVideoDuration(e.target.value)}
                          className="w-full px-4 py-3 bg-[#07080e] border border-neutral-700 focus:border-amber-400 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Instant Thumbnail Live Preview */}
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                      {isAr ? 'المعاينة الفورية للصورة:' : 'Aperçu miniature :'}
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-2 border-neutral-800 flex items-center justify-center group">
                      {extractedNewYtId ? (
                        <>
                          <img
                            src={`https://i.ytimg.com/vi/${extractedNewYtId}/hqdefault.jpg`}
                            alt="Preview"
                            onError={(e) => {
                              e.currentTarget.src = `https://i.ytimg.com/vi/${extractedNewYtId}/mqdefault.jpg`;
                            }}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-zinc-500 text-xs">
                          <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <span>{isAr ? 'أدخل رابط الفيديو لعرض الصورة هنا' : 'Collez un lien pour voir l\'image'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{isAr ? 'إضافة الفيديو الآن إلى الموقع' : 'Ajouter la vidéo au site'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Videos List with Edit / Delete / Reorder */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display text-xl font-black text-white">
                    {isAr ? 'الفيديوهات المعروضة حالياً بالموقع' : 'Vidéos actuellement affichées'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                    {videos.length}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  {isAr ? 'يمكنك تعديل أي فيديو أو حذفه أو تغيير ترتيبه' : 'Modifier, supprimer ou réorganiser'}
                </span>
              </div>

              {videos.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#0e111a] border border-neutral-800 text-center text-zinc-400">
                  {isAr ? 'لا توجد فيديوهات حالياً. استخدم النموذج أعلاه لإضافة أول فيديو.' : 'Aucune vidéo. Ajoutez-en une ci-dessus.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video, idx) => {
                    return (
                      <div
                        key={video.id}
                        className="p-5 rounded-3xl bg-[#0e111a] border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg"
                      >
                        {/* Thumbnail & Video Details */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                          {/* Order Index */}
                          <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0">
                            #{idx + 1}
                          </div>

                          {/* Thumbnail */}
                          <div
                            onClick={() => setPreviewVideo(video)}
                            className="relative w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer group"
                            title={isAr ? "معاينة وتشغيل الفيديو" : "Visionner"}
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.titleAr}
                              onError={(e) => {
                                if (video.fallbackThumbnail) e.currentTarget.src = video.fallbackThumbnail;
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                              <Play className="w-6 h-6 text-amber-400 fill-current" />
                            </div>
                            {video.duration && (
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-zinc-300">
                                {video.duration}
                              </div>
                            )}
                          </div>

                          {/* Titles and meta */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                                {video.tagAr}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-mono" dir="ltr">
                                ID: {video.youtubeId}
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-white text-base hover:text-amber-300 transition-colors">
                              {video.titleAr}
                            </h4>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-red-400 hover:underline font-mono inline-flex items-center gap-1"
                              dir="ltr"
                            >
                              <span>{video.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Action Buttons: Edit, Delete, Reorder */}
                        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                          {/* Reorder Up */}
                          <button
                            onClick={() => onMoveVideo(idx, 'up')}
                            disabled={idx === 0}
                            title={isAr ? "تحريك لأعلى" : "Monter"}
                            className="p-2 text-zinc-400 hover:text-white bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-neutral-800 hover:border-neutral-600 cursor-pointer"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          {/* Reorder Down */}
                          <button
                            onClick={() => onMoveVideo(idx, 'down')}
                            disabled={idx === videos.length - 1}
                            title={isAr ? "تحريك لأسفل" : "Descendre"}
                            className="p-2 text-zinc-400 hover:text-white bg-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-neutral-800 hover:border-neutral-600 cursor-pointer"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleStartEdit(video)}
                            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 rounded-xl border border-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تعديل' : 'Modifier'}</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteVideo(video.id, video.titleAr)}
                            className="p-2 text-red-400 hover:text-white bg-red-950/30 hover:bg-red-900/60 rounded-xl border border-red-500/30 transition-all cursor-pointer"
                            title={isAr ? "حذف الفيديو" : "Supprimer"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Edit Modal if a video is being edited (NO placeholders) */}
            {editingVideoId && (
              <div
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                onClick={() => setEditingVideoId(null)}
              >
                <div
                  className="relative w-full max-w-lg bg-[#0e111a] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                    <div className="flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-amber-400" />
                      <h3 className="font-display font-black text-white text-lg">
                        {isAr ? 'تعديل بيانات الفيديو' : 'Modifier la vidéo'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingVideoId(null)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-neutral-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1 font-mono">
                        {isAr ? 'رابط الفيديو على YouTube أو المعرف:' : 'Lien YouTube :'}
                      </label>
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-[#07080e] border border-neutral-700 rounded-xl text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1 font-mono">
                        {isAr ? 'عنوان الفيديو:' : 'Titre :'}
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-[#07080e] border border-neutral-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase mb-1 font-mono">
                          {isAr ? 'التصنيف:' : 'Catégorie :'}
                        </label>
                        <input
                          type="text"
                          value={editTag}
                          onChange={(e) => setEditTag(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#07080e] border border-neutral-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase mb-1 font-mono">
                          {isAr ? 'المدة:' : 'Durée :'}
                        </label>
                        <input
                          type="text"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#07080e] border border-neutral-700 rounded-xl text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingVideoId(null)}
                        className="px-4 py-2.5 bg-neutral-900 text-zinc-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {isAr ? 'إلغاء' : 'Annuler'}
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        {isAr ? 'حفظ التعديل' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Video Playback Preview Modal */}
            {previewVideo && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
                onClick={() => setPreviewVideo(null)}
              >
                <div
                  className="relative w-full max-w-3xl bg-[#0e111a] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#08090E]">
                    <span className="font-display font-bold text-white text-sm truncate max-w-md">
                      {previewVideo.titleAr}
                    </span>
                    <button
                      onClick={() => setPreviewVideo(null)}
                      className="p-1 text-zinc-400 hover:text-white rounded-xl hover:bg-neutral-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={previewVideo.embedUrl}
                      title={previewVideo.titleAr}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
