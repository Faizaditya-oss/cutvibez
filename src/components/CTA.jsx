export default function CTA() {
  return (
    <section className="mt-[28px]">
      <div className="relative rounded-[20px] bg-gradient-violet-pink p-8 sm:p-[40px] text-center overflow-hidden">
        <span className="pointer-events-none absolute -right-[80px] -top-[60px] h-[200px] w-[200px] rounded-full bg-white/[0.08]" />
        <span className="pointer-events-none absolute -left-[60px] bottom-[-40px] h-[160px] w-[160px] rounded-full bg-white/[0.06]" />

        <div className="relative max-w-[520px] mx-auto">
          <p className="text-[9.5px] font-semibold leading-[11px] tracking-[0.2105em] text-white/80">
            SIAP MEMULAI PROYEK?
          </p>

          <h2 className="mt-[10px] font-display text-[26px] font-semibold leading-[34px] text-white sm:text-[32px] sm:leading-[40px]">
            Temukan editor yang cocok
            <br />
            <span className="text-accent">hari ini juga.</span>
          </h2>

          <p className="mt-[10px] max-w-[420px] mx-auto text-[12.5px] leading-[20px] text-[#E6E6F0]">
            Bandingkan portofolio, kirim brief, dan bayar aman lewat escrow.
            Hanya butuh beberapa menit untuk memulai.
          </p>

          <div className="mt-[20px] flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button type="button" className="flex h-[44px] w-full max-w-[220px] items-center justify-center gap-[6px] rounded-[12px] bg-white text-[12.5px] font-semibold text-[#3B2E8F]">
              Jelajahi katalog
            </button>
            <button type="button" className="flex h-[44px] w-full max-w-[220px] items-center justify-center gap-[6px] rounded-[12px] border border-white/20 bg-transparent text-[12.5px] font-semibold text-white">
              Jadi editor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}