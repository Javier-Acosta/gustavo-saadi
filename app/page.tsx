"use client";

import { useEffect, useState } from "react";
import { defaultConfig, mergeSiteConfig, SiteConfig } from "@/app/lib/site-config";

function getStoredConfig() {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const stored = window.localStorage.getItem("candidate-site-config");
  if (!stored) {
    return defaultConfig;
  }

  try {
    return mergeSiteConfig(JSON.parse(stored) as Partial<SiteConfig>);
  } catch {
    return defaultConfig;
  }
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function Home() {
  const [config, setConfig] = useState(getStoredConfig);

  useEffect(() => {
    let ignore = false;

    async function loadConfig() {
      try {
        const response = await fetch("/api/site-config", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Config request failed.");
        }

        const nextConfig = mergeSiteConfig(await response.json());
        if (!ignore) {
          setConfig(nextConfig);
          window.localStorage.setItem("candidate-site-config", JSON.stringify(nextConfig));
        }
      } catch {
        if (!ignore) {
          setConfig(getStoredConfig());
        }
      }
    }

    void loadConfig();

    return () => {
      ignore = true;
    };
  }, []);

  const bannerVideo = config.bannerVideoUrl.trim();
  const footerReel = config.footerReelUrl.trim();

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#1d1b18]">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-black/10 bg-[#f7f3ea]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="" className="h-12 w-auto max-w-[190px] object-contain" />
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
            src="/gustavo-saadi.png"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,25,0.92)_0%,rgba(10,31,25,0.68)_42%,rgba(10,31,25,0.18)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(86vh-4rem)] max-w-6xl flex-col justify-end px-5 pb-16">
          <p className="mb-4 max-w-xl text-sm font-bold uppercase tracking-[0.22em] text-[#f2d38b]">
            Provincia de Catamarca
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
