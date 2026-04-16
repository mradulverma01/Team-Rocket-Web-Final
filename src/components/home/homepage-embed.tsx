"use client";

/**
 * Embeds the marketing homepage (built as a standalone SPA) in an iframe so
 * module scripts execute. Same-origin; asset URLs like /assets/* resolve to public/.
 */
export function HomepageEmbed() {
  return (
    <iframe
      className="block min-h-[calc(100dvh-7rem)] w-full flex-1 border-0 md:min-h-[calc(100dvh-6.5rem)]"
      src="/api/homepage-html"
      title="RRDCH homepage"
    />
  );
}
