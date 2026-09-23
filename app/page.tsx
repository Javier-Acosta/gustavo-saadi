"use client";

import { useState } from "react";

type NewsItem = {
  title: string;
  date: string;
  summary: string;
};

type VideoItem = {
  title: string;
  youtubeUrl: string;
};

type SocialLink = {
  name: string;
  url: string;
  logo: string;
};

type SiteConfig = {
  candidateName: string;
  slogan: string;
  logoUrl: string;
  bannerVideoUrl: string;
  footerReelUrl: string;
  videos: VideoItem[];
  news: NewsItem[];
  socials: SocialLink[];
};

const defaultConfig: SiteConfig = {
  candidateName: "Gustavo Martinez",
  slogan: "Una ciudad ordenada, cercana y con oportunidades reales.",
  logoUrl: "",
  bannerVideoUrl: "",
  footerReelUrl: "",
  videos: [
    {
      title: "Mensaje de campaña",
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
        "El equipo presentó medidas para simplificar trámites y acompañar a comerciantes locales.",
    },
    {
      title: "Nuevo plan de seguridad barrial",
      date: "19 Sep 2026",
      summary:
        "La propuesta combina iluminación, prevención y coordinación directa con instituciones vecinales.",
    },
  ],
  socials: [
    { name: "Instagram", url: "https://instagram.com", logo: "IG" },
    { name: "Facebook", url: "https://facebook.com", logo: "FB" },
    { name: "YouTube", url: "https://youtube.com", logo: "YT" },
  ],
};

function getStoredConfig() {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const stored = window.localStorage.getItem("candidate-site-config");
  if (!stored) {
    return defaultConfig;
  }

  try {
    return { ...defaultConfig, ...JSON.parse(stored) } as SiteConfig;
  } catch {
    return defaultConfig;
  }
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function Home() {
  const [config] = useState(getStoredConfig);

  const bannerVideo = config.bannerVideoUrl.trim();
  const footerReel = config.footerReelUrl.trim();

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#1d1b18]">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-black/10 bg-[#f7f3ea]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="" className="h-10 w-10 rounded object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded bg-[#22543d] text-sm font-bold text-white">
                GM
              </span>
            )}
            <span className="text-lg font-bold">{config.candidateName}</span>
          </a>
          <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
            <a href="#videos">Videos</a>
            <a href="#noticias">Noticias</a>
            <a href="#contacto">Redes</a>
            <a className="rounded bg-[#b02a2a] px-3 py-2 text-white" href="/admin">
              Admin
            </a>
          </div>
        </nav>
      </header>

      <section className="relative min-h-[86vh] overflow-hidden bg-[#173b2f] pt-16 text-white">
        {bannerVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            src={bannerVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#173b2f_0%,#22543d_48%,#b02a2a_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto flex min-h-[calc(86vh-4rem)] max-w-6xl flex-col justify-end px-5 pb-16">
          <p className="mb-4 max-w-xl text-sm font-bold uppercase tracking-[0.22em] text-[#f2d38b]">
            Candidato 2027
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-none md:text-7xl">
            {config.candidateName}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/90">{config.slogan}</p>
        </div>
      </section>

      <section id="videos" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b02a2a]">
              Galeria
            </p>
            <h2 className="mt-2 text-3xl font-black">Videos destacados</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {config.videos.map((video) => (
            <article key={video.title} className="overflow-hidden rounded border border-black/10 bg-white">
              <iframe
                className="aspect-video w-full"
                src={getYoutubeEmbedUrl(video.youtubeUrl)}
                title={video.title}
                allowFullScreen
              />
              <h3 className="p-4 text-lg font-bold">{video.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="noticias" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#22543d]">Noticias</p>
          <h2 className="mt-2 text-3xl font-black">Ultimas novedades</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {config.news.map((item) => (
              <article key={item.title} className="rounded border border-black/10 p-5">
                <time className="text-sm font-semibold text-[#b02a2a]">{item.date}</time>
                <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-black/70">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contacto" className="bg-[#1d1b18] px-5 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-black">{config.candidateName}</h2>
            <p className="mt-3 max-w-xl text-white/70">{config.slogan}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {config.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="flex items-center gap-2 rounded border border-white/20 px-3 py-2 text-sm font-bold"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="grid h-7 w-7 place-items-center rounded bg-white text-xs text-[#1d1b18]">
                    {social.logo}
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          {footerReel ? (
            <video className="aspect-video w-full rounded object-cover" src={footerReel} controls />
          ) : (
            <div className="grid aspect-video place-items-center rounded border border-white/20 text-white/55">
              Reel de pie de pagina
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
