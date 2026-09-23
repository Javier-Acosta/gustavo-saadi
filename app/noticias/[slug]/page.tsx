"use client";

import Link from "next/link";
import { getNewsSlug } from "@/app/lib/site-config";
import { useSiteConfig } from "@/app/lib/use-site-config";

export default function NoticiaDetallePage({ params }: { params: { slug: string } }) {
  const config = useSiteConfig();
  const index = config.news.findIndex((item, itemIndex) => getNewsSlug(item.title, itemIndex) === params.slug);
  const item = index >= 0 ? config.news[index] : null;

  if (!item) {
    return (
      <main className="min-h-screen px-5 py-10" style={{ backgroundColor: config.colors.pageBackground, color: config.colors.text }}>
        <div className="mx-auto max-w-4xl">
          <Link className="border border-black/15 px-4 py-2 text-sm font-black" href="/noticias">
            Volver a noticias
          </Link>
          <h1 className="mt-10 text-4xl font-black">Noticia no encontrada</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-10" style={{ backgroundColor: config.colors.pageBackground, color: config.colors.text }}>
      <article className="mx-auto max-w-4xl">
        <Link className="border border-black/15 px-4 py-2 text-sm font-black" href="/noticias">
          Volver a noticias
        </Link>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="mt-8 max-h-[520px] w-full object-cover" />
        ) : null}
        <div className="mt-8">
          <time className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: config.colors.accent }}>
            {item.date}
          </time>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{item.title}</h1>
          <p className="mt-6 text-xl leading-9 text-black/70">{item.summary}</p>
          <div className="mt-8 whitespace-pre-line text-lg leading-9 text-black/80">
            {item.body || item.summary}
          </div>
        </div>
      </article>
    </main>
  );
}
