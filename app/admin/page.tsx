"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#25211d]">
      {label}
      <input
        className="border border-[#d9d9d4] bg-white px-3 py-2 font-normal text-[#25211d] outline-none focus:border-[#316c7a]"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#25211d]">
      {label}
      <span className="flex items-center gap-3">
        <input
          type="color"
          className="h-10 w-12 border border-[#d9d9d4] bg-white p-1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className="min-w-0 flex-1 border border-[#d9d9d4] bg-white px-3 py-2 font-mono text-sm font-normal uppercase text-[#25211d] outline-none focus:border-[#316c7a]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

type SectionId =
  | "inicio"
  | "configuracion"
  | "banner"
  | "noticias"
  | "reels"
  | "pie"
  | "invitados"
  | "agenda"
  | "mapa";

const navItems: { id: Exclude<SectionId, "inicio">; label: string }[] = [
  { id: "configuracion", label: "Configuracion" },
  { id: "banner", label: "Banner" },
  { id: "noticias", label: "Noticias" },
  { id: "reels", label: "Reels" },
  { id: "pie", label: "Pie de pagina" },
  { id: "invitados", label: "Invitados" },
  { id: "agenda", label: "Agenda" },
  { id: "mapa", label: "Mapa" },
];

const cards: { id: Exclude<SectionId, "inicio">; title: string; description: string }[] = [
  {
    id: "configuracion",
    title: "Configuracion",
    description: "Logo, colores, nombre, slogan y redes sociales.",
  },
  {
    id: "reels",
    title: "Reels de Instagram",
    description: "Carga enlaces y administra videos destacados.",
  },
  {
    id: "banner",
    title: "Banner",
    description: "Cambia el video principal de la portada.",
  },
  {
    id: "noticias",
    title: "Noticias",
    description: "Publica las novedades diarias del sitio.",
  },
  {
    id: "invitados",
    title: "Invitados",
    description: "Modulo preparado para perfiles y participantes.",
  },
  {
    id: "agenda",
    title: "Agenda",
    description: "Modulo preparado para organizar actividades por dia.",
  },
  {
    id: "mapa",
    title: "Mapa",
    description: "Modulo preparado para ubicar puntos de referencia.",
  },
  {
    id: "pie",
    title: "Pie de pagina",
    description: "Ajusta logo, texto, reel final y redes sociales.",
  },
];

export default function AdminPage() {
  const [config, setConfig] = useState(getStoredConfig);
  const [status, setStatus] = useState("Cargando configuracion");
  const [activeSection, setActiveSection] = useState<SectionId>("inicio");

  const bannerPreview = useMemo(() => config.bannerVideoUrl.trim(), [config.bannerVideoUrl]);
  const footerLogoPreview = config.footerLogoUrl.trim() || config.logoUrl.trim();
  const activeTitle =
    activeSection === "inicio"
      ? "Hola, equipo."
      : navItems.find((item) => item.id === activeSection)?.label;

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
          setStatus("Configuracion cargada desde PocketBase");
        }
      } catch {
        if (!ignore) {
          setConfig(getStoredConfig());
          setStatus("Usando respaldo local");
        }
      }
    }

    void loadConfig();

    return () => {
      ignore = true;
    };
  }, []);

  async function saveConfig() {
    setStatus("Guardando cambios");

    try {
      const response = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Save request failed.");
      }

      const nextConfig = mergeSiteConfig(await response.json());
      setConfig(nextConfig);
      window.localStorage.setItem("candidate-site-config", JSON.stringify(nextConfig));
      setStatus("Cambios guardados en PocketBase");
    } catch {
      window.localStorage.setItem("candidate-site-config", JSON.stringify(config));
      setStatus("PocketBase no respondio; cambios guardados localmente");
    }
  }

  function updateVideoFile(event: ChangeEvent<HTMLInputElement>, target: "bannerVideoUrl" | "footerReelUrl") {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setConfig((current) => ({ ...current, [target]: reader.result as string }));
        setStatus("Video cargado para guardar");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#22566b]">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[208px] border-r border-[#235464]/20 bg-[#316c7a] px-3 py-9 text-white md:block">
        <button
          className="mb-12 text-left text-base font-black uppercase leading-[0.9] tracking-tight text-[#ff6b14]"
          onClick={() => setActiveSection("inicio")}
        >
          Gustavo
          <br />
          Saadi
        </button>
        <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#ff64d8]">
          Administracion
        </p>
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`py-2 text-left text-base font-black transition ${
                activeSection === item.id ? "text-[#ff6b14]" : "text-white hover:text-[#ffb083]"
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="md:pl-[208px]">
        <header className="sticky top-0 z-20 border-b border-[#d9d9d4] bg-[#f7f7f4]/95 px-5 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4">
            <button
              className="text-left text-sm font-black uppercase leading-[0.9] text-[#ff6b14]"
              onClick={() => setActiveSection("inicio")}
            >
              Gustavo
              <br />
              Saadi
            </button>
            <Link className="border border-[#d9d9d4] px-3 py-2 text-sm font-black" href="/">
              Ver pagina
            </Link>
          </div>
          <nav className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`shrink-0 text-sm font-black ${
                  activeSection === item.id ? "text-[#ff6b14]" : "text-[#22566b]"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="mx-auto max-w-[1040px] px-5 py-14 md:px-14 md:py-16">
          <div className="mb-12 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#ff6b14]">
                Panel de contenidos
              </p>
              <h1 className="text-5xl font-light leading-none tracking-[-0.03em] text-[#22566b] md:text-6xl">
                {activeTitle}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-[#57536f]">{status}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {activeSection !== "inicio" ? (
                <button
                  className="border border-[#d9d9d4] px-4 py-2 text-sm font-black text-[#22566b]"
                  onClick={() => setActiveSection("inicio")}
                >
                  Volver
                </button>
              ) : null}
              <Link className="border border-[#d9d9d4] px-4 py-2 text-sm font-black text-[#22566b]" href="/">
                Ver pagina
              </Link>
              <button className="bg-[#ff6b14] px-4 py-2 text-sm font-black text-white" onClick={saveConfig}>
                Guardar
              </button>
            </div>
          </div>

          {activeSection === "inicio" ? (
            <section className="grid gap-5 lg:grid-cols-2">
              {cards.map((card) => (
                <article key={card.id} className="border border-[#d9d9d4] bg-[#fbfbf8] px-6 py-7">
                  <h2 className="text-2xl font-black text-[#22566b]">{card.title}</h2>
                  <p className="mt-6 min-h-[48px] text-base leading-6 text-[#57536f]">{card.description}</p>
                  <button className="mt-3 text-sm font-black text-[#ff5a00]" onClick={() => setActiveSection(card.id)}>
                    Gestionar -&gt;
                  </button>
                </article>
              ))}
            </section>
          ) : null}

          {activeSection === "configuracion" ? (
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
                <h2 className="text-2xl font-black">Identidad</h2>
                <div className="mt-5 grid gap-4">
                  <Field label="Nombre del candidato" value={config.candidateName} onChange={(candidateName) => setConfig({ ...config, candidateName })} />
                  <Field label="Slogan" value={config.slogan} onChange={(slogan) => setConfig({ ...config, slogan })} />
                  <Field label="URL del logo" value={config.logoUrl} onChange={(logoUrl) => setConfig({ ...config, logoUrl })} placeholder="https://..." />
                </div>
              </div>

              <div className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
                <h2 className="text-2xl font-black">Colores</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ColorField label="Fondo general" value={config.colors.pageBackground} onChange={(pageBackground) => setConfig({ ...config, colors: { ...config.colors, pageBackground } })} />
                  <ColorField label="Texto principal" value={config.colors.text} onChange={(text) => setConfig({ ...config, colors: { ...config.colors, text } })} />
                  <ColorField label="Fondo del encabezado" value={config.colors.headerBackground} onChange={(headerBackground) => setConfig({ ...config, colors: { ...config.colors, headerBackground } })} />
                  <ColorField label="Color principal" value={config.colors.primary} onChange={(primary) => setConfig({ ...config, colors: { ...config.colors, primary } })} />
                  <ColorField label="Color de acento" value={config.colors.accent} onChange={(accent) => setConfig({ ...config, colors: { ...config.colors, accent } })} />
                  <ColorField label="Fondo del pie" value={config.colors.footerBackground} onChange={(footerBackground) => setConfig({ ...config, colors: { ...config.colors, footerBackground } })} />
                  <ColorField label="Texto del pie" value={config.colors.footerText} onChange={(footerText) => setConfig({ ...config, colors: { ...config.colors, footerText } })} />
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "banner" ? (
            <section className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
              <h2 className="text-2xl font-black">Banner</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#57536f]">
                Usa un video corto horizontal, idealmente MP4, sin audio obligatorio y de 8 a 20 segundos. Se va a reproducir automaticamente en loop como fondo de portada.
              </p>
              <div className="mt-5 grid gap-4">
                <Field label="URL del video del banner" value={config.bannerVideoUrl} onChange={(bannerVideoUrl) => setConfig({ ...config, bannerVideoUrl })} placeholder="/banner.mp4 o https://.../video.mp4" />
                <label className="grid gap-2 text-sm font-bold text-[#25211d]">
                  Subir video corto para banner
                  <input type="file" accept="video/*" onChange={(event) => updateVideoFile(event, "bannerVideoUrl")} />
                </label>
                {bannerPreview ? (
                  <div className="max-w-3xl border border-[#d9d9d4] bg-[#101f1c] p-3">
                    <video className="aspect-video w-full object-cover" src={bannerPreview} controls muted loop playsInline poster="/gustavo-saadi.png" />
                  </div>
                ) : (
                  <div className="max-w-3xl border border-[#d9d9d4] bg-white p-4 text-sm leading-6 text-[#57536f]">
                    Sin video configurado. La portada usara la imagen institucional de Gustavo Saadi como respaldo.
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {activeSection === "reels" ? (
            <section className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Reels y videos</h2>
                <button className="bg-[#22566b] px-3 py-2 text-sm font-black text-white" onClick={() => setConfig({ ...config, videos: [...config.videos, { title: "", youtubeUrl: "" }] })}>
                  Agregar
                </button>
              </div>
              <div className="mt-5 grid gap-4">
                {config.videos.map((video, index) => (
                  <div key={index} className="grid gap-3 border border-[#d9d9d4] p-4">
                    <Field label="Titulo" value={video.title} onChange={(title) => setConfig({ ...config, videos: config.videos.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)) })} />
                    <Field label="Enlace de YouTube" value={video.youtubeUrl} onChange={(youtubeUrl) => setConfig({ ...config, videos: config.videos.map((item, itemIndex) => (itemIndex === index ? { ...item, youtubeUrl } : item)) })} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeSection === "noticias" ? (
            <section className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Noticias</h2>
                <button className="bg-[#22566b] px-3 py-2 text-sm font-black text-white" onClick={() => setConfig({ ...config, news: [...config.news, { title: "", date: "", summary: "" }] })}>
                  Agregar
                </button>
              </div>
              <div className="mt-5 grid gap-4">
                {config.news.map((item, index) => (
                  <div key={index} className="grid gap-3 border border-[#d9d9d4] p-4">
                    <Field label="Titulo" value={item.title} onChange={(title) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, title } : newsItem)) })} />
                    <Field label="Fecha" value={item.date} onChange={(date) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, date } : newsItem)) })} />
                    <Field label="Resumen" value={item.summary} onChange={(summary) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, summary } : newsItem)) })} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeSection === "pie" ? (
            <section className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
              <h2 className="text-2xl font-black">Pie de pagina</h2>
              <div className="mt-5 grid gap-4">
                <Field label="URL del logo del pie" value={config.footerLogoUrl} onChange={(footerLogoUrl) => setConfig({ ...config, footerLogoUrl })} placeholder="/gustavo-saadi-logo.svg o https://..." />
                <Field label="Titulo del pie" value={config.footerTitle} onChange={(footerTitle) => setConfig({ ...config, footerTitle })} />
                <Field label="Texto del pie" value={config.footerText} onChange={(footerText) => setConfig({ ...config, footerText })} />
                <Field label="URL del reel de pie" value={config.footerReelUrl} onChange={(footerReelUrl) => setConfig({ ...config, footerReelUrl })} />
                {footerLogoPreview ? (
                  <div className="border border-[#d9d9d4] p-4">
                    <p className="mb-3 text-sm font-bold text-[#25211d]">Vista previa del logo del pie</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={footerLogoPreview} alt="" className="h-14 w-auto max-w-[220px] object-contain" />
                  </div>
                ) : null}
                <label className="grid gap-2 text-sm font-bold text-[#25211d]">
                  Subir reel de pie
                  <input type="file" accept="video/*" onChange={(event) => updateVideoFile(event, "footerReelUrl")} />
                </label>
                <button className="w-fit bg-[#22566b] px-3 py-2 text-sm font-black text-white" onClick={() => setConfig({ ...config, socials: [...config.socials, { name: "", url: "", logo: "" }] })}>
                  Agregar red social
                </button>
                {config.socials.map((social, index) => (
                  <div key={index} className="grid gap-3 border border-[#d9d9d4] p-4">
                    <Field label="Red social" value={social.name} onChange={(name) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, name } : item)) })} />
                    <Field label="URL" value={social.url} onChange={(url) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, url } : item)) })} />
                    <Field label="Logo o sigla" value={social.logo} onChange={(logo) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, logo } : item)) })} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {["invitados", "agenda", "mapa"].includes(activeSection) ? (
            <section className="border border-[#d9d9d4] bg-[#fbfbf8] p-6">
              <h2 className="text-2xl font-black">{activeTitle}</h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#57536f]">
                Este modulo queda preparado en el panel para mantener la estructura visual del tablero. Cuando definamos los datos de esta seccion, lo conectamos al sitio publico.
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
