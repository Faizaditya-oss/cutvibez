import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price) {
  return `Rp${price.toLocaleString("id-ID")}`;
}

function StarRating({ rating, onChange, interactive = false, size = 28 }) {
  return (
    <div className="flex items-center gap-2" role={interactive ? "radiogroup" : "img"}>
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => interactive && onChange(i + 1)}
          disabled={!interactive}
          className="font-alt text-accent transition-colors hover:scale-110 disabled:hover:scale-100"
          style={{ fontSize: `${size}px` }}
          aria-label={`${i + 1} bintang`}
        >
          {i < rating ? "★" : "☆"}
        </button>
      ))}
      {interactive && (
        <span className="ml-2 text-[12px] text-muted">
          {rating > 0 ? `${rating}/5` : "Klik untuk memberi rating"}
        </span>
      )}
    </div>
  );
}

export default function SerahTerima() {
  const [searchParams] = useSearchParams();
  const { orders, approveRevision } = useApp();

  const orderId = searchParams.get("order");
  const order = orders.find((o) => o.id === orderId);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="mt-[28px] flex flex-col items-center justify-center py-12 text-center rounded-[16px] border border-dashed border-[#24242F] bg-surface">
        <p className="text-[12px] text-dim">Pesanan tidak ditemukan</p>
        <Link to="/pesanan" className="mt-4 text-accent underline text-[11.5px]">
          Kembali ke pesanan
        </Link>
      </div>
    );
  }

  const latestRevision = order.revisions[order.revisions.length - 1];
  const isCompleted = order.status === "selesai";
  const hasReview = submitted || (isCompleted && order.clientReview);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);

    // In real app, would call API to save review
    console.log("Review submitted:", { orderId, rating, review });
  };

  return (
    <div className="mt-[28px] max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
            Serah Terima & Ulasan
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            {order.title} · {order.editorName} · {order.packageName}
          </p>
        </div>

        <Link
          to="/pesanan"
          className="flex h-[44px] items-center gap-2 rounded-[12px] border border-line bg-surface px-4 text-[12.5px] font-medium text-soft hover:border-accent hover:text-accent transition-colors"
        >
          ← Kembali
        </Link>
      </div>

      {/* Order Info Card */}
      <div className="mt-6 rounded-[16px] border border-line bg-chip p-5">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-chip ${order.editorGradient} font-display text-[16px] font-semibold text-white`}>
            {order.editorInitials}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-[15px] font-semibold text-white">{order.title}</h3>
            <p className="mt-1 text-[11.5px] text-muted">
              {order.editorName} · Paket {order.packageName} · {formatPrice(order.escrowAmount)} escrow
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-dim">
              <span>Dibuat: {formatDate(order.createdAt)}</span>
              <span>Tenggat: {formatDate(order.deadline)}</span>
              {order.invoice && <span>Invoice: {order.invoice}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <section className="mt-8">
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">
          Timeline Progres
        </h2>
        <div className="relative pl-6 border-l border-line">
          {[
            { label: "Pesanan dibuat", time: order.createdAt, done: true, icon: "📝" },
            { label: "Brief dikirim", time: order.brief?.submittedAt || order.createdAt, done: order.status !== "menunggu_brief", icon: "📋" },
            { label: "Editor mulai kerja", time: order.revisions[0]?.submittedAt, done: ["dikerjakan", "menunggu_review", "selesai"].includes(order.status), icon: "🔄" },
            { label: "Draf dikirim", time: latestRevision?.submittedAt, done: ["menunggu_review", "selesai"].includes(order.status), icon: "📤" },
            { label: "Disetujui & Selesai", time: order.revisions.find((r) => r.status === "approved")?.submittedAt, done: isCompleted, icon: "✅" },
          ].map((step, i) => (
            <div key={i} className="relative pb-6 last:pb-0">
              <div className="absolute left-[-22px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-line bg-canvas text-[12px] z-10">
                {step.done ? "✓" : step.icon}
              </div>
              <div className={`ml-2 pt-1 ${step.done ? "" : "text-dim"}`}>
                <p className="font-medium text-white">{step.label}</p>
                {step.time && step.done && (
                  <p className="text-[11px] text-dim">{formatDate(step.time)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Delivery */}
      {isCompleted && (
        <section className="mt-8 space-y-4">
          <h2 className="font-display text-[17px] font-semibold text-white mb-4">
            Hasil Akhir
          </h2>

          <div className="rounded-[16px] border border-line bg-chip p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[12px] bg-surface flex items-center justify-center text-3xl">🎬</div>
                <div>
                  <p className="font-display text-[15px] font-semibold text-white">Video Final</p>
                  <p className="text-[11.5px] text-muted">Siap diunduh tanpa watermark</p>
                </div>
              </div>
              <a
                href={order.finalVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[40px] items-center gap-2 rounded-[10px] bg-accent px-4 text-[12px] font-semibold text-ink hover:bg-lime-500"
              >
                Unduh Video
              </a>
            </div>
          </div>

          <div className="rounded-[16px] border border-line bg-chip p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[12px] bg-surface flex items-center justify-center text-3xl">📄</div>
                <div>
                  <p className="font-display text-[15px] font-semibold text-white">Invoice Resmi</p>
                  <p className="text-[11.5px] text-muted">Untuk keperluan administrasi/perpajakan</p>
                </div>
              </div>
              <button className="flex h-[40px] items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[12px] font-medium text-white hover:border-accent hover:text-accent">
                Unduh Invoice
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Review Section */}
      <section className="mt-8">
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">
          {hasReview ? "Ulasan Anda" : "Beri Ulasan untuk Editor"}
        </h2>

        {hasReview ? (
          <div className="rounded-[16px] border border-line bg-chip p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-violet-pink flex items-center justify-center font-display text-[14px] font-semibold text-white">
                US
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[15px] font-semibold text-white">Anda</span>
                  <StarRating rating={rating || 5} size={18} />
                </div>
                <p className="mt-2 text-[12.5px] leading-[20px] text-[#D6D6E4]">
                  {review || "Editor sangat profesional, hasil sesuai ekspektasi, komunikasi lancar. Recommended!"}
                </p>
                <p className="mt-2 text-[11px] text-dim">Dikirim pada {formatDate(new Date().toISOString())}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="rounded-[16px] border border-line bg-chip p-5 space-y-5">
            <div>
              <label className="text-[11.5px] font-medium text-white mb-2 block">Rating</label>
              <StarRating rating={rating} onChange={setRating} interactive size={32} />
            </div>

            <div>
              <label className="text-[11.5px] font-medium text-white mb-2 block">Ulasan (opsional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Bagikan pengalaman Anda bekerja dengan editor ini..."
                rows={4}
                className="w-full rounded-[12px] border border-line bg-surface px-4 py-3 text-[12px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="w-full h-[48px] rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 disabled:opacity-50 disabled:hover:bg-accent transition-colors"
            >
              {submitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>
        )}
      </section>

      <div className="mt-8 flex gap-3">
        <Link
          to="/pesanan"
          className="flex-1 h-[48px] items-center justify-center rounded-[12px] border border-line bg-surface text-[13.5px] font-semibold text-white hover:border-accent hover:text-accent transition-colors"
        >
          ← Kembali ke Pesanan
        </Link>
        <Link
          to="/"
          className="flex-1 h-[48px] items-center justify-center rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 transition-colors"
        >
          Pesan Lagi
        </Link>
      </div>
    </div>
  );
}