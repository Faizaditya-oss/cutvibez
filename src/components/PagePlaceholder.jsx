export default function PagePlaceholder({ code, title, caption }) {
  return (
    <section className="mt-[28px]">
      <p className="text-[9.5px] font-semibold leading-[11px] tracking-[0.2105em] text-accent">
        {code}
      </p>
      <h1 className="mt-[11px] font-display text-[26px] font-semibold leading-[34px] text-white">
        {title}
      </h1>
      {caption && <p className="mt-[6px] text-[12px] text-muted">{caption}</p>}

      <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[16px] border border-dashed border-[#24242F] bg-surface text-[12px] text-dim">
        Layar {code} siap diisi.
      </div>
    </section>
  );
}
