import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const briefFields = [
  { key: "judul", label: "Judul proyek", placeholder: "Contoh: Reels Promo Produk Baru", type: "text" },
  { key: "deskripsi", label: "Deskripsi & tujuan", placeholder: "Jelaskan konsep, target audience, pesan utama, referensi style...", type: "textarea" },
  { key: "durasi", label: "Durasi target", placeholder: "Contoh: 45-60 detik", type: "text" },
  { key: "referensi", label: "Link referensi (TikTok/Reels/YouTube)", placeholder: "Tempel link di sini, pisahkan dengan koma", type: "textarea" },
  { key: "aset", label: "Aset yang disediakan", placeholder: "Footage mentah, logo, font, brand guideline, musik...", type: "textarea" },
  { key: "catatan", label: "Catatan tambahan", placeholder: "Hal khusus yang perlu editor tahu (deadline ketat, brand guideline ketat, dll)", type: "textarea" },
];

const packagesData = [
  { id: "starter", name: "Starter", price: 75000, per: "/video", features: ["Durasi ≤ 60 detik", "2x revisi", "Estimasi 24 jam", "Format 9:16", "Tanpa watermark"], popular: false },
  { id: "pro", name: "Pro", price: 135000, per: "/video", features: ["Durasi ≤ 120 detik", "3x revisi", "Estimasi 24 jam", "Format 9:16 & 1:1", "Tanpa watermark", "Source file (.prproj)"], popular: true },
  { id: "bulk5", name: "Bulk 5", price: 600000, per: "/5 video", features: ["5 video ≤ 60 detik", "2x revisi/video", "Estimasi 48 jam", "Format 9:16", "Tanpa watermark", "Prioritas antrian"], popular: false },
];

function StarRating({ rating, size = 14 }) {
  const r = parseFloat(rating);
  return (
    <span className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="font-alt text-accent" style={{ fontSize: `${size}px` }}>
          {i < Math.floor(r) ? "★" : i < r ? "⯪" : "☆"}
        </span>
      ))}
    </span>
  );
}

