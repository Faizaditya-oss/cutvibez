import { useState } from "react";
import { Link } from "react-router-dom";
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

const mockTransactions = [
  { id: "txn-001", orderId: "ord-002", type: "pencairan", status: "completed", amount: 157500 * 0.95, fee: 157500 * 0.05, net: 157500 * 0.95, date: "2026-11-12T14:30:00", description: "Pencairan: Aesthetic Vlog Bali · Paket Starter" },
  { id: "txn-002", orderId: "ord-001", type: "escrow_hold", status: "pending", amount: 141750, fee: 0, net: 0, date: "2026-11-18T10:15:00", description: "Escrow ditahan: Retention Reels · Paket Pro" },
  { id: "txn-003", orderId: "ord-003", type: "escrow_hold", status: "pending", amount: 68250, fee: 0, net: 0, date: "2026-11-20T09:05:00", description: "Escrow ditahan: Podcast Clip Ep.45 · Paket Starter" },
  { id: "txn-004", orderId: "ord-005", type: "pencairan", status: "completed", amount: 89250, fee: 89250 * 0.05, net: 89250 * 0.95, date: "2026-11-05T16:20:00", description: "Pencairan: Gaming Shorts · Paket Pro" },
  { id: "txn-005", orderId: "ord-004", type: "pencairan", status: "completed", amount: 220500, fee: 220500 * 0.05, net: 220500 * 0.95, date: "2026-10-28T11:00:00", description: "Pencairan: Motion & 3D · Paket Pro" },
];

const mockWithdrawals = [
  { id: "wd-001", amount: 500000, status: "completed", date: "2026-11-10T10:00:00", method: "Bank BCA", account: "Raka Pratama - 1234567890" },
  { id: "wd-002", amount: 300000, status: "completed", date: "2026-10-25T14:30:00", method: "Bank Mandiri", account: "Raka Pratama - 0987654321" },
];

export default function EditorPencairan() {
  const { getOrdersByEditor } = useApp();

  const editorId = "rp";
  const orders = getOrdersByEditor(editorId);

  const completedOrders = orders.filter((o) => o.status === "selesai");
  const pendingEscrow = orders.filter((o) => !["selesai", "ditolak"].includes(o.status));

  const totalEarned = completedOrders.reduce((sum, o) => sum + o.escrowAmount * 0.95, 0);
  const totalPending = pendingEscrow.reduce((sum, o) => sum + o.escrowAmount * 0.95, 0);
  const availableBalance = totalEarned - mockWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const totalWithdrawn = mockWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const [activeTab, setActiveTab] = useState("overview");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: "📊" },
    { id: "transactions", label: "Transaksi", icon: "💳" },
    { id: "withdraw", label: "Tarik Dana", icon: "🏦" },
  ];

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseInt(withdrawAmount) > availableBalance) return;
    setWithdrawLoading(true);
    setTimeout(() => {
      alert(`Penarikan ${formatPrice(parseInt(withdrawAmount))} berhasil diajukan! Dana akan masuk dalam 1-2 hari kerja.`);
      setWithdrawAmount("");
      setWithdrawLoading(false);
    }, 1000);
  };

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
            Pencairan & Performa
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Kelola saldo, riwayat transaksi, dan pencairan dana
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BalanceCard
          title="Saldo Tersedia"
          value={formatPrice(availableBalance)}
          icon="💰"
          color="accent"
          subtitle="Siap ditarik kapan saja"
        />
        <BalanceCard
          title="Escrow Pending"
          value={formatPrice(totalPending)}
          icon="🛡"
          color="warning"
          subtitle={pendingEscrow.length > 0 ? `${pendingEscrow.length} proyek berjalan` : "Tidak ada escrow aktif"}
        />
        <BalanceCard
          title="Total Pendapatan"
          value={formatPrice(totalEarned)}
          icon="📈"
          color="success"
          subtitle={completedOrders.length > 0 ? `Dari ${completedOrders.length} project selesai` : "Belum ada project selesai"}
        />
        <BalanceCard
          title="Total Ditarik"
          value={formatPrice(totalWithdrawn)}
          icon="🏦"
          color="info"
          subtitle="Sudah cair ke rekening"
        />
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
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          completedOrders={completedOrders}
          pendingEscrow={pendingEscrow}
          availableBalance={availableBalance}
        />
      )}
      {activeTab === "transactions" && (
        <TransactionsTab transactions={mockTransactions} />
      )}
      {activeTab === "withdraw" && (
        <WithdrawTab
          availableBalance={availableBalance}
          withdrawals={mockWithdrawals}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          withdrawMethod={withdrawMethod}
          setWithdrawMethod={setWithdrawMethod}
          onSubmit={handleWithdraw}
          loading={withdrawLoading}
        />
      )}
    </div>
  );
}

