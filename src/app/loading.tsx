export default function Loading() {
  return (
    <div className="min-h-[40vh] bg-[var(--app-bg)] text-[var(--app-text)] grid place-items-center px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--gold)] animate-spin" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">Mado Creatives</p>
          <p className="mt-2 text-sm text-white/65">Loading the next page...</p>
        </div>
      </div>
    </div>
  );
}
