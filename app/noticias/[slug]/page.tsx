"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getNewsSlug, getNewsSlugBase, getNewsSlugWithoutIndex } from "@/app/lib/site-config";
import { useSiteConfigState } from "@/app/lib/use-site-config";

function getSlugIndex(slug: string) {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) - 1 : -1;
}

function getSlugTokens(slug: string) {
  return getNewsSlugWithoutIndex(slug)
    .split("-")
    .filter((token) => token.length > 2);
}

function slugLooksLikeTitle(slug: string, title: string) {
  const titleSlug = getNewsSlugBase(title);
  const requestedTokens = getSlugTokens(slug);
  if (requestedTokens.length === 0) {
    return false;
  }

  const matches = requestedTokens.filter((token) => titleSlug.includes(token)).length;
  return matches >= Math.min(4, requestedTokens.length);
}

export default function NoticiaDetallePage() {
  const { config, isLoaded } = useSiteConfigState();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const requestedTitleSlug =
    typeof window === "undefined"
      ? ""
      : getNewsSlugBase(new URLSearchParams(window.location.search).get("title") ?? "");
  const requestedSlugBase = getNewsSlugWithoutIndex(slug);

  const exactOrTitleIndex = config.news.findIndex(
    (item, itemIndex) =>
      (requestedTitleSlug.length > 0 && getNewsSlugBase(item.title) === requestedTitleSlug) ||
      getNewsSlug(item.title, itemIndex) === slug ||
      getNewsSlugBase(item.title) === requestedSlugBase ||
      slugLooksLikeTitle(slug, item.title),
  );
  const slugIndex = getSlugIndex(slug);
  const index =
    exactOrTitleIndex >= 0
      ? exactOrTitleIndex
      : slugIndex >= 0 && slugIndex < config.news.length
        ? slugIndex
        : -1;
  const item = index >= 0 ? config.news[index] : null;

  if (!item && !isLoaded) {
    return (
      <main className="min-h-screen px-5 py-10" style={{ backgroundColor: config.colors.pageBackground, color: config.colors.text }}>
        <div className="mx-auto max-w-4xl">
          <Link className="border border-black/15 px-4 py-2 text-sm font-black" href="/noticias">
            Volver a noticias
          </Link>
          <h1 className="mt-10 text-4xl font-black">Cargando noticia...</h1>
        </div>
      </main>
    );
  }

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
