"use client";

import Link from "next/link";
import { useSiteConfig } from "@/app/lib/use-site-config";

export default function NoticiasPage() {
  const config = useSiteConfig();

  return (
    <main
      className="min-h-screen px-5 py-10"
      style={{ backgroundColor: config.colors.pageBackground, color: config.colors.text }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ color: config.colors.accent }}>
              Noticias
            </p>
            <h1 className="mt-3 text-5xl font-black leading-none">Todas las noticias</h1>
          </div>
          <Link className="border border-black/15 px-4 py-2 text-sm font-black" href="/">
            Volver al inicio
          </Link>
        </header>

        <section className="grid gap-5">
          {config.news.map((item) => (
            <article key={`${item.date}-${item.title}`} className="border border-black/10 bg-white p-6">
              <time className="text-sm font-bold" style={{ color: config.colors.accent }}>
                {item.date}
              </time>
              <h2 className="mt-3 text-2xl font-black">{item.title}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-black/70">{item.summary}</p>
              <div className="mt-5 max-w-4xl whitespace-pre-line leading-8 text-black/75">
                {item.body || item.summary}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
