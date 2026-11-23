const steps = [
  {
    number: "01",
    title: "Pilih editor",
    desc: "Bandingkan gaya edit, tarif, dan estimasi pengerjaan dalam satu katalog.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Kirim brief & escrow",
    desc: "Isi brief detail, dana ditahan aman di escrow sampai draf final disetujui.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Review & revisi",
    desc: "Berikan masukan langsung di timeline, revisi terpusat tanpa batas sampai puas.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Terima hasil final",
    desc: "Unduh video tanpa watermark, dana dicairkan ke editor otomatis.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

const stepStyle =
  "relative flex-1 min-w-[220px] max-w-[280px] flex flex-col items-center text-center p-6";

export default function HowItWorks() {
  return (
    <section className="mt-[28px]">
      <div className="max-w-[620px] mx-auto text-center">
        <h2 className="font-display text-[19px] font-semibold leading-[26px] text-white">
          Cara kerja Cut & Vibez
        </h2>
        <p className="mt-[6px] text-[11.5px] leading-[14px] text-muted">
          Dari pencarian editor hingga video jadi di tangan, tanpa ribet.
        </p>
      </div>

      <div className="mt-[22px] flex flex-col items-center gap-[18px] sm:flex-row sm:justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className={stepStyle}>
            <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-chip border border-line">
              {step.icon}
            </div>

            <div className="absolute -top-[10px] -right-[10px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-accent font-alt text-[10px] font-bold leading-none text-ink">
              {step.number}
            </div>

            <h3 className="mt-[16px] font-display text-[15px] font-semibold leading-[22px] text-white">
              {step.title}
            </h3>
            <p className="mt-[6px] text-[11.5px] leading-[17px] text-muted max-w-[240px]">
              {step.desc}
            </p>

            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute top-[16px] right-[-45px] w-[40px] h-[1px] bg-gradient-to-r from-transparent via-line to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}