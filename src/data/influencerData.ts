import oldbijouAvatar from '../assets/images/oldbijou_portrait.jpg';
import oldbijouOfficialLogo from '../assets/images/oldbijou_official_logo.jpg';
import stadiumBg from '../assets/images/football_stadium_gold_1793121639892.jpg';

export type Language = 'ar' | 'fr';

export interface SocialPlatform {
  id: string;
  name: string;
  nameFr: string;
  handle: string;
  url: string;
  followersCount: string;
  followersRaw?: number;
  followersLabelAr: string;
  followersLabelFr: string;
  followingCountAr?: string;
  followingCountFr?: string;
  categoryAr: string;
  categoryFr: string;
  descriptionAr: string;
  descriptionFr: string;
  gradient: string;
  accentColor: string;
  badgeAr: string;
  badgeFr: string;
  highlightsAr: string;
  highlightsFr: string;
  directActionLabelAr: string;
  directActionLabelFr: string;
  iconType: 'youtube' | 'tiktok' | 'instagram' | 'facebook';
  isLiveSynced?: boolean;
}

export interface RealVideo {
  id: string;
  youtubeId: string;
  titleAr: string;
  titleFr: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
  fallbackThumbnail: string;
  tagAr: string;
  tagFr: string;
  author: string;
  duration?: string;
}

export const INFLUENCER_PROFILE = {
  name: "OLDBIJOU",
  displayName: "OLD BIJOU",
  handle: "@oldbijou",
  youtubeHandle: "@oldbijou-1",
  channelId: "UCNeOaYAvH2rx7_Io22nO6xQ",
  email: "Oldbijouco@gmail.com",
  roleAr: "محلل وباحث كروي ⚽💎 جواهر وتاريخ المستديرة",
  roleFr: "Créateur & Analyste Football ⚽💎 Récits & Histoire",
  mottoAr: "✨لكل أسطورة بداية.. ولكل جوهرة كروية حكاية✨",
  mottoFr: "✨ Chaque légende a son histoire, chaque bijou son éclat ✨",
  slogan: "MATCH DAY - OLDBIJOU",
  bioAr: "المنصة الرسمية لصانع المحتوى والمحلل الكروي OLDBIJOU — تحليلات تكتيكية شيقة، قصص أساطير كرة القدم، أسرار المباريات الكبرى ومقاطع تحليلية حصرية.",
  bioFr: "Hub officiel du créateur et analyste OLDBIJOU — Analyses tactiques pointues, récits épiques des légendes du football et décryptage des grands matchs.",
  verified: true,
  avatar: oldbijouAvatar,
  officialLogo: oldbijouOfficialLogo,
  stadiumBg: stadiumBg,
  stats: {
    youtubeSubscribers: "7.69K",
    youtubeVideos: "781",
    instagramFollowers: "48.5K",
    facebookFollowers: "35.2K",
    tiktokFollowers: "28.4K",
    totalCommunity: "120K+"
  }
};

