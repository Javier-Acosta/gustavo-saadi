"use client";

import Link from "next/link";
import { useSiteConfig } from "@/app/lib/use-site-config";
import { getNewsSlug } from "@/app/lib/site-config";

function getVideoEmbedUrl(url: string) {
  if (/facebook\.com|fb\.watch/i.test(url)) {
    const params = new URLSearchParams({
      href: url,
      show_text: "false",
      width: "800",
    });

    return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
  }

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([^&?/]+)/,
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function isEmbeddableVideoUrl(url: string) {
  return /facebook\.com|fb\.watch|youtube\.com|youtu\.be/i.test(url);
}

function getYoutubeVideoId(url: string) {
  return (
    url.match(
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([^&?/]+)/,
    )?.[1] ?? null
  );
}

function getYoutubeBannerUrl(url: string) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    fs: "0",
    disablekb: "1",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export default function Home() {
  const config = useSiteConfig();
  const bannerVideo = config.bannerVideoUrl.trim();
  const bannerYoutubeUrl = getYoutubeBannerUrl(bannerVideo);
  const footerReel = config.footerReelUrl.trim();
  const footerReelEmbed = isEmbeddableVideoUrl(footerReel) ? getVideoEmbedUrl(footerReel) : null;
  const footerLogo = config.footerLogoUrl.trim() || config.logoUrl.trim();
  const latestNews = config.news.slice(0, 6);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: config.colors.pageBackground, color: config.colors.text }}
    >
      <header
        className="fixed left-0 right-0 top-0 z-20 border-b border-black/10 backdrop-blur"
        style={{ backgroundColor: `${config.colors.headerBackground}e6` }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="" className="h-12 w-auto max-w-[190px] object-contain" />
            ) : (
              <span
                className="grid h-10 w-10 place-items-center rounded text-sm font-bold text-white"
                style={{ backgroundColor: config.colors.primary }}
              >
                GS
              </span>
            )}
            <span className="text-lg font-bold">{config.candidateName}</span>
          </a>
          <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
            <a href="#videos">Videos</a>
            <a href="#noticias">Noticias</a>
            <a href="#contacto">Redes</a>
            <a
              className="rounded px-3 py-2 text-white"
              href="/admin"
              style={{ backgroundColor: config.colors.accent }}
            >
              Admin
            </a>
          </div>
        </nav>
      </header>

      <section className="relative min-h-[92svh] overflow-hidden bg-[#173b2f] pt-16 text-white">
        {bannerYoutubeUrl ? (
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[120%] min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 scale-125 border-0 md:h-auto md:w-[120%]"
            src={bannerYoutubeUrl}
            title="Video institucional"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
          />
        ) : bannerVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={bannerVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/gustavo-saadi.png"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
            src="/gustavo-saadi.png"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,25,0.9)_0%,rgba(8,29,25,0.58)_43%,rgba(8,29,25,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(8,29,25,0.72)_0%,rgba(8,29,25,0)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(92svh-4rem)] max-w-6xl flex-col justify-end px-5 pb-16">
          <p className="mb-4 max-w-xl text-sm font-bold uppercase tracking-[0.22em]" style={{ color: "#f2d38b" }}>
            Provincia de Catamarca
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-none md:text-7xl">
            {config.candidateName}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/90">{config.slogan}</p>
          {bannerVideo ? (
            <p className="mt-8 w-fit border border-white/25 bg-black/20 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
              Video institucional
            </p>
          ) : null}
        </div>
      </section>

      <section id="videos" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: config.colors.accent }}>
              {config.videoSectionEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black">{config.videoSectionTitle}</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {config.videos.map((video, index) => (
            <article key={`${video.title}-${index}`} className="overflow-hidden rounded border border-black/10 bg-white">
              <iframe
                className="aspect-video w-full"
                src={getVideoEmbedUrl(video.youtubeUrl)}
                title={video.title}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
              <h3 className="p-4 text-lg font-bold">{video.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="noticias" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: config.colors.primary }}>Noticias</p>
              <h2 className="mt-2 text-3xl font-black">Ultimas novedades</h2>
            </div>
            <Link className="border border-black/15 px-4 py-2 text-sm font-black" href="/noticias">
              Ver todo
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {latestNews.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                className="group overflow-hidden rounded border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                href={`/noticias/${getNewsSlug(item.title, index)}`}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="aspect-video w-full object-cover" />
                ) : null}
                <div className="p-5">
                  <time className="text-sm font-semibold" style={{ color: config.colors.accent }}>{item.date}</time>
                  <h3 className="mt-3 text-xl font-black group-hover:underline">{item.title}</h3>
                  <p className="mt-3 leading-7 text-black/70">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="contacto"
        className="px-5 py-12"
        style={{ backgroundColor: config.colors.footerBackground, color: config.colors.footerText }}
      >
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            {footerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={footerLogo} alt="" className="mb-5 h-14 w-auto max-w-[220px] object-contain" />
            ) : null}
            <h2 className="text-2xl font-black">{config.footerTitle || config.candidateName}</h2>
            <p className="mt-3 max-w-xl opacity-75">{config.footerText || config.slogan}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {config.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="flex items-center gap-2 rounded border px-3 py-2 text-sm font-bold"
                  style={{ borderColor: `${config.colors.footerText}33` }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded text-xs"
                    style={{ backgroundColor: config.colors.footerText, color: config.colors.footerBackground }}
                  >
                    {social.logo}
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          {footerReelEmbed ? (
            <iframe
              className="aspect-video w-full rounded border-0"
              src={footerReelEmbed}
              title="Reel destacado"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : footerReel ? (
            <video className="aspect-video w-full rounded object-cover" src={footerReel} controls />
          ) : (
            <div
              className="grid aspect-video place-items-center rounded border opacity-60"
              style={{ borderColor: `${config.colors.footerText}33` }}
            >
              Reel de pie de pagina
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