function OverviewTab({ completedOrders, pendingEscrow, availableBalance }) {
  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Project Selesai"
          value={completedOrders.length}
          icon="✅"
          color="success"
          trend="+2 bulan ini"
        />
        <StatCard
          title="Rating Rata-rata"
          value="4.9"
          icon="⭐"
          color="accent"
          trend="Dari 38 review"
        />
        <StatCard
          title="Waktu Rata-rata"
          value="22 jam"
          icon="⚡"
          color="info"
          trend="Di bawah estimasi"
        />
        <StatCard
          title="Repeat Client"
          value="65%"
          icon="🔁"
          color="warning"
          trend="Lebih dari setengah klien kembali"
        />
      </div>

      {/* Upcoming Payouts */}
      <section>
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">Pencairan Mendatang</h2>
        <div className="space-y-3">
          {pendingEscrow.slice(0, 3).map((order) => (
            <PayoutRow key={order.id} order={order} estimatedDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()} />
          ))}
          {pendingEscrow.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-[#24242F] bg-surface p-8 text-center text-dim">
              Tidak ada escrow pending
            </div>
          )}
        </div>
      </section>

      {/* Recent Completed */}
      <section>
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">Project Selesai Terbaru</h2>
        <div className="space-y-3">
          {completedOrders.slice(0, 3).map((order) => (
            <CompletedRow key={order.id} order={order} />
          ))}
          {completedOrders.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-[#24242F] bg-surface p-8 text-center text-dim">
              Belum ada project selesai
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TransactionsTab({ transactions }) {
  return (
    <div className="space-y-3">
      {transactions.map((txn) => (
        <TransactionRow key={txn.id} txn={txn} />
      ))}
    </div>
  );
}

function WithdrawTab({ availableBalance, withdrawals, withdrawAmount, setWithdrawAmount, withdrawMethod, setWithdrawMethod, onSubmit, loading }) {
  return (
    <div className="max-w-xl space-y-6">
      {/* Withdraw Form */}
      <div className="rounded-[16px] border border-line bg-chip p-6">
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">Tarik Dana</h2>
        <p className="text-[11.5px] text-muted mb-6">
          Saldo tersedia: <span className="font-display text-white font-semibold">{formatPrice(availableBalance)}</span>
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-[11.5px] font-medium text-white mb-2 block">Jumlah Penarikan</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dim">Rp</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Masukkan jumlah"
                min={10000}
                max={availableBalance}
                className="h-[48px] rounded-[12px] border border-line bg-surface pl-10 pr-4 text-[14px] text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-[10.5px] text-dim">Minimum Rp10.000 · Maksimum {formatPrice(availableBalance)}</p>
          </div>

          <div>
            <label className="text-[11.5px] font-medium text-white mb-2 block">Metode Penarikan</label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] border transition-colors ${withdrawMethod === "bank" ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface text-soft hover:border-accent"}`}>
                <input type="radio" name="method" value="bank" checked={withdrawMethod === "bank"} onChange={(e) => setWithdrawMethod(e.target.value)} className="sr-only" />
                <span>🏦 Transfer Bank</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] border transition-colors ${withdrawMethod === "ewallet" ? "border-accent bg-accent/10 text-accent" : "border-line bg-surface text-soft hover:border-accent"}`}>
                <input type="radio" name="method" value="ewallet" checked={withdrawMethod === "ewallet"} onChange={(e) => setWithdrawMethod(e.target.value)} className="sr-only" />
                <span>📱 E-Wallet</span>
              </label>
            </div>
          </div>

          <div className="rounded-[10px] bg-surface p-3 text-[11px] text-dim">
            <p className="font-medium text-white mb-1">Informasi:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Biaya admin: Gratis untuk transfer bank minimal Rp100.000</li>
              <li>Proses: 1-2 hari kerja (bank), instan (e-wallet)</li>
              <li>Dana dikirim ke rekening terverifikasi di profil</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!withdrawAmount || parseInt(withdrawAmount) > availableBalance || loading}
            className="w-full h-[48px] rounded-[12px] bg-accent text-[13.5px] font-semibold text-ink hover:bg-lime-500 disabled:opacity-50 disabled:hover:bg-accent transition-colors"
          >
            {loading ? "Memproses..." : `Ajukan Penarikan (${formatPrice(parseInt(withdrawAmount) || 0)})`}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="rounded-[16px] border border-line bg-chip p-6">
        <h2 className="font-display text-[17px] font-semibold text-white mb-4">Riwayat Penarikan</h2>
        <div className="space-y-3">
          {withdrawals.length > 0 ? (
            withdrawals.map((w) => (
              <WithdrawalRow key={w.id} withdrawal={w} />
            ))
          ) : (
            <div className="text-center py-8 text-dim">Belum ada riwayat penarikan</div>
          )}
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ title, value, icon, color, subtitle }) {
  const colorMap = {
    accent: "bg-accent/10 text-accent",
    warning: "bg-amber-400/10 text-amber-400",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
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
      <p className="mt-3 text-[10.5px] text-dim">{subtitle}</p>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const colorMap = {
    success: "bg-success/10 text-success",
    accent: "bg-accent/10 text-accent",
    info: "bg-info/10 text-info",
    warning: "bg-amber-400/10 text-amber-400",
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
      <p className="mt-3 text-[10.5px] text-dim">{trend}</p>
    </div>
  );
}

function PayoutRow({ order, estimatedDate }) {
  const netAmount = order.escrowAmount * 0.95;
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-line bg-chip p-4">
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 h-10 w-10 items-center justify-center rounded-full border border-chip ${order.editorGradient} font-display text-[11px] font-semibold text-white`}>
          {order.editorInitials}
        </div>
        <div>
          <p className="font-display text-[13px] font-semibold text-white">{order.title}</p>
          <p className="text-[10.5px] text-dim">Estimasi cair: {formatDate(estimatedDate)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display text-[16px] font-bold text-white">{formatPrice(netAmount)}</p>
        <p className="text-[10.5px] text-dim">Setelah fee 5%</p>
      </div>
    </div>
  );
}

function CompletedRow({ order }) {
  const netAmount = order.escrowAmount * 0.95;
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-line bg-chip p-3">
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 h-8 w-8 items-center justify-center rounded-full border border-chip ${order.editorGradient} font-display text-[10px] font-semibold text-white`}>
          {order.editorInitials}
        </div>
        <div>
          <p className="font-display text-[12px] font-semibold text-white">{order.title}</p>
          <p className="text-[10px] text-dim">{order.packageName} · {formatDate(order.createdAt)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display text-[14px] font-bold text-success">{formatPrice(netAmount)}</p>
        <p className="text-[10px] text-dim">Sudah cair</p>
      </div>
    </div>
  );
}

function TransactionRow({ txn }) {
  const typeConfig = {
    pencairan: { label: "Pencairan", color: "text-success", icon: "✅" },
    escrow_hold: { label: "Escrow Ditahan", color: "text-warning", icon: "🛡" },
    refund: { label: "Refund", color: "text-info", icon: "↩️" },
  };
  const config = typeConfig[txn.type] || typeConfig.pencairan;
  const statusConfig = {
    completed: { label: "Selesai", color: "text-success bg-success/10" },
    pending: { label: "Pending", color: "text-warning bg-warning/10" },
    failed: { label: "Gagal", color: "text-danger bg-danger/10" },
  };
  const sConfig = statusConfig[txn.status] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-line bg-chip p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line text-[16px]">{config.icon}</div>
        <div>
          <p className="font-display text-[13px] font-semibold text-white">{txn.description}</p>
          <p className="text-[10.5px] text-dim">{formatDate(txn.date)} · {config.label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-display text-[14px] font-bold ${txn.type === "pencairan" ? "text-success" : txn.type === "escrow_hold" ? "text-warning" : "text-white"}`}>
          {txn.type === "pencairan" ? "+" : txn.type === "escrow_hold" ? "🛡" : ""}{formatPrice(txn.net || txn.amount)}
        </p>
        <span className={`flex-shrink-0 flex h-[20px] items-center gap-1.5 rounded-[10px] px-2 ${sConfig.color} text-[9px] font-medium`}>
          {sConfig.label}
        </span>
      </div>
    </div>
  );
}

function WithdrawalRow({ withdrawal }) {
  const statusConfig = {
    completed: { label: "Selesai", color: "text-success bg-success/10" },
    pending: { label: "Diproses", color: "text-warning bg-warning/10" },
    failed: { label: "Gagal", color: "text-danger bg-danger/10" },
  };
  const sConfig = statusConfig[withdrawal.status] || statusConfig.completed;

  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-line bg-chip p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line text-[16px]">🏦</div>
        <div>
          <p className="font-display text-[13px] font-semibold text-white">{withdrawal.method}</p>
          <p className="text-[10.5px] text-dim">{withdrawal.account} · {formatDate(withdrawal.date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display text-[14px] font-bold text-white">{formatPrice(withdrawal.amount)}</p>
        <span className={`flex-shrink-0 flex h-[20px] items-center gap-1.5 rounded-[10px] px-2 ${sConfig.color} text-[9px] font-medium`}>
          {sConfig.label}
        </span>
      </div>
    </div>
  );
}