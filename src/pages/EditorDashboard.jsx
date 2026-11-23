import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const editorNav = [
  { to: "/editor/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/editor/permintaan", label: "Permintaan Baru", icon: "📥", badge: 3 },
  { to: "/editor/workspace", label: "Workspace", icon: "🛠", badge: 2 },
  { to: "/editor/pencairan", label: "Pencairan & Performa", icon: "💰" },
];

export default function EditorDashboard() {
  const location = useLocation();
  const { getOrdersByEditor, getBriefsByEditor } = useApp();

  const editorId = "rp"; // Current logged-in editor
  const orders = getOrdersByEditor(editorId);
  const briefs = getBriefsByEditor(editorId);

  const activeOrders = orders.filter((o) => !["selesai", "ditolak"].includes(o.status)).length;
  const pendingBriefs = briefs.filter((b) => b.status === "baru").length;
  const completedThisMonth = orders.filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth()).length;
  const earningsThisMonth = orders
    .filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + o.escrowAmount * 0.95, 0); // minus 5% platform fee

  const formatPrice = (price) => `Rp${price.toLocaleString("id-ID")}`;

  return (
    <div className="mt-[28px]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="rounded-[16px] border border-line bg-chip p-4 space-y-1">
            {editorNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-[12px] px-3 py-3 text-[12.5px] font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-accent text-ink"
                    : "text-soft hover:bg-surface hover:text-white"
                }`}
              >
                <span className="text-[16px]">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="mt-4 rounded-[16px] border border-line bg-chip p-4 space-y-3">
            <h3 className="font-display text-[13px] font-semibold text-white">Ringkasan Bulan Ini</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-[12px] bg-surface p-3">
                <p className="font-display text-[18px] font-bold text-white">{completedThisMonth}</p>
                <p className="text-[10px] text-dim">Project Selesai</p>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <p className="font-display text-[18px] font-bold text-white">{formatPrice(earningsThisMonth)}</p>
                <p className="text-[10px] text-dim">Pendapatan (net)</p>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <p className="font-display text-[18px] font-bold text-white">{orders.filter((o) => o.status === "dikerjakan").length}</p>
                <p className="text-[10px] text-dim">Sedang Dikerjakan</p>
              </div>
              <div className="rounded-[12px] bg-surface p-3">
                <p className="font-display text-[18px] font-bold text-white">{pendingBriefs}</p>
                <p className="text-[10px] text-dim">Permintaan Baru</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-[26px] font-semibold leading-[34px] text-white">
                Dashboard Editor
              </h1>
              <p className="mt-1 text-[12.5px] text-muted">
                Halo, Raka! Kelola pesanan & performa Anda di sini.
              </p>
            </div>
            <Link
              to="/editor/permintaan"
              className="flex h-[44px] items-center gap-2 rounded-[12px] bg-accent px-4 text-[12.5px] font-semibold text-ink hover:bg-lime-500"
            >
              ＋ Terima Permintaan
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              title="Pesanan Aktif"
              value={activeOrders}
              icon="📋"
              color="info"
              trend="+2 dari bulan lalu"
            />
            <StatCard
              title="Menunggu Review"
              value={orders.filter((o) => o.status === "menunggu_review").length}
              icon="👀"
              color="warning"
              trend="Butuh perhatian"
            />
            <StatCard
              title="Total Escrow Ditahan"
              value={formatPrice(orders.filter((o) => !["selesai", "ditolak"].includes(o.status)).reduce((s, o) => s + o.escrowAmount, 0))}
              icon="🛡"
              color="accent"
              trend="Akan cair otomatis"
            />
            <StatCard
              title="Rating Rata-rata"
              value="4.9"
              icon="⭐"
              color="success"
              trend="Dari 38 review"
            />
          </div>

          {/* Recent Orders */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[17px] font-semibold text-white">Pesanan Terbaru</h2>
              <Link to="/editor/workspace" className="text-[11.5px] text-accent hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <EditorOrderRow key={order.id} order={order} />
              ))}
              {orders.length === 0 && (
                <div className="text-center py-8 text-dim">Belum ada pesanan</div>
              )}
            </div>
          </section>

          {/* Recent Briefs */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[17px] font-semibold text-white">Permintaan Baru</h2>
              <Link to="/editor/permintaan" className="text-[11.5px] text-accent hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="space-y-3">
              {briefs.slice(0, 3).map((brief) => (
                <BriefRow key={brief.id} brief={brief} />
              ))}
              {briefs.length === 0 && (
                <div className="text-center py-8 text-dim">Tidak ada permintaan baru</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const colorMap = {
    info: "bg-info/10 text-info",
    warning: "bg-amber-400/10 text-amber-400",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
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
      <p className="mt-3 text-[10px] text-dim">{trend}</p>
    </div>
  );
}

function EditorOrderRow({ order }) {
  const statusConfig = {
    menunggu_brief: { label: "Menunggu Brief", color: "text-warning bg-warning/10" },
    dikerjakan: { label: "Dikerjakan", color: "text-info bg-info/10" },
    menunggu_review: { label: "Menunggu Review", color: "text-amber-400 bg-amber-400/10" },
    selesai: { label: "Selesai", color: "text-success bg-success/10" },
  };
  const config = statusConfig[order.status] || statusConfig.menunggu_brief;

  return (
    <Link
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
      <span className={`flex-shrink-0 flex h-[22px] items-center gap-1.5 rounded-[11px] px-2.5 ${config.color} text-[9.5px] font-medium`}>
        {config.label}
      </span>
      <span className="flex-shrink-0 font-display text-[14px] font-semibold text-white">
        {`Rp${order.escrowAmount.toLocaleString("id-ID")}`}
      </span>
    </Link>
  );
}

function BriefRow({ brief }) {
  return (
    <Link
      to={`/editor/permintaan?brief=${brief.id}`}
      className="flex items-center gap-4 rounded-[12px] border border-line bg-chip p-3 hover:border-accent transition-colors"
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-violet-pink flex items-center justify-center font-display text-[11px] font-semibold text-white">
        {brief.clientInitials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-[13px] font-semibold text-white truncate">{brief.title}</p>
        <p className="text-[10.5px] text-dim">{brief.clientName} · {brief.packageName} · {brief.packagePrice.toLocaleString("id-ID")}</p>
      </div>
      <span className="flex-shrink-0 flex h-[22px] items-center gap-1.5 rounded-[11px] bg-warning/10 px-2.5 text-warning text-[9.5px] font-medium">
        {brief.status === "baru" ? "⏳ Baru" : brief.status}
      </span>
    </Link>
  );
}