export type NewsItem = {
  title: string;
  date: string;
  summary: string;
  body: string;
  imageUrl: string;
};

export type VideoItem = {
  title: string;
  youtubeUrl: string;
};

export type SocialLink = {
  name: string;
  url: string;
  logo: string;
};

export type InstagramReel = {
  title: string;
  url: string;
  imageUrl: string;
  dateText: string;
};

export type SiteConfig = {
  candidateName: string;
  slogan: string;
  logoUrl: string;
  footerLogoUrl: string;
  footerTitle: string;
  footerText: string;
  bannerVideoUrl: string;
  footerReelUrl: string;
  instagramSectionEyebrow: string;
  instagramSectionTitle: string;
  videoSectionEyebrow: string;
  videoSectionTitle: string;
  colors: {
    pageBackground: string;
    text: string;
    headerBackground: string;
    primary: string;
    accent: string;
    footerBackground: string;
    footerText: string;
  };
  videos: VideoItem[];
  news: NewsItem[];
  instagramReels: InstagramReel[];
  socials: SocialLink[];
};

export const defaultConfig: SiteConfig = {
  candidateName: "Gustavo Saadi",
  slogan: "Catamarca con trabajo, cercania e igualdad de oportunidades.",
  logoUrl: "/gustavo-saadi-logo.svg",
  footerLogoUrl: "/gustavo-saadi-logo.svg",
  footerTitle: "Gustavo Saadi",
  footerText: "Catamarca con trabajo, cercania e igualdad de oportunidades.",
  bannerVideoUrl: "",
  footerReelUrl: "",
  instagramSectionEyebrow: "Momentos de la gestion",
  instagramSectionTitle: "En Instagram",
  videoSectionEyebrow: "Galeria",
  videoSectionTitle: "Videos destacados",
  colors: {
    pageBackground: "#f7f3ea",
    text: "#1d1b18",
    headerBackground: "#f7f3ea",
    primary: "#116a4a",
    accent: "#b02a2a",
    footerBackground: "#1d1b18",
    footerText: "#ffffff",
  },
  videos: [
    {
      title: "Mensaje de campana",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Propuestas para vecinos",
      youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
  ],
  news: [
    {
      title: "Recorrida por el centro comercial",
      date: "22 Sep 2026",
      summary:
        "El equipo presento medidas para simplificar tramites y acompanar a comerciantes locales.",
      body:
        "Durante la recorrida se relevaron las principales necesidades del sector comercial y se presentaron propuestas para mejorar la atencion municipal, simplificar tramites y fortalecer la actividad economica local.",
      imageUrl: "/gustavo-saadi.png",
    },
    {
      title: "Nuevo plan de seguridad barrial",
      date: "19 Sep 2026",
      summary:
        "La propuesta combina iluminacion, prevencion y coordinacion directa con instituciones vecinales.",
      body:
        "El plan propone reforzar la iluminacion, mejorar la coordinacion territorial y trabajar con instituciones vecinales para prevenir conflictos y acercar respuestas concretas a cada barrio.",
      imageUrl: "/gustavo-saadi.png",
    },
  ],
  instagramReels: [
    {
      title: "Veni al encuentro de las palabras",
      url: "https://www.instagram.com/",
      imageUrl: "/gustavo-saadi.png",
      dateText: "",
    },
  ],
  socials: [
    { name: "Instagram", url: "https://instagram.com", logo: "IG" },
    { name: "Facebook", url: "https://facebook.com", logo: "FB" },
    { name: "YouTube", url: "https://youtube.com", logo: "YT" },
  ],
};

export function mergeSiteConfig(config: Partial<SiteConfig> | null | undefined): SiteConfig {
  return {
    ...defaultConfig,
    ...config,
    colors: {
      ...defaultConfig.colors,
      ...config?.colors,
    },
    videos: config?.videos ?? defaultConfig.videos,
    news: (config?.news ?? defaultConfig.news).map((item) => ({
      ...item,
      body: item.body ?? item.summary,
      imageUrl: item.imageUrl ?? "",
    })),
    instagramReels: (config?.instagramReels ?? defaultConfig.instagramReels).map((item) => ({
      ...item,
      title: item.title ?? "",
      url: item.url ?? "",
      imageUrl: item.imageUrl ?? "",
      dateText: item.dateText ?? "",
    })),
    socials: config?.socials ?? defaultConfig.socials,
  };
}

export function getNewsSlug(title: string, index: number) {
  const slug = getNewsSlugBase(title);

  return `${slug || "noticia"}-${index + 1}`;
}

export function getNewsSlugBase(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getNewsSlugWithoutIndex(slug: string) {
  return slug.replace(/-\d+$/, "");
}

export function getNewsHref(title: string, index: number) {
  return `/noticias/${getNewsSlug(title, index)}?title=${encodeURIComponent(title)}`;
}
