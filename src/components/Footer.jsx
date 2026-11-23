import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Katalog" },
  { to: "/pesanan", label: "Pesanan" },
  { to: "/editor/dashboard", label: "Dashboard Editor" },
];

export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-4 border-t border-[#191922] pb-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-[10px]">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-accent font-display text-[13px] font-bold leading-none text-ink">
          C
        </span>
        <span className="font-display text-[13px] font-semibold text-white">
          Cut &amp; Vibez
        </span>
        <span className="text-[11px] text-dim">© 2026</span>
      </div>

      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-[11.5px] text-muted transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <span className="text-[11.5px] text-dim">Escrow aman</span>
      </nav>
    </footer>
  );
}
