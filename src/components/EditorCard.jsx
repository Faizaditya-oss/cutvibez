import { Link } from "react-router-dom";

const badge =
  "flex h-[24px] items-center gap-[5px] rounded-[12px] bg-[#0D0D12]/[0.92] px-[9px]";

export default function EditorCard({
  id,
  initials,
  name,
  role,
  rating,
  projects,
  tags,
  price,
  meta,
  gradient,
}) {
  return (
    <Link
      to={`/detail-paket?editor=${id}`}
      className="block overflow-hidden rounded-[16px] border border-[#20202B] bg-chip transition-colors hover:border-accent"
    >
      <article className="h-full">
        <div className={`h-[82px] ${gradient}`}>
          <div className="flex justify-end pr-[14px] pt-[12px]">
            <span className={badge}>
              <span className="h-[5px] w-[5px] rounded-full bg-accent" />
              <span className="text-[9.5px] font-medium leading-none text-accent">
                Tersedia
              </span>
            </span>
          </div>
        </div>

        <div className="px-[18px] pb-[16px]">
          <div className="-mt-[30px] flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-chip bg-[#1B1B26] font-display text-[15px] font-semibold text-white">
            {initials}
          </div>

          <h3 className="mt-[10px] font-display text-[15px] font-semibold leading-[23px] text-white">
            {name}
          </h3>
          <p className="text-[11.5px] leading-[14px] text-muted">{role}</p>

          <div className="mt-[6px] flex items-center gap-[5px]">
            <span className="font-alt text-[11px] leading-none text-accent">★</span>
            <span className="text-[11.5px] font-semibold leading-none text-white">
              {rating}
            </span>
            <span className="ml-[3px] text-[11px] leading-none text-dim">
              · {projects} proyek
            </span>
          </div>

          <div className="mt-[12px] flex flex-wrap gap-[6px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex h-[22px] items-center rounded-[6px] bg-[#1A1A24] px-[8px] text-[9.5px] leading-none text-[#9C9CB0]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-[12px] flex items-start justify-between gap-3 border-t border-[#22222D] pt-[13px]">
            <div>
              <p className="flex items-baseline gap-[6px]">
                <span className="font-display text-[16.5px] font-semibold leading-[22px] text-white">
                  Rp{price.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] leading-none text-dim">/video</span>
              </p>
              <p className="text-[10.5px] leading-[13px] text-muted">{meta}</p>
            </div>

            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-accent font-alt text-[14px] leading-none text-ink">
              ↗
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}