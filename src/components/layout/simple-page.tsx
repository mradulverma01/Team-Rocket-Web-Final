type SimplePageProps = {
  title: string;
  description: string;
};

export function SimplePage({ title, description }: SimplePageProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="rounded-2xl border border-[color:var(--surface-border)] bg-white p-8">
        <h1 className="text-3xl font-bold text-[color:var(--text-dark)]">{title}</h1>
        <p className="mt-3 max-w-3xl text-[color:var(--muted)]">{description}</p>
      </section>
    </main>
  );
}
