const categories = [
  {
    label: "Short-Form",
    count: "124 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#6C5CE7_0%,#3B2E8F_100%)]",
  },
  {
    label: "YouTube Long-form",
    count: "89 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
        <path d="M8 21l8-8" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#FF5C8A_0%,#7A2E4D_100%)]",
  },
  {
    label: "Podcast & Clip",
    count: "67 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
        <path d="M14 14v7" />
        <path d="M10 21h8" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#22D3EE_0%,#155E75_100%)]",
  },
  {
    label: "Cinematic & Vlog",
    count: "56 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#C8FA4B_0%,#5C7F1F_100%)]",
  },
  {
    label: "Motion & 3D",
    count: "34 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#A78BFA_0%,#4C1D95_100%)]",
  },
  {
    label: "Gaming & SFX",
    count: "41 editor",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    gradient: "bg-[linear-gradient(135deg,#F59E0B_0%,#7C2D12_100%)]",
  },
];

const catCardStyle =
  "relative flex flex-col items-center justify-center gap-3 rounded-[16px] p-6 min-h-[160px] w-full sm:w-[200px]";

export default function Categories() {
  return (
    <section className="mt-[28px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[19px] font-semibold leading-[26px] text-white">
            Kategori populer
          </h2>
          <p className="text-[11.5px] leading-[14px] text-muted">
            Temukan editor spesialis untuk kebutuhan video kamu
          </p>
        </div>

        <button type="button" className="flex h-[38px] items-center rounded-[19px] border border-chip-line bg-chip px-[16px] text-[12.5px] font-medium text-soft">
          Lihat semua&nbsp;&nbsp;⌄
        </button>
      </div>

      <div className="mt-[22px] grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            className={`${catCardStyle} ${cat.gradient}`}
            style={{ border: "1px solid var(--cv-border-subtle)" }}
          >
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] bg-white/10">
              {cat.icon}
            </div>
            <h3 className="font-display text-[14px] font-semibold leading-[20px] text-white text-center">
              {cat.label}
            </h3>
            <p className="text-[10.5px] leading-[13px] text-[#B9B9C9] text-center">
              {cat.count}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}