export const INITIAL_SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "youtube",
    name: "يوتيوب",
    nameFr: "YouTube",
    handle: "@oldbijou-1",
    url: "https://www.youtube.com/@oldbijou-1/videos",
    followersCount: "7,690",
    followersRaw: 7690,
    followersLabelAr: "مشترك (781 فيديو)",
    followersLabelFr: "Abonnés (781 vidéos)",
    categoryAr: "تحليلات تكتيكية ووثائقيات",
    categoryFr: "Analyses tactiques & Récits",
    descriptionAr: "القناة الرسمية لـ OLDBIJOU على يوتيوب: 781 فيديو تحليلي، أسرار نجوم الكرة، مواجهات دوري الأبطال وتاريخ أساطير المستديرة.",
    descriptionFr: "Chaîne officielle d'OLDBIJOU sur YouTube: 781 vidéos d'analyse, secrets de la Ligue des Champions et profils de joueurs.",
    gradient: "from-red-600/25 via-amber-600/20 to-neutral-900/30",
    accentColor: "#FF0000",
    badgeAr: "قناة رسمية مباشرة",
    badgeFr: "Chaîne officielle en direct",
    highlightsAr: "7.69K مشترك · 781 فيديو تحليلي حقيقي",
    highlightsFr: "7.69K abonnés · 781 vidéos réelles",
    directActionLabelAr: "اشتراك في YouTube",
    directActionLabelFr: "S'abonner sur YouTube",
    iconType: "youtube",
    isLiveSynced: true
  },
  {
    id: "instagram",
    name: "إنستغرام",
    nameFr: "Instagram",
    handle: "@oldbijou",
    url: "https://www.instagram.com/oldbijou/?hl=en",
    followersCount: "48,500",
    followersRaw: 48500,
    followersLabelAr: "متابع (Followers)",
    followersLabelFr: "Abonnés (Followers)",
    followingCountAr: "ستوريات وريلز يومية",
    followingCountFr: "Stories & Reels quotidiens",
    categoryAr: "ستوريات وتغطيات سريعة",
    categoryFr: "Stories & Actualités",
    descriptionAr: "الحساب الرسمي لـ OLDBIJOU على إنستغرام: كواليس التحليلات، ريلز سريعة لأهم الأهداف، تفاعل يومي واستطلاعات رأي كروية حصرية.",
    descriptionFr: "Compte officiel Instagram d'OLDBIJOU: Coulisses, reels sur les temps forts, débats footballistiques et stories exclusives.",
    gradient: "from-amber-500/25 via-pink-600/25 to-purple-600/20",
    accentColor: "#E1306C",
    badgeAr: "حساب معتمد",
    badgeFr: "Compte officiel",
    highlightsAr: "ريلز كروية حصرية · تفاعل يومي",
    highlightsFr: "Reels & Stories foot quotidiennes",
    directActionLabelAr: "متابعة على Instagram",
    directActionLabelFr: "Suivre sur Instagram",
    iconType: "instagram",
    isLiveSynced: false
  },
  {
    id: "facebook",
    name: "فيسبوك",
    nameFr: "Facebook",
    handle: "Old bijou Official",
    url: "https://www.facebook.com/profile.php?id=61584924197861",
    followersCount: "35,200",
    followersRaw: 35200,
    followersLabelAr: "متابع فيسبوك",
    followersLabelFr: "Abonnés Facebook",
    categoryAr: "تفاعل ومجتمع كروي",
    categoryFr: "Communauté & Débats",
    descriptionAr: "الصفحة الرسمية المعتمدة لـ OLDBIJOU على فيسبوك للتفاعل ومشاركة المنشورات الرياضية والتحليلات بعد صافرة النهاية.",
    descriptionFr: "Page officielle d'OLDBIJOU sur Facebook: Articles, récaps de matchs en direct et communauté passionnée de football.",
    gradient: "from-blue-600/25 via-indigo-700/20 to-neutral-900/30",
    accentColor: "#1877F2",
    badgeAr: "صفحة معتمدة",
    badgeFr: "Page certifiée",
    highlightsAr: "مناقشات كروية نشطة · ريلز رياضية",
    highlightsFr: "Débats & Partages en direct",
    directActionLabelAr: "متابعة على Facebook",
    directActionLabelFr: "Suivre sur Facebook",
    iconType: "facebook",
    isLiveSynced: false
  },
  {
    id: "tiktok",
    name: "تيك توك",
    nameFr: "TikTok",
    handle: "@oldbijou",
    url: "https://www.tiktok.com/@oldbijou",
    followersCount: "28,400",
    followersRaw: 28400,
    followersLabelAr: "متابع (TikTok)",
    followersLabelFr: "Abonnés (TikTok)",
    categoryAr: "مقاطع سريعة وشورتس",
    categoryFr: "Shorts & Faits de jeu",
    descriptionAr: "أقوى اللقطات التكتيكية في ثوانٍ، مقارنات اللاعبين التاريخية، ولحظات حاسمة لا تُنسى في تاريخ الكرة.",
    descriptionFr: "Les moments clés décryptés en quelques secondes, comparaisons de légendes et anecdotes captivantes.",
    gradient: "from-emerald-500/20 via-teal-600/20 to-neutral-900/30",
    accentColor: "#10B981",
    badgeAr: "شورتس وفيديوهات قصيرة",
    badgeFr: "Shorts & Clips",
    highlightsAr: "شورتس وتكتيك سريع ومباريات",
    highlightsFr: "Formats courts & buzz",
    directActionLabelAr: "متابعة على TikTok",
    directActionLabelFr: "Suivre sur TikTok",
    iconType: "tiktok",
    isLiveSynced: false
  }
];

