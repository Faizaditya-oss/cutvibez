import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

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

export default function EditorPermintaan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { briefs, acceptBrief, rejectBrief } = useApp();

  const editorId = "rp";
  const editorBriefs = briefs.filter((b) => b.editorId === editorId);

  const briefId = searchParams.get("brief");
  const selectedBrief = briefId ? editorBriefs.find((b) => b.id === briefId) : null;

  const [expandedBrief, setExpandedBrief] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAccept = async (id) => {
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 600));
    acceptBrief(id);
    setActionLoading(null);
    setSearchParams({});
  };

  const handleReject = async (id) => {
    if (!confirm("Yakin ingin menolak permintaan ini?")) return;
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 600));
    rejectBrief(id);
    setActionLoading(null);
  };

  const handleExpand = (id) => {
    setExpandedBrief(expandedBrief === id ? null : id);
    setSearchParams({ brief: expandedBrief === id ? null : id });
  };

  return (
    <div className="mt-[28px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
            Permintaan & Detail Brief
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Kelola permintaan masuk dari klien
          </p>
        </div>
        <Link
          to="/editor/dashboard"
          className="flex h-[44px] items-center gap-2 rounded-[12px] border border-line bg-surface px-4 text-[12.5px] font-medium text-soft hover:border-accent hover:text-accent transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {selectedBrief ? (
        <BriefDetail
          brief={selectedBrief}
          onClose={() => setSearchParams({})}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={actionLoading}
        />
      ) : (
        <BriefList
          briefs={editorBriefs}
          onExpand={handleExpand}
          expandedId={expandedBrief}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

function BriefList({ briefs, onExpand, expandedId, onAccept, onReject, loading }) {
  if (briefs.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-12 text-center rounded-[16px] border border-dashed border-[#24242F] bg-surface">
        <p className="text-[12px] text-dim">Tidak ada permintaan masuk</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {briefs.map((brief) => (
        <BriefCard
          key={brief.id}
          brief={brief}
          isExpanded={expandedId === brief.id}
          onToggle={() => onExpand(brief.id)}
          onAccept={onAccept}
          onReject={onReject}
          loading={loading}
        />
      ))}
    </div>
  );
}

function BriefCard({ brief, isExpanded, onToggle, onAccept, onReject, loading }) {
  const statusConfig = {
    baru: { label: "Baru", color: "text-warning bg-warning/10", icon: "🆕" },
    diterima: { label: "Diterima", color: "text-success bg-success/10", icon: "✅" },
    ditolak: { label: "Ditolak", color: "text-danger bg-danger/10", icon: "❌" },
  };
  const config = statusConfig[brief.status] || statusConfig.baru;

  return (
    <article className="rounded-[16px] border border-line bg-chip overflow-hidden transition-colors hover:border-accent">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 flex items-start gap-4 text-left"
      >
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-violet-pink flex items-center justify-center font-display text-[14px] font-semibold text-white">
          {brief.clientInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[15px] font-semibold text-white truncate">{brief.title}</h3>
            <span className={`flex-shrink-0 flex h-[22px] items-center gap-1.5 rounded-[11px] px-2.5 ${config.color} text-[9.5px] font-medium`}>
              {config.icon} {config.label}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">{brief.clientName} · {brief.packageName} · {formatPrice(brief.packagePrice)}</p>
          <p className="mt-1 text-[10.5px] text-dim">Masuk {formatDate(brief.receivedAt)} · Tenggat {formatDate(brief.deadline)}</p>
          {brief.isRepeatClient && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-[6px] bg-info/10 px-2 py-0.5 text-[9.5px] font-medium text-info">
              🔁 Klien repeat ({brief.clientProjects} proyek)
            </span>
          )}
        </div>
        <span className="flex-shrink-0 font-alt text-[18px] text-dim transition-transform">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-line bg-surface p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-dim">Judul</span>
              <span className="font-medium text-white">{brief.brief.judul}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-dim">Durasi</span>
              <span className="font-medium text-white">{brief.brief.durasi}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] text-dim">Deskripsi & Tujuan</span>
            <p className="text-[12px] leading-[19px] text-[#D6D6E4]">{brief.brief.deskripsi}</p>
          </div>

          {brief.brief.referensi && (
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-dim">Referensi</span>
              <p className="text-[11.5px] text-accent underline truncate">{brief.brief.referensi}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] text-dim">Aset yang Disediakan</span>
            <p className="text-[11.5px] text-[#B9B9C9]">{brief.brief.aset}</p>
          </div>

          {brief.brief.catatan && (
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-dim">Catatan Khusus</span>
              <p className="text-[11.5px] text-warning">{brief.brief.catatan}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onAccept(brief.id)}
              disabled={loading === brief.id || brief.status !== "baru"}
              className="flex-1 h-[44px] items-center justify-center rounded-[12px] bg-accent text-[12.5px] font-semibold text-ink hover:bg-lime-500 disabled:opacity-50 transition-colors"
            >
              {loading === brief.id ? "Memproses..." : "Terima & Mulai Kerja"}
            </button>
            <button
              type="button"
              onClick={() => onReject(brief.id)}
              disabled={loading === brief.id || brief.status !== "baru"}
              className="flex-1 h-[44px] items-center justify-center rounded-[12px] border border-line bg-surface text-[12.5px] font-semibold text-white hover:border-danger hover:text-danger transition-colors"
            >
              Tolak
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function BriefDetail({ brief, onClose, onAccept, onReject, loading }) {
  const statusConfig = {
    baru: { label: "Baru", color: "text-warning bg-warning/10", icon: "🆕" },
    diterima: { label: "Diterima", color: "text-success bg-success/10", icon: "✅" },
    ditolak: { label: "Ditolak", color: "text-danger bg-danger/10", icon: "❌" },
  };
  const config = statusConfig[brief.status] || statusConfig.baru;

  const prevProjects = brief.clientProjects > 0 ? brief.clientProjects + " proyek" : "Klien baru";

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-[16px] border border-line bg-chip p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-violet-pink flex items-center justify-center font-display text-[18px] font-semibold text-white">
              {brief.clientInitials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[19px] font-semibold text-white">{brief.title}</h2>
                <span className={`flex h-[24px] items-center gap-1.5 rounded-[12px] px-3 ${config.color} text-[10px] font-medium`}>
                  {config.icon} {config.label}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted">{brief.clientName} · {brief.packageName} · {formatPrice(brief.packagePrice)}</p>
              <p className="mt-1 text-[10.5px] text-dim">Masuk {formatDate(brief.receivedAt)} · Tenggat {formatDate(brief.deadline)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 h-9 w-9 rounded-full bg-surface border border-line flex items-center justify-center text-dim hover:border-accent hover:text-accent transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-[16px] border border-line bg-chip p-5">
            <h3 className="font-display text-[15px] font-semibold text-white mb-4">Detail Brief</h3>
            <div className="space-y-4">
              <BriefField label="Judul Proyek" value={brief.brief.judul} />
              <BriefField label="Deskripsi & Tujuan" value={brief.brief.deskripsi} multiline />
              <BriefField label="Durasi Target" value={brief.brief.durasi} />
              {brief.brief.referensi && <BriefField label="Referensi" value={brief.brief.referensi} />}
              <BriefField label="Aset yang Disediakan" value={brief.brief.aset} multiline />
              {brief.brief.catatan && <BriefField label="Catatan Khusus" value={brief.brief.catatan} multiline />}
            </div>
          </section>

          <section className="rounded-[16px] border border-line bg-chip p-5">
            <h3 className="font-display text-[15px] font-semibold text-white mb-4">Info Klien</h3>
            <div className="space-y-3">
              <InfoRow label="Nama" value={brief.clientName} />
              <InfoRow label="Proyek Sebelumnya" value={prevProjects} />
              <InfoRow label="Status" value={brief.isRepeatClient ? "Klien Repeat 🔁" : "Klien Baru"} />
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[16px] border border-line bg-chip p-5">
              <h3 className="font-display text-[15px] font-semibold text-white mb-4">Ringkasan Paket</h3>
              <div className="space-y-3">
                <InfoRow label="Paket" value={brief.packageName} />
                <InfoRow label="Harga" value={formatPrice(brief.packagePrice)} />
                <InfoRow label="Biaya Platform (5%)" value={formatPrice(Math.round(brief.packagePrice * 0.05))} />
                <InfoRow label="Total Escrow" value={formatPrice(brief.packagePrice + Math.round(brief.packagePrice * 0.05))} highlight />
              </div>
              <p className="mt-4 text-[11.5px] text-muted">
                Dana ditahan aman sampai klien approve hasil akhir.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onAccept(brief.id)}
                disabled={loading === brief.id || brief.status !== "baru"}
                className="h-[48px] rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 disabled:opacity-50 transition-colors"
              >
                {loading === brief.id ? "Memproses..." : "✓ Terima & Mulai Kerja"}
              </button>
              <button
                type="button"
                onClick={() => onReject(brief.id)}
                disabled={loading === brief.id || brief.status !== "baru"}
                className="h-[48px] rounded-[12px] border border-line bg-surface text-[13.5px] font-semibold text-white hover:border-danger hover:text-danger transition-colors"
              >
                Tolak Permintaan
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BriefField({ label, value, multiline }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10.5px] text-dim">{label}</span>
      {multiline ? (
        <p className="text-[12px] leading-[19px] text-[#D6D6E4] whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="font-medium text-white">{value}</p>
      )}
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-[11.5px] text-muted">{label}</span>
      <span className={`font-medium ${highlight ? "font-display text-white" : "text-white"}`}>{value}</span>
    </div>
  );
}