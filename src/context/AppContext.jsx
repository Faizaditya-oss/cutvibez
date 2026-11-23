import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AppContext = createContext(null);

// Mock data
const initialEditors = [
  {
    id: "rp",
    initials: "RP",
    name: "Raka Pratama",
    role: "Retention Reels",
    rating: 4.9,
    projects: 38,
    tags: ["TikTok", "Reels", "Short-Form"],
    price: 75000,
    meta: "Estimasi 24 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#6C5CE7_0%,#3B2E8F_100%)]",
    bio: "Editor retention specialist dengan 3+ tahun pengalaman bikin Reels & TikTok yang bikin viewer nonton sampai habis. Fokus pada hook 3 detik pertama, pacing cepat, dan retention graph yang datar.",
    portfolio: [
      { id: 1, thumb: "📹", title: "Travel Reels Series", views: "2.4M" },
      { id: 2, thumb: "📹", title: "Product Demo Shorts", views: "890K" },
      { id: 3, thumb: "📹", title: "Educational TikToks", views: "1.1M" },
    ],
    packages: [
      { id: "starter", name: "Starter", price: 75000, per: "/video", features: ["Durasi ≤ 60 detik", "2x revisi", "Estimasi 24 jam", "Format 9:16", "Tanpa watermark"], popular: false },
      { id: "pro", name: "Pro", price: 135000, per: "/video", features: ["Durasi ≤ 120 detik", "3x revisi", "Estimasi 24 jam", "Format 9:16 & 1:1", "Tanpa watermark", "Source file (.prproj)"], popular: true },
      { id: "bulk5", name: "Bulk 5", price: 600000, per: "/5 video", features: ["5 video ≤ 60 detik", "2x revisi/video", "Estimasi 48 jam", "Format 9:16", "Tanpa watermark", "Prioritas antrian"], popular: false },
    ],
  },
  {
    id: "ns",
    initials: "NS",
    name: "Nadia Salsabila",
    role: "Aesthetic Vlog",
    rating: 5.0,
    projects: 24,
    tags: ["Vlog", "Cinematic", "Color Grading"],
    price: 150000,
    meta: "Estimasi 48 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#FF5C8A_0%,#7A2E4D_100%)]",
    bio: "Spesialis aesthetic vlog & cinematic color grading. Portfolio includes travel, lifestyle, brand films.",
    portfolio: [],
    packages: [
      { id: "starter", name: "Starter", price: 150000, per: "/video", features: ["Durasi ≤ 90 detik", "2x revisi", "Estimasi 48 jam"], popular: false },
      { id: "pro", name: "Pro", price: 280000, per: "/video", features: ["Durasi ≤ 180 detik", "3x revisi", "Estimasi 48 jam", "Color grade custom"], popular: true },
    ],
  },
  {
    id: "da",
    initials: "DA",
    name: "Dimas Aryo",
    role: "Podcast Clip",
    rating: 4.8,
    projects: 51,
    tags: ["Podcast", "Subtitle", "Long-form"],
    price: 65000,
    meta: "Estimasi 48 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#22D3EE_0%,#155E75_100%)]",
    bio: "Expert podcast clipping & subtitle. Fast turnaround for weekly shows.",
    portfolio: [],
    packages: [],
  },
  {
    id: "kh",
    initials: "KH",
    name: "Kevin Halim",
    role: "Gaming Shorts",
    rating: 4.9,
    projects: 47,
    tags: ["Gaming", "SFX", "Montage"],
    price: 90000,
    meta: "Estimasi 36 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#C8FA4B_0%,#5C7F1F_100%)]",
    bio: "Gaming montage & SFX specialist. High-energy edits for YouTube Shorts/TikTok.",
    portfolio: [],
    packages: [],
  },
  {
    id: "sw",
    initials: "SW",
    name: "Sarah Wijaya",
    role: "Motion & 3D",
    rating: 4.7,
    projects: 19,
    tags: ["Motion", "3D", "After Effects"],
    price: 210000,
    meta: "Estimasi 72 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#A78BFA_0%,#4C1D95_100%)]",
    bio: "Motion design & 3D animation. Blender + After Effects pipeline.",
    portfolio: [],
    packages: [],
  },
  {
    id: "bn",
    initials: "BN",
    name: "Bagas Nugroho",
    role: "YouTube Long-form",
    rating: 4.8,
    projects: 33,
    tags: ["YouTube", "Docs", "Storytelling"],
    price: 185000,
    meta: "Estimasi 48 jam · 2x revisi",
    gradient: "bg-[linear-gradient(135deg,#F59E0B_0%,#7C2D12_100%)]",
    bio: "Documentary & long-form YouTube editor. Strong narrative pacing.",
    portfolio: [],
    packages: [],
  },
];

