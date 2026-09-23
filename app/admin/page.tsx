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
        className="rounded border border-black/15 bg-white px-3 py-2 font-normal outline-none focus:border-[#22543d]"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default function AdminPage() {
  const [config, setConfig] = useState(getStoredConfig);
  const [status, setStatus] = useState("Cargando configuracion");

  const bannerPreview = useMemo(() => config.bannerVideoUrl.trim(), [config.bannerVideoUrl]);

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
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-[#1d1b18]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b02a2a]">Panel</p>
            <h1 className="text-4xl font-black">Administrador del sitio</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-black/60">{status}</span>
            <Link className="rounded border border-black/15 px-4 py-2 font-bold" href="/">
              Ver pagina
            </Link>
            <button className="rounded bg-[#22543d] px-4 py-2 font-bold text-white" onClick={saveConfig}>
              Guardar
            </button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded border border-black/10 bg-white p-5">
            <h2 className="text-xl font-black">Identidad y banner</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Nombre del candidato" value={config.candidateName} onChange={(candidateName) => setConfig({ ...config, candidateName })} />
              <Field label="Slogan" value={config.slogan} onChange={(slogan) => setConfig({ ...config, slogan })} />
              <Field label="URL del logo" value={config.logoUrl} onChange={(logoUrl) => setConfig({ ...config, logoUrl })} placeholder="https://..." />
              <Field label="URL del video del banner" value={config.bannerVideoUrl} onChange={(bannerVideoUrl) => setConfig({ ...config, bannerVideoUrl })} placeholder="/video.mp4 o https://..." />
              <label className="grid gap-2 text-sm font-bold">
                Subir video corto para banner
                <input type="file" accept="video/*" onChange={(event) => updateVideoFile(event, "bannerVideoUrl")} />
              </label>
              {bannerPreview ? <video className="aspect-video w-full rounded object-cover" src={bannerPreview} controls /> : null}
            </div>
          </section>

          <section className="rounded border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">Galeria de YouTube</h2>
              <button className="rounded bg-[#1d1b18] px-3 py-2 text-sm font-bold text-white" onClick={() => setConfig({ ...config, videos: [...config.videos, { title: "", youtubeUrl: "" }] })}>
                Agregar
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              {config.videos.map((video, index) => (
                <div key={index} className="grid gap-3 rounded border border-black/10 p-4">
                  <Field label="Titulo" value={video.title} onChange={(title) => setConfig({ ...config, videos: config.videos.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)) })} />
                  <Field label="Enlace de YouTube" value={video.youtubeUrl} onChange={(youtubeUrl) => setConfig({ ...config, videos: config.videos.map((item, itemIndex) => (itemIndex === index ? { ...item, youtubeUrl } : item)) })} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">Noticias</h2>
              <button className="rounded bg-[#1d1b18] px-3 py-2 text-sm font-bold text-white" onClick={() => setConfig({ ...config, news: [...config.news, { title: "", date: "", summary: "" }] })}>
                Agregar
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              {config.news.map((item, index) => (
                <div key={index} className="grid gap-3 rounded border border-black/10 p-4">
                  <Field label="Titulo" value={item.title} onChange={(title) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, title } : newsItem)) })} />
                  <Field label="Fecha" value={item.date} onChange={(date) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, date } : newsItem)) })} />
                  <Field label="Resumen" value={item.summary} onChange={(summary) => setConfig({ ...config, news: config.news.map((newsItem, itemIndex) => (itemIndex === index ? { ...newsItem, summary } : newsItem)) })} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-black/10 bg-white p-5">
            <h2 className="text-xl font-black">Pie de pagina</h2>
            <div className="mt-5 grid gap-4">
              <Field label="URL del reel de pie" value={config.footerReelUrl} onChange={(footerReelUrl) => setConfig({ ...config, footerReelUrl })} />
              <label className="grid gap-2 text-sm font-bold">
                Subir reel de pie
                <input type="file" accept="video/*" onChange={(event) => updateVideoFile(event, "footerReelUrl")} />
              </label>
              <button className="w-fit rounded bg-[#1d1b18] px-3 py-2 text-sm font-bold text-white" onClick={() => setConfig({ ...config, socials: [...config.socials, { name: "", url: "", logo: "" }] })}>
                Agregar red social
              </button>
              {config.socials.map((social, index) => (
                <div key={index} className="grid gap-3 rounded border border-black/10 p-4">
                  <Field label="Red social" value={social.name} onChange={(name) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, name } : item)) })} />
                  <Field label="URL" value={social.url} onChange={(url) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, url } : item)) })} />
                  <Field label="Logo o sigla" value={social.logo} onChange={(logo) => setConfig({ ...config, socials: config.socials.map((item, itemIndex) => (itemIndex === index ? { ...item, logo } : item)) })} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
