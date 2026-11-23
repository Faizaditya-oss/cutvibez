import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const statusTabs = [
  { id: "semua", label: "Semua" },
  { id: "menunggu_brief", label: "Menunggu Brief" },
  { id: "dikerjakan", label: "Dikerjakan" },
  { id: "menunggu_review", label: "Menunggu Review" },
  { id: "selesai", label: "Selesai" },
];

const statusConfig = {
  menunggu_brief: { label: "Menunggu Brief", color: "text-warning", bg: "bg-warning/10", icon: "⏳" },
  dikerjakan: { label: "Dikerjakan", color: "text-info", bg: "bg-info/10", icon: "🔄" },
  menunggu_review: { label: "Menunggu Review", color: "text-amber-400", bg: "bg-amber-400/10", icon: "👀" },
  selesai: { label: "Selesai", color: "text-success", bg: "bg-success/10", icon: "✅" },
  revisi: { label: "Revisi", color: "text-danger", bg: "bg-danger/10", icon: "🔁" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price) {
  return `Rp${price.toLocaleString("id-ID")}`;
}

function OrderCard({ order, onViewDetail }) {
  const config = statusConfig[order.status] || statusConfig.menunggu_brief;
  const latestRevision = order.revisions[order.revisions.length - 1];

  return (
    <article
      onClick={onViewDetail}
      className="group relative rounded-[16px] border border-line bg-chip p-5 transition-colors hover:border-accent cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-chip ${order.editorGradient} font-display text-[16px] font-semibold text-white`}>
          {order.editorInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-[15px] font-semibold text-white truncate">
                {order.title}
              </h3>
              <p className="mt-1 text-[11.5px] text-muted">{order.editorName} · {order.packageName}</p>
            </div>
            <span className={`flex-shrink-0 flex h-[24px] items-center gap-1.5 rounded-[12px] px-3 ${config.bg} ${config.color} text-[10px] font-medium`}>
              {config.icon} {config.label}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-[11.5px] text-dim">
            <span>Dibuat {formatDate(order.createdAt)}</span>
            <span>Tenggat {formatDate(order.deadline)}</span>
            <span className="font-medium text-white">{formatPrice(order.escrowAmount)}</span>
          </div>

          {order.status === "dikerjakan" && (
            <div className="mt-4">
              <div className="flex justify-between text-[10.5px] mb-1">
                <span className="text-dim">Progres</span>
                <span className="font-medium text-white">{order.progress}%</span>
              </div>
              <div className="h-[6px] rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
          )}

          {order.status === "menunggu_review" && latestRevision && (
            <div className="mt-3 p-3 rounded-[12px] bg-surface border border-line">
              <p className="text-[11.5px] text-muted">Draf terbaru: <span className="font-medium text-white">{latestRevision.version}</span></p>
              <p className="mt-1 text-[11px] text-dim">Dikirim {formatDate(latestRevision.submittedAt)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/serah-terima?order=${order.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-[36px] items-center gap-2 rounded-[10px] bg-accent px-4 text-[11.5px] font-semibold text-ink hover:bg-lime-500"
        >
          {order.status === "selesai" ? "Lihat Hasil" : "Detail"}
        </Link>
      </div>
    </article>
  );
}

export default function Pesanan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getOrdersByClient } = useApp();

  const initialTab = searchParams.get("tab") || "semua";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders] = useState(getOrdersByClient());

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const filteredOrders =
    activeTab === "semua"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-[28px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
            Pesanan Saya
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Kelola semua proyek editing dari satu tempat
          </p>
        </div>

        <Link
          to="/"
          className="flex h-[44px] items-center gap-2 rounded-[12px] border border-line bg-surface px-4 text-[12.5px] font-medium text-soft hover:border-accent hover:text-accent transition-colors"
        >
          ← Cari editor lain
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map((tab) => {
          const count = tab.id === "semua" ? orders.length : orders.filter((o) => o.status === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex h-[38px] items-center gap-2 rounded-[19px] px-4 text-[12.5px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-accent text-ink"
                  : "border border-chip-line bg-chip text-soft hover:border-accent hover:text-accent"
              }`}
            >
              {tab.label}
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="mt-6 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetail={() => setSearchParams({ order: order.id })}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-[16px] border border-dashed border-[#24242F] bg-surface">
            <p className="text-[12px] text-dim">Tidak ada pesanan dengan status ini</p>
            <Link
              to="/"
              className="mt-4 text-accent underline text-[11.5px]"
            >
              Jelajahi katalog editor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}