const initialOrders = [
  {
    id: "ord-001",
    editorId: "rp",
    editorName: "Raka Pratama",
    editorInitials: "RP",
    editorGradient: "bg-[linear-gradient(135deg,#6C5CE7_0%,#3B2E8F_100%)]",
    packageId: "pro",
    packageName: "Pro",
    title: "Retention Reels · 60 detik",
    brief: {
      judul: "Reels Promo Produk Baru - Minuman Sehat",
      deskripsi: "Promo minuman sehat baru, target Gen Z, vibe energetic & fresh. Referensi style: fast cuts, text overlay dynamic, upbeat music.",
      durasi: "45-60 detik",
      referensi: "https://tiktok.com/@example/video/123, https://reels.instagram.com/p/abc",
      aset: "Footage produk (5GB), logo AI, font Poppins, brand guideline PDF, musik library Epidemic Sound",
      catatan: "Deadline ketat: butuh draf H+1. Brand color wajib mengikuti guideline.",
    },
    status: "dikerjakan",
    progress: 65,
    createdAt: "2026-11-18T10:12:00",
    deadline: "2026-11-19T16:00:00",
    escrowAmount: 141750,
    revisions: [
      { id: 1, version: "v1", submittedAt: "2026-11-18T20:30:00", feedback: "Percepat pacing 0:15-0:30, ganti musik ke lebih upbeat", status: "revisi" },
      { id: 2, version: "v2", submittedAt: "2026-11-19T10:00:00", feedback: "", status: "menunggu_review" },
    ],
    finalVideo: null,
    invoice: null,
  },
  {
    id: "ord-002",
    editorId: "ns",
    editorName: "Nadia Salsabila",
    editorInitials: "NS",
    editorGradient: "bg-[linear-gradient(135deg,#FF5C8A_0%,#7A2E4D_100%)]",
    packageId: "starter",
    packageName: "Starter",
    title: "Aesthetic Vlog Bali · 90 detik",
    brief: {
      judul: "Vlog Liburan Bali 3 Hari",
      deskripsi: "Cinematic vlog 3 hari di Bali, aesthetic & chill. Fokus pada transition smooth, color grade warm.",
      durasi: "90 detik",
      referensi: "",
      aset: "Footage mentah 15GB (GoPro + iPhone), playlist musik",
      catatan: "Butuh subtitle Indonesia-Inggris.",
    },
    status: "selesai",
    progress: 100,
    createdAt: "2026-11-10T14:00:00",
    deadline: "2026-11-12T14:00:00",
    escrowAmount: 157500,
    revisions: [
      { id: 1, version: "v1", submittedAt: "2026-11-11T18:00:00", feedback: "Kurangi saturation sedikit", status: "revisi" },
      { id: 2, version: "v2", submittedAt: "2026-11-12T10:00:00", feedback: "", status: "approved" },
    ],
    finalVideo: "https://example.com/final-video-002.mp4",
    invoice: "INV-202611-002",
  },
  {
    id: "ord-003",
    editorId: "da",
    editorName: "Dimas Aryo",
    editorInitials: "DA",
    editorGradient: "bg-[linear-gradient(135deg,#22D3EE_0%,#155E75_100%)]",
    packageId: "starter",
    packageName: "Starter",
    title: "Podcast Clip Ep.45 · 3 menit",
    brief: {
      judul: "Clip Podcast: Tips Produktivitas",
      deskripsi: "Potong 3 menit terbaik dari episode 45 jam 1 jam. Tambah subtitle, zoom punch-in, progress bar.",
      durasi: "3 menit",
      referensi: "",
      aset: "Video full episode (2GB), SRT subtitle",
      catatan: "",
    },
    status: "menunggu_brief",
    progress: 0,
    createdAt: "2026-11-20T09:00:00",
    deadline: "2026-11-22T09:00:00",
    escrowAmount: 68250,
    revisions: [],
    finalVideo: null,
    invoice: null,
  },
];

const initialBriefs = [
  {
    id: "brf-001",
    editorId: "rp",
    clientName: "Alya Putri",
    clientInitials: "AP",
    title: "Retention Reels · 60 detik",
    packageName: "Pro",
    packagePrice: 135000,
    brief: {
      judul: "Reels Promo Produk Baru - Minuman Sehat",
      deskripsi: "Promo minuman sehat baru, target Gen Z, vibe energetic & fresh. Referensi style: fast cuts, text overlay dynamic, upbeat music.",
      durasi: "45-60 detik",
      referensi: "https://tiktok.com/@example/video/123, https://reels.instagram.com/p/abc",
      aset: "Footage produk (5GB), logo AI, font Poppins, brand guideline PDF, musik library Epidemic Sound",
      catatan: "Deadline ketat: butuh draf H+1. Brand color wajib mengikuti guideline.",
    },
    status: "baru",
    receivedAt: "2026-11-18T10:12:00",
    deadline: "2026-11-19T16:00:00",
    isRepeatClient: true,
    clientProjects: 3,
  },
  {
    id: "brf-002",
    editorId: "rp",
    clientName: "Budi Santoso",
    clientInitials: "BS",
    title: "TikTok Series Produk · 3 video",
    packageName: "Bulk 5",
    packagePrice: 600000,
    brief: {
      judul: "Series 3 Video TikTok Skincare",
      deskripsi: "3 video edukasi skincare rutinitas pagi/siang/malam. Format talking head + B-roll.",
      durasi: "45 detik/video",
      referensi: "",
      aset: "Footage produk, talent sudah siap, studio lighting",
      catatan: "Shoot hari Sabtu, butuh edit cepat untuk posting Minggu.",
    },
    status: "baru",
    receivedAt: "2026-11-18T14:30:00",
    deadline: "2026-11-20T14:30:00",
    isRepeatClient: false,
    clientProjects: 0,
  },
  {
    id: "brf-003",
    editorId: "rp",
    clientName: "Citra Dewi",
    clientInitials: "CD",
    title: "YouTube Shorts Review Gadget",
    packageName: "Starter",
    packagePrice: 75000,
    brief: {
      judul: "Review Earbuds Budget Terbaik 2026",
      deskripsi: "Review singkat 5 earbuds budget <500rb. Fast pace, comparison table, verdict.",
      durasi: "60 detik",
      referensi: "https://youtube.com/shorts/xyz",
      aset: "Footage produk (dikirim client), script, voiceover",
      catatan: "Voiceover akan dikirim terpisah hari ini.",
    },
    status: "diterima",
    receivedAt: "2026-11-17T16:45:00",
    deadline: "2026-11-18T16:45:00",
    isRepeatClient: true,
    clientProjects: 2,
  },
];

