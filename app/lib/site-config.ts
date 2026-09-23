export type NewsItem = {
  title: string;
  date: string;
  summary: string;
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

export type SiteConfig = {
  candidateName: string;
  slogan: string;
  logoUrl: string;
  bannerVideoUrl: string;
  footerReelUrl: string;
  videos: VideoItem[];
  news: NewsItem[];
  socials: SocialLink[];
};

export const defaultConfig: SiteConfig = {
  candidateName: "Gustavo Saadi",
  slogan: "Catamarca con trabajo, cercania e igualdad de oportunidades.",
  logoUrl: "/gustavo-saadi-logo.svg",
  bannerVideoUrl: "",
  footerReelUrl: "",
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
    },
    {
      title: "Nuevo plan de seguridad barrial",
      date: "19 Sep 2026",
      summary:
        "La propuesta combina iluminacion, prevencion y coordinacion directa con instituciones vecinales.",
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
    videos: config?.videos ?? defaultConfig.videos,
    news: config?.news ?? defaultConfig.news,
    socials: config?.socials ?? defaultConfig.socials,
  };
}
