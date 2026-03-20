interface TitleDetailPageProps {
  params: {
    slug: string;
  };
}

export default function TitleDetailPage({ params }: TitleDetailPageProps) {
  return (
    <section className="p-6 sm:p-10">
      <div className="mx-auto max-w-5xl border border-border bg-surface p-6">
        <h1 className="text-3xl">Title Detail</h1>
        <p className="mt-2 text-sm text-text-secondary">Slug: {params.slug}</p>
      </div>
    </section>
  );
}