function PackageCard({ pkg, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col h-full rounded-[16px] border p-6 transition-all ${
        selected
          ? "border-accent bg-chip ring-2 ring-accent/20"
          : "border-[#20202B] bg-chip hover:border-line"
      } ${pkg.popular ? "ring-2 ring-accent/30" : ""}`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-[22px] items-center rounded-[11px] bg-accent px-3 text-[9.5px] font-semibold text-ink">
          Paling populer
        </span>
      )}
      <h3 className="font-display text-[15px] font-semibold text-white">{pkg.name}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-[28px] font-bold text-white">Rp{pkg.price.toLocaleString("id-ID")}</span>
        <span className="text-[11.5px] text-muted">{pkg.per}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[12px] leading-[18px] text-[#D6D6E4]">
            <span className="flex-shrink-0 mt-[3px] h-[5px] w-[5px] rounded-full bg-accent" />
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className={`mt-6 flex h-[44px] w-full items-center justify-center rounded-[12px] text-[12.5px] font-semibold transition-colors ${
          selected
            ? "bg-accent text-ink hover:bg-lime-500"
            : "bg-surface border border-line text-white hover:border-accent hover:text-accent"
        }`}
      >
        {selected ? "Dipilih ✓" : "Pilih paket ini"}
      </button>
    </button>
  );
}

function BriefForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState(
    briefFields.reduce((acc, f) => ({ ...acc, [f.key]: initialData[f.key] || "" }), {})
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {briefFields.map((field) => (
        <div key={field.key} className="flex flex-col gap-2">
          <label className="text-[11.5px] font-medium text-white">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.key}
              value={form[field.key]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.key === "deskripsi" ? 5 : 3}
              className="h-auto min-h-[80px] rounded-[12px] border border-line bg-surface px-4 py-3 text-[12px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none transition-colors"
            />
          ) : (
            <input
              type="text"
              name={field.key}
              value={form[field.key]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="h-[44px] rounded-[12px] border border-line bg-surface px-4 text-[12px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          )}
        </div>
      ))}

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 h-[18px] w-[18px] rounded-[4px] border-line bg-surface text-accent focus:ring-accent"
        />
        <label htmlFor="terms" className="text-[11.5px] text-muted">
          Saya menyetujui <span className="text-accent underline">Syarat & Ketentuan</span> dan <span className="text-accent underline">Kebijakan Escrow</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full h-[48px] rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 transition-colors"
      >
        Kirim Brief & Lanjut ke Escrow
      </button>
    </form>
  );
}

function EscrowSummary({ pkg, onProceed, onBack }) {
  const platformFee = Math.round(pkg.price * 0.05);
  const total = pkg.price + platformFee;

  return (
    <div className="rounded-[16px] border border-line bg-chip p-6">
      <h3 className="font-display text-[15px] font-semibold text-white">
        Ringkasan Pembayaran Escrow
      </h3>
      <p className="mt-2 text-[11.5px] text-muted">
        Dana ditahan aman sampai Anda approve hasil akhir
      </p>

      <div className="mt-5 space-y-3 border-t border-line pt-4">
        <div className="flex justify-between items-center text-[12.5px] text-[#D6D6E4]">
          <span>Harga paket ({pkg.name})</span>
          <span>Rp{pkg.price.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between items-center text-[12.5px] text-[#D6D6E4]">
          <span>Biaya platform (5%)</span>
          <span>Rp{platformFee.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between items-center text-[15px] font-semibold text-white">
          <span className="font-display">Total escrow</span>
          <span className="font-display">Rp{total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="mt-5 p-4 rounded-[12px] bg-surface border border-line">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5 h-5 w-5 text-accent">🛡</span>
          <div className="text-[11.5px] leading-[17px] text-[#B9B9C9]">
            <p className="font-medium text-white mb-1">Proteksi Escrow Cut & Vibez</p>
            <p>Pembayaran diamankan di escrow. Dana hanya dicairkan ke editor setelah Anda menyetujui draf final. Revisi tidak terbatas hingga puas.</p>
          </div>
        </div>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full h-[48px] rounded-[12px] border border-line bg-surface text-[13.5px] font-semibold text-white hover:border-accent hover:text-accent transition-colors"
        >
          ← Edit Brief
        </button>
      )}

      {onProceed && (
        <button
          type="button"
          onClick={onProceed}
          className="mt-4 w-full h-[48px] rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 transition-colors"
        >
          Bayar & Mulai Proyek (Rp{total.toLocaleString("id-ID")})
        </button>
      )}
    </div>
  );
}

export default function DetailPaket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getEditorById, createOrder } = useApp();

  const editorId = searchParams.get("editor") || "rp";
  const editor = getEditorById(editorId);

  const [selectedPkg, setSelectedPkg] = useState(1);
  const [step, setStep] = useState(1);
  const [briefData, setBriefData] = useState(null);

  useEffect(() => {
    if (!editor) {
      navigate("/");
    }
  }, [editor, navigate]);

  if (!editor) return null;

  const handleBriefSubmit = (data) => {
    setBriefData(data);
    setStep(2);
  };

  const handlePayAndStart = () => {
    if (!briefData) return;
    const pkg = editor.packages[selectedPkg];
    const newOrder = createOrder(editor.id, pkg.id, briefData);
    navigate(`/pesanan?order=${newOrder.id}`);
  };

  const formatPrice = (price) => `Rp${price.toLocaleString("id-ID")}`;

  return (
    <div className="mt-[28px]">
      {/* Header Editor */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <div className={`flex-shrink-0 h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-chip ${editor.gradient} font-display text-[22px] font-semibold text-white`}>
            {editor.initials}
          </div>
          <div>
            <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
              {editor.name}
            </h1>
            <p className="mt-1 text-[12.5px] text-muted">{editor.role}</p>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={editor.rating} size={13} />
              <span className="text-[11.5px] font-semibold text-white">{editor.rating}</span>
              <span className="text-[10.5px] text-dim">· {editor.projects} proyek</span>
              <span className="text-[10.5px] text-dim">{"· Respon < 1 jam"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {editor.tags.map((t) => (
                <span key={t} className="flex h-[22px] items-center rounded-[6px] bg-[#1A1A24] px-[8px] text-[9.5px] leading-none text-[#9C9CB0]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="flex h-[44px] items-center gap-2 rounded-[12px] border border-line bg-surface px-4 text-[12.5px] font-medium text-soft hover:border-accent hover:text-accent transition-colors"
        >
          ← Kembali ke katalog
        </Link>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* About */}
          <section className="rounded-[16px] border border-line bg-chip p-6">
            <h2 className="font-display text-[17px] font-semibold text-white">Tentang editor</h2>
            <p className="mt-3 text-[12.5px] leading-[20px] text-[#D6D6E4]">{editor.bio}</p>
          </section>

          {/* Portfolio */}
          {editor.portfolio.length > 0 && (
            <section>
              <h2 className="font-display text-[17px] font-semibold text-white mb-4">Portofolio terpilih</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {editor.portfolio.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    className="group relative h-[140px] rounded-[12px] overflow-hidden bg-surface border border-line transition-colors hover:border-accent"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">{p.thumb}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-n-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="font-display text-[12px] font-semibold truncate">{p.title}</p>
                      <p className="text-[10px] text-dim">{p.views} views</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Packages */}
          <section>
            <h2 className="font-display text-[17px] font-semibold text-white mb-4">Pilih paket</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {editor.packages.map((pkg, i) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedPkg === i}
                  onSelect={() => setSelectedPkg(i)}
                />
              ))}
            </div>
          </section>

          {/* Step 1: Brief Form */}
          {step === 1 && (
            <section>
              <h2 className="font-display text-[17px] font-semibold text-white mb-4">Isi Brief Proyek</h2>
              <p className="text-[11.5px] text-muted mb-6">
                Detailkan kebutuhan Anda agar editor bisa mulai kerja tepat sasaran.
              </p>
              <BriefForm onSubmit={handleBriefSubmit} />
            </section>
          )}

          {/* Step 2: Escrow Summary */}
          {step === 2 && (
            <section>
              <h2 className="font-display text-[17px] font-semibold text-white mb-4">Konfirmasi & Bayar via Escrow</h2>
              <EscrowSummary
                pkg={editor.packages[selectedPkg]}
                onProceed={handlePayAndStart}
                onBack={() => setStep(1)}
              />
            </section>
          )}
        </div>

        {/* Sidebar: Escrow Summary (sticky on desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <EscrowSummary
              pkg={editor.packages[selectedPkg]}
              onProceed={() => setStep(2)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}