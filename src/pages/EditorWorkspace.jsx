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

export default function EditorWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, submitDraft, updateOrderStatus } = useApp();

  const editorId = "rp";
  const editorOrders = orders.filter((o) => o.editorId === editorId);

  const orderId = searchParams.get("order");
  const selectedOrder = orderId ? editorOrders.find((o) => o.id === orderId) : null;

  const [activeTab, setActiveTab] = useState("overview");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [draftVersion, setDraftVersion] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  if (!selectedOrder) {
    return (
      <OrderList
        orders={editorOrders}
        onSelect={(id) => setSearchParams({ order: id })}
      />
    );
  }

  const latestRevision = selectedOrder.revisions[selectedOrder.revisions.length - 1];
  const isSubmitted = selectedOrder.status === "menunggu_review";
  const isApproved = selectedOrder.revisions.some((r) => r.status === "approved");

  const handleFileUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 300);
  };

  const handleSubmitDraft = (e) => {
    e.preventDefault();
    if (!draftVersion.trim()) return;
    submitDraft(selectedOrder.id, draftVersion);
    setDraftVersion("");
    setDraftNotes("");
    setSearchParams({ order: selectedOrder.id });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "brief", label: "Detail Brief", icon: "📝" },
    { id: "revisions", label: "Revisi & Draf", icon: "🔄", badge: selectedOrder.revisions.length },
    { id: "files", label: "File & Aset", icon: "📁" },
  ];

  return (
    <div className="mt-[28px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Link
            to="/editor/dashboard"
            className="inline-flex items-center gap-2 text-[11.5px] text-accent hover:underline mb-2"
          >
            ← Dashboard
          </Link>
          <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
            Workspace: {selectedOrder.title}
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            {selectedOrder.clientName || "Klien"} · {selectedOrder.packageName} · Escrow {formatPrice(selectedOrder.escrowAmount)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/editor/dashboard" className="flex h-[44px] items-center gap-2 rounded-[12px] border border-line bg-surface px-4 text-[12.5px] font-medium text-soft hover:border-accent hover:text-accent">
            Kembali
          </Link>
        </div>
      </div>

      {/* Status Header */}
      <div className="mb-6 rounded-[16px] border border-line bg-chip p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 h-12 w-12 rounded-full border-2 border-chip ${selectedOrder.editorGradient} font-display text-[16px] font-semibold text-white`}>
              {selectedOrder.editorInitials}
            </div>
            <div>
              <p className="font-display text-[17px] font-semibold text-white">{selectedOrder.title}</p>
              <p className="text-[11.5px] text-muted">{selectedOrder.clientName || "Klien"} · Paket {selectedOrder.packageName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[11.5px] text-dim">Progres</span>
              <div className="h-[6px] w-40 rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-accent transition-all duration-500" style={{ width: `${selectedOrder.progress}%` }} />
              </div>
              <span className="font-display text-[14px] font-bold text-white w-10 text-right">{selectedOrder.progress}%</span>
            </div>
            <span className={`flex h-[28px] items-center gap-1.5 rounded-[14px] px-3 ${getStatusStyle(selectedOrder.status)}`}>
              {getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}
            </span>
          </div>
        </div>

        {selectedOrder.deadline && (
          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-dim">
            <span>⏰</span>
            <span>Tenggat: {formatDate(selectedOrder.deadline)}</span>
            {selectedOrder.status === "dikerjakan" && selectedOrder.progress < 100 && (
              <span className="ml-4 text-warning">⚠ Belum selesai</span>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 h-[38px] rounded-[19px] px-4 text-[12.5px] font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-accent text-ink"
                : "border border-chip-line bg-chip text-soft hover:border-accent hover:text-accent"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.badge && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab order={selectedOrder} />}
      {activeTab === "brief" && <BriefTab order={selectedOrder} />}
      {activeTab === "revisions" && (
        <RevisionsTab
          order={selectedOrder}
          draftVersion={draftVersion}
          setDraftVersion={setDraftVersion}
          draftNotes={draftNotes}
          setDraftNotes={setDraftNotes}
          onSubmit={handleSubmitDraft}
          uploading={uploading}
          uploadProgress={uploadProgress}
          handleFileUpload={handleFileUpload}
        />
      )}
      {activeTab === "files" && <FilesTab order={selectedOrder} />}
    </div>
  );
}

function OrderList({ orders, onSelect }) {
  return (
    <div className="mt-6 space-y-3">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Link
            key={order.id}
            to={`/editor/workspace?order=${order.id}`}
            className="flex items-center gap-4 rounded-[12px] border border-line bg-chip p-3 hover:border-accent transition-colors"
          >
            <div className={`flex-shrink-0 h-10 w-10 items-center justify-center rounded-full border border-chip ${order.editorGradient} font-display text-[11px] font-semibold text-white`}>
              {order.editorInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[13px] font-semibold text-white truncate">{order.title}</p>
              <p className="text-[10.5px] text-dim">{order.clientName || "Klien"} · {order.packageName}</p>
            </div>
            <span className={`flex-shrink-0 flex h-[22px] items-center gap-1.5 rounded-[11px] px-2.5 ${getStatusStyle(order.status)} text-[9.5px] font-medium`}>
              {getStatusIcon(order.status)} {getStatusLabel(order.status)}
            </span>
            <span className="flex-shrink-0 font-display text-[14px] font-semibold text-white">
              {formatPrice(order.escrowAmount)}
            </span>
          </Link>
        ))
      ) : (
        <div className="text-center py-12 text-dim">Belum ada pesanan</div>
      )}
    </div>
  );
}

function OverviewTab({ order }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <InfoCard title="Status" value={getStatusLabel(order.status)} icon={getStatusIcon(order.status)} color={getStatusColor(order.status)} />
      <InfoCard title="Progres" value={`${order.progress}%`} icon="📊" color="info" />
      <InfoCard title="Escrow Ditahan" value={formatPrice(order.escrowAmount)} icon="🛡" color="accent" />
      <InfoCard title="Tenggat" value={formatDate(order.deadline)} icon="⏰" color="warning" />
      <InfoCard title="Paket" value={order.packageName} icon="📦" color="success" />
      <InfoCard title="Revisi" value={`${order.revisions.length} kali`} icon="🔄" color="info" />
    </div>
  );
}

