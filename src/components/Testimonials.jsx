const testimonials = [
  {
    avatar: "AM",
    name: "Andi Maulana",
    role: "Content Creator @Traveloka",
    rating: 5,
    text: "Prosesnya sangat cepat dan editor benar-benar ngerti brief. Revisi pun langsung diterapkan tanpa perlu ngulang berkali-kali. Hasilnya clean dan siap publish.",
    project: "Travel Vlog Series · 12 video",
  },
  {
    avatar: "RS",
    name: "Rina Susanti",
    role: "Marketing Lead @Tokopedia",
    rating: 5,
    text: "Escrow systemnya bikin tenang, dana aman sampai approve final. Editor responsif banget, balas chat < 1 jam. Udah 8 project order di sini.",
    project: "Product Reels Campaign · 8 video",
  },
  {
    avatar: "DK",
    name: "Doni Kurniawan",
    role: "Founder @KopiKita",
    rating: 4,
    text: "Kualitas edit konsisten untuk volume besar. Tim support juga membantu pas ada revisi urgent. Value for money banget buat startup.",
    project: "Brand Story & Ads · 15 video",
  },
];

const stars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="font-alt text-[11px] leading-none text-accent">
      {i < rating ? "★" : "☆"}
    </span>
  ));

export default function Testimonials() {
  return (
    <section className="mt-[28px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[19px] font-semibold leading-[26px] text-white">
            Apa kata kreator
          </h2>
          <p className="text-[11.5px] leading-[14px] text-muted">
            Ribuan video sudah diselesaikan lewat platform ini
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="flex h-[38px] items-center rounded-[19px] border border-chip-line bg-chip px-[16px] text-[12.5px] font-medium text-soft">
            Semua ulasan
          </button>
        </div>
      </div>

      <div className="mt-[22px] grid grid-cols-1 gap-x-5 gap-y-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <article key={t.name} className="overflow-hidden rounded-[16px] border border-[#20202B] bg-chip p-[20px]">
            <div className="flex items-center gap-[10px]">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-violet-pink font-display text-[14px] font-semibold text-white">
                {t.avatar}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[13.5px] font-semibold leading-[20px] text-white truncate">
                  {t.name}
                </h3>
                <p className="text-[10.5px] leading-[13px] text-muted truncate">
                  {t.role}
                </p>
              </div>
            </div>

            <div className="mt-[10px] flex items-center gap-[3px]">
              {stars(t.rating)}
            </div>

            <p className="mt-[12px] text-[12px] leading-[19px] text-[#D6D6E4]">
              "{t.text}"
            </p>

            <p className="mt-[10px] text-[10.5px] leading-[13px] text-dim">
              {t.project}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}