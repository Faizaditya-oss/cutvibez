const chips = ["Semua", "Short-Form", "YouTube", "Podcast", "Cinematic", "Vlog", "Motion"];

export default function HeroSection() {
  return (
    <section className="mt-[28px] flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-[620px]">
        <p className="text-[9.5px] font-semibold leading-[11px] tracking-[0.2105em] text-accent">
          MINGGU INI · 12 EDITOR TERKURASI
        </p>

        <h1 className="mt-[11px] font-display text-[30px] font-bold leading-[38px] text-white sm:text-[38px] sm:leading-[46px]">
          Temukan editor yang
          <br />
          <span className="text-accent">ngerti vibe kamu.</span>
        </h1>

        <p className="mt-[10px] text-[13px] leading-[21px] text-muted">
          Bandingkan gaya edit, tarif, dan estimasi pengerjaan dalam satu tempat.
          <br />
          Bayar aman lewat escrow, revisi terpusat, hasil akhir tanpa watermark.
        </p>

        <div className="mt-[18px] flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <button
              key={chip}
              type="button"
              className={
                index === 0
                  ? "flex h-[38px] items-center rounded-[19px] bg-accent px-[16px] text-[12.5px] font-semibold text-ink"
                  : "flex h-[38px] items-center rounded-[19px] border border-chip-line bg-chip px-[16px] text-[12.5px] font-medium text-soft"
              }
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full shrink-0 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#6C5CE7_0%,#FF5C8A_100%)] p-6 lg:w-[448px]">
        <span className="pointer-events-none absolute -right-[72px] -top-[50px] h-[190px] w-[190px] rounded-full bg-white/[0.12]" />
        <span className="pointer-events-none absolute -right-[44px] top-[82px] h-[120px] w-[120px] rounded-full bg-white/[0.08]" />

        <div className="relative">
          <p className="text-[8.5px] font-semibold leading-[10px] tracking-[0.2353em] text-white">
            CUT &amp; VIBEZ PROTECTION
          </p>
          <h2 className="mt-[10px] font-display text-[20px] font-semibold leading-[30px] text-white">
            Escrow &amp; revisi terpusat
          </h2>
          <p className="mt-[10px] max-w-[290px] text-[11.5px] leading-[17px] text-[#F4EBFF]">
            Dana ditahan aman dan baru dicairkan setelah draf final kamu setujui.
          </p>
          <button
            type="button"
            className="mt-[14px] flex h-[32px] w-[118px] items-center justify-center rounded-[8px] bg-white text-[11.5px] font-semibold text-[#3B2E8F]"
          >
            Cara kerja
          </button>
        </div>
      </div>
    </section>
  );
}