export const SOCIAL_PLATFORMS = INITIAL_SOCIAL_PLATFORMS;

// Real videos from Old bijou channel (@oldbijou-1)
export const REAL_YOUTUBE_VIDEOS: RealVideo[] = [
  {
    id: "vid-1",
    youtubeId: "584WblbsNJE",
    titleAr: "Konstantínos Tzolákis 🇬🇷🧤🐯 — إبداع الحراسة اليونانية وتصديات تاريخية",
    titleFr: "Konstantínos Tzolákis 🇬🇷🧤🐯 — Arrêts décisifs & Révélation",
    url: "https://www.youtube.com/watch?v=584WblbsNJE",
    embedUrl: "https://www.youtube.com/embed/584WblbsNJE?autoplay=1",
    thumbnail: "https://i.ytimg.com/vi/584WblbsNJE/hqdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/584WblbsNJE/mqdefault.jpg",
    tagAr: "فيديو تحليلي رسمي",
    tagFr: "Vidéo officielle",
    author: "Old bijou"
  },
  {
    id: "vid-2",
    youtubeId: "fOn1UM91X0Y",
    titleAr: "PEDRO 💙❤️🔇🔚 — سحر البلوغرانا ونهاية الحقبة الذهبية",
    titleFr: "PEDRO 💙❤️🔇🔚 — La Magie Blaugrana & Fin d'une Ère",
    url: "https://www.youtube.com/watch?v=fOn1UM91X0Y",
    embedUrl: "https://www.youtube.com/embed/fOn1UM91X0Y?autoplay=1",
    thumbnail: "https://i.ytimg.com/vi/fOn1UM91X0Y/hqdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/fOn1UM91X0Y/mqdefault.jpg",
    tagAr: "برشلونة وأساطير",
    tagFr: "Barça & Légendes",
    author: "Old bijou"
  },
  {
    id: "vid-3",
    youtubeId: "1KiAq-JRhOY",
    titleAr: "Leandro Paredes 🃏 — مهندس الوسط والجوكر التكتيكي في الميدان",
    titleFr: "Leandro Paredes 🃏 — Le Joker Tactique au Milieu de Terrain",
    url: "https://www.youtube.com/watch?v=1KiAq-JRhOY",
    embedUrl: "https://www.youtube.com/embed/1KiAq-JRhOY?autoplay=1",
    thumbnail: "https://i.ytimg.com/vi/1KiAq-JRhOY/hqdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/1KiAq-JRhOY/mqdefault.jpg",
    tagAr: "تكتيك ولاعبين",
    tagFr: "Tactique & Joueurs",
    author: "Old bijou"
  },
  {
    id: "vid-4",
    youtubeId: "afqtGfJJf88",
    titleAr: "João Neves 🇵🇹💙 — الموهبة البرتغالية الصاعدة وسيد خط الوسط",
    titleFr: "João Neves 🇵🇹💙 — La Pépite Portugaise du Milieu",
    url: "https://www.youtube.com/watch?v=afqtGfJJf88",
    embedUrl: "https://www.youtube.com/embed/afqtGfJJf88?autoplay=1",
    thumbnail: "https://i.ytimg.com/vi/afqtGfJJf88/hqdefault.jpg",
    fallbackThumbnail: "https://i.ytimg.com/vi/afqtGfJJf88/mqdefault.jpg",
    tagAr: "مواهب النخبة",
    tagFr: "Talents d'Élite",
    author: "Old bijou"
  }
];
