"use client";

import Link from "next/link";
import { useSiteConfig } from "@/app/lib/use-site-config";
import { getNewsSlug } from "@/app/lib/site-config";

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

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {config.news.map((item, index) => (
            <Link
              key={`${item.date}-${item.title}-${index}`}
              className="group overflow-hidden border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              href={`/noticias/${getNewsSlug(item.title, index)}`}
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="aspect-video w-full object-cover" />
              ) : null}
              <div className="p-6">
                <time className="text-sm font-bold" style={{ color: config.colors.accent }}>
                  {item.date}
                </time>
                <h2 className="mt-3 text-2xl font-black leading-8 group-hover:underline">{item.title}</h2>
                <p className="mt-3 leading-7 text-black/70">{item.summary}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
