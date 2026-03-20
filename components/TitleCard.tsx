import type { Title } from "@/types";

interface TitleCardProps {
  title: Title;
  onClick: () => void;
}

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

export default function TitleCard({ title, onClick }: TitleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full border border-border bg-surface p-3 text-left transition duration-200 hover:scale-[1.02] hover:border-white focus:outline-none focus-visible:border-white"
    >
      <div className="aspect-[2/3] w-full border border-border bg-bg" />
      <p className="mt-3 font-serif text-xl text-text">{title.title}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">{title.type.toUpperCase()}</p>
      <p className="mt-2 text-sm text-text">{formatPrice(title.price)}</p>
    </button>
  );
}