export function AppProvider({ children }) {
  const [editors] = useState(initialEditors);
  const [orders, setOrders] = useState(initialOrders);
  const [briefs, setBriefs] = useState(initialBriefs);
  const [currentUser] = useState({ role: "client" }); // "client" | "editor"

  // Editor actions
  const getEditorById = useCallback((id) => editors.find((e) => e.id === id), [editors]);

  const getOrdersByClient = useCallback(() => orders, [orders]);

  const getOrdersByEditor = useCallback((editorId) => orders.filter((o) => o.editorId === editorId), [orders]);

  const getBriefsByEditor = useCallback((editorId) => briefs.filter((b) => b.editorId === editorId), [briefs]);

  const createOrder = useCallback((editorId, packageId, briefData) => {
    const editor = getEditorById(editorId);
    const pkg = editor.packages.find((p) => p.id === packageId);
    const platformFee = Math.round(pkg.price * 0.05);
    const escrowAmount = pkg.price + platformFee;

    const newOrder = {
      id: `ord-${Date.now()}`,
      editorId,
      editorName: editor.name,
      editorInitials: editor.initials,
      editorGradient: editor.gradient,
      packageId,
      packageName: pkg.name,
      title: briefData.judul || pkg.name,
      brief: briefData,
      status: "menunggu_brief",
      progress: 0,
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      escrowAmount,
      revisions: [],
      finalVideo: null,
      invoice: null,
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  }, [getEditorById]);

  const updateOrderStatus = useCallback((orderId, status, progress) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, progress: progress ?? o.progress } : o))
    );
  }, []);

  const addRevision = useCallback((orderId, revision) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, revisions: [...o.revisions, revision] } : o
      )
    );
  }, []);

  const approveRevision = useCallback((orderId, revisionId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              revisions: o.revisions.map((r) =>
                r.id === revisionId ? { ...r, status: "approved" } : r
              ),
              status: "selesai",
              progress: 100,
              finalVideo: "https://example.com/final-video.mp4",
              invoice: `INV-${Date.now()}`,
            }
          : o
      )
    );
  }, []);

  // Editor actions on briefs
  const acceptBrief = useCallback((briefId) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, status: "diterima" } : b))
    );
    // Create order from brief
    const brief = briefs.find((b) => b.id === briefId);
    if (brief) {
      createOrder(brief.editorId, brief.packageName.toLowerCase().includes("bulk") ? "bulk5" : brief.packageName.toLowerCase(), brief.brief);
    }
  }, [briefs, createOrder]);

  const rejectBrief = useCallback((briefId) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, status: "ditolak" } : b))
    );
  }, []);

  const submitDraft = useCallback((orderId, version) => {
    const revision = {
      id: Date.now(),
      version,
      submittedAt: new Date().toISOString(),
      feedback: "",
      status: "menunggu_review",
    };
    addRevision(orderId, revision);
    updateOrderStatus(orderId, "menunggu_review", 80);
  }, [addRevision, updateOrderStatus]);

  // Filter/sort helpers
  const filterEditors = useCallback((query, category) => {
    let filtered = editors;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category && category !== "Semua") {
      filtered = filtered.filter((e) => e.tags.includes(category));
    }
    return filtered;
  }, [editors]);

  const value = useMemo(
    () => ({
      editors,
      orders,
      briefs,
      currentUser,
      getEditorById,
      getOrdersByClient,
      getOrdersByEditor,
      getBriefsByEditor,
      createOrder,
      updateOrderStatus,
      addRevision,
      approveRevision,
      acceptBrief,
      rejectBrief,
      submitDraft,
      filterEditors,
    }),
    [
      editors,
      orders,
      briefs,
      currentUser,
      getEditorById,
      getOrdersByClient,
      getOrdersByEditor,
      getBriefsByEditor,
      createOrder,
      updateOrderStatus,
      addRevision,
      approveRevision,
      acceptBrief,
      rejectBrief,
      submitDraft,
      filterEditors,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}