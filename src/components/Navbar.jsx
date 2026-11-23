import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, getOrdersByClient } = useApp();

  const isClient = currentUser.role === "client";
  const orders = getOrdersByClient();
  const activeOrders = orders.filter((o) => o.status !== "selesai").length;

  const navStyle = (to) =>
    `flex h-[44px] items-center gap-2 rounded-[12px] px-4 text-[12.5px] font-medium transition-colors ${
      location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
        ? "bg-accent text-ink"
        : "border border-line bg-surface text-soft hover:border-accent hover:text-accent"
    }`;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-[44px] w-full items-center rounded-[12px] border border-line bg-surface pl-[16px] pr-[14px] sm:w-[560px]">
        <span className="font-alt text-[17px] leading-none text-dim">⌕</span>
        <input
          type="search"
          placeholder="Cari editor, gaya edit, atau kategori…"
          className="ml-[17px] flex-1 bg-transparent text-[13px] leading-4 text-white placeholder:text-dim outline-none"
          aria-label="Search editors"
        />
        <span className="ml-auto hidden h-[24px] w-[44px] items-center justify-center rounded-[6px] bg-[#181822] text-[10px] leading-none text-muted sm:flex">
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-3 sm:ml-auto">
        {isClient && (
          <>
            <Link to="/pesanan" className={navStyle("/pesanan")}>
              Pesanan
              {activeOrders > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                  {activeOrders}
                </span>
              )}
            </Link>
            <Link to="/detail-paket" className={navStyle("/detail-paket")}>
              ＋ Brief Baru
            </Link>
          </>
        )}

        {!isClient && (
          <Link to="/editor/dashboard" className={navStyle("/editor/dashboard")}>
            Dashboard
          </Link>
        )}

        <div className="flex h-[44px] w-[148px] items-center gap-[6px] rounded-[12px] border border-line bg-surface pl-[14px]">
          <span className="h-[6px] w-[6px] rounded-full bg-accent" />
          <span className="flex flex-col">
            <span className="text-[12.5px] font-medium leading-[15px] text-white">
              Rp 250.000
            </span>
            <span className="text-[9px] leading-[11px] text-dim">Saldo escrow</span>
          </span>
        </div>

        <Link
          to={isClient ? "/pesanan" : "/editor/pencairan"}
          className="flex h-[44px] w-[120px] items-center justify-center gap-[6px] rounded-[12px] bg-accent text-[12.5px] font-semibold text-ink hover:bg-lime-500 transition-colors"
        >
          {isClient ? "Kelola" : "Tarik Dana"}
        </Link>
      </div>
    </header>
  );
}