function BriefTab({ order }) {
  const brief = order.brief;
  return (
    <div className="space-y-5">
      {brief && (
        <>
          <BriefField label="Judul Proyek" value={brief.judul} />
          <BriefField label="Deskripsi & Tujuan" value={brief.deskripsi} multiline />
          <BriefField label="Durasi Target" value={brief.durasi} />
          {brief.referensi && <BriefField label="Referensi" value={brief.referensi} />}
          <BriefField label="Aset yang Disediakan" value={brief.aset} multiline />
          {brief.catatan && <BriefField label="Catatan Khusus" value={brief.catatan} multiline />}
        </>
      )}
    </div>
  );
}

function RevisionsTab({ order, draftVersion, setDraftVersion, draftNotes, setDraftNotes, onSubmit, uploading, uploadProgress, handleFileUpload }) {
  return (
    <div className="space-y-6">
      {/* Submit New Draft */}
      <div className="rounded-[16px] border border-line bg-chip p-5">
        <h3 className="font-display text-[15px] font-semibold text-white mb-4">Kirim Draf Baru</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-[11.5px] font-medium text-white mb-2 block">Versi Draf (contoh: v1, v2, final)</label>
            <input
              type="text"
              value={draftVersion}
              onChange={(e) => setDraftVersion(e.target.value)}
              placeholder="v1, v2, final, revisi-1..."
              className="h-[44px] rounded-[12px] border border-line bg-surface px-4 text-[12px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-white mb-2 block">Catatan untuk Klien (opsional)</label>
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Jelaskan perubahan yang dilakukan, link preview, dll."
              rows={3}
              className="w-full rounded-[12px] border border-line bg-surface px-4 py-3 text-[12px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={uploading}
              className="flex-1 h-[44px] items-center justify-center rounded-[12px] border border-line bg-surface text-[12.5px] font-medium text-white hover:border-accent hover:text-accent"
            >
              {uploading ? (
                <>
                  <span className="mr-2">📤</span>
                  Mengunggah {Math.round(uploadProgress)}%
                </>
              ) : (
                "📤 Unggah File Video"
              )}
            </button>
            <button
              type="submit"
              disabled={!draftVersion.trim() || uploading}
              className="flex-1 h-[44px] items-center justify-center rounded-[12px] bg-accent text-[12.5px] font-semibold text-ink hover:bg-lime-500 disabled:opacity-50"
            >
              Kirim Draf ke Klien
            </button>
          </div>
          {uploading && (
            <div className="h-[6px] rounded-full bg-surface overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </form>
      </div>

      {/* Revision History */}
      <div className="space-y-4">
        <h3 className="font-display text-[15px] font-semibold text-white">Riwayat Revisi</h3>
        {order.revisions.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#24242F] bg-surface p-8 text-center text-dim">
            Belum ada draf yang dikirim
          </div>
        ) : (
          order.revisions
            .slice()
            .reverse()
            .map((rev, idx) => (
              <RevisionCard key={rev.id} revision={rev} index={order.revisions.length - idx} />
            ))
        )}
      </div>
    </div>
  );
}

function FilesTab({ order }) {
  return (
    <div className="rounded-[16px] border border-line bg-chip p-5">
      <h3 className="font-display text-[15px] font-semibold text-white mb-4">File & Aset Proyek</h3>
      <div className="space-y-3">
        <FileRow name="brief-detail.pdf" size="245 KB" type="pdf" date={order.createdAt} />
        {order.brief?.aset && <FileRow name="aset-klien.zip" size="1.2 GB" type="zip" date={order.createdAt} />}
        {order.finalVideo && <FileRow name="final-video.mp4" size="85 MB" type="video" date={new Date().toISOString()} downloadUrl={order.finalVideo} />}
        {order.invoice && <FileRow name={`invoice-${order.invoice}.pdf`} size="12 KB" type="pdf" date={new Date().toISOString()} />}
      </div>
    </div>
  );
}

function RevisionCard({ revision, index }) {
  const statusConfig = {
    menunggu_review: { label: "Menunggu Review", color: "text-amber-400 bg-amber-400/10", icon: "👀" },
    revisi: { label: "Perlu Revisi", color: "text-danger bg-danger/10", icon: "🔁" },
    approved: { label: "Disetujui ✓", color: "text-success bg-success/10", icon: "✅" },
  };
  const config = statusConfig[revision.status] || statusConfig.menunggu_review;

  return (
    <article className="rounded-[16px] border border-line bg-chip p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-line font-display text-[12px] font-bold text-white">
            {index}
          </span>
          <div>
            <p className="font-display text-[13px] font-semibold text-white">{revision.version}</p>
            <p className="text-[10.5px] text-dim">Dikirim {formatDate(revision.submittedAt)}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 flex h-[22px] items-center gap-1.5 rounded-[11px] px-2.5 ${config.color} text-[9.5px] font-medium`}>
          {config.icon} {config.label}
        </span>
      </div>
      {revision.feedback && (
        <div className="mt-3 p-3 rounded-[10px] bg-surface border border-line">
          <p className="text-[11px] text-dim">Feedback Klien:</p>
          <p className="mt-1 text-[12px] text-[#D6D6E4]">{revision.feedback}</p>
        </div>
      )}
    </article>
  );
}

function FileRow({ name, size, type, date, downloadUrl }) {
  const icons = { pdf: "📄", zip: "📦", video: "🎬", image: "🖼" };
  return (
    <div className="flex items-center gap-3 rounded-[10px] bg-surface p-3">
      <span style={{ fontSize: "20px" }}>{icons[type] || "📎"}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{name}</p>
        <p className="text-[10.5px] text-dim">{size} · {formatDate(date)}</p>
      </div>
      {downloadUrl && (
        <a href={downloadUrl} target="_blank" rel="noopener" className="text-accent underline text-[11.5px] hover:text-white">
          Unduh
        </a>
      )}
    </div>
  );
}

function InfoCard({ title, value, icon, color }) {
  const colorMap = {
    info: "bg-info/10 text-info",
    warning: "bg-amber-400/10 text-amber-400",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <div className="rounded-[16px] border border-line bg-chip p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11.5px] text-muted">{title}</p>
          <p className="mt-1 font-display text-[20px] font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${colorMap[color]}`}>
          <span style={{ fontSize: "20px" }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function BriefField({ label, value, multiline }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-4">
      <span className="text-[10.5px] text-dim">{label}</span>
      {multiline ? (
        <p className="mt-1 text-[12px] leading-[19px] text-[#D6D6E4] whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="mt-1 font-medium text-white">{value}</p>
      )}
    </div>
  );
}

function getStatusLabel(status) {
  const labels = {
    menunggu_brief: "Menunggu Brief",
    dikerjakan: "Dikerjakan",
    menunggu_review: "Menunggu Review",
    selesai: "Selesai",
    revisi: "Revisi",
  };
  return labels[status] || status;
}

function getStatusStyle(status) {
  const styles = {
    menunggu_brief: "text-warning bg-warning/10",
    dikerjakan: "text-info bg-info/10",
    menunggu_review: "text-amber-400 bg-amber-400/10",
    selesai: "text-success bg-success/10",
    revisi: "text-danger bg-danger/10",
  };
  return styles[status] || "text-dim bg-surface";
}

function getStatusIcon(status) {
  const icons = {
    menunggu_brief: "⏳",
    dikerjakan: "🔄",
    menunggu_review: "👀",
    selesai: "✅",
    revisi: "🔁",
  };
  return icons[status] || "📋";
}

function getStatusColor(status) {
  const colors = {
    menunggu_brief: "warning",
    dikerjakan: "info",
    menunggu_review: "warning",
    selesai: "success",
    revisi: "danger",
  };
  return colors[status] || "info";
}