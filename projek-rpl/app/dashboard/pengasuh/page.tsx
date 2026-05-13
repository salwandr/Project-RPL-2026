"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, LogIn, MessageSquare, TrendingUp,
  Utensils, Moon, Gamepad2, Sparkles, ChevronRight,
  Clock, CheckCircle2, AlertCircle, Users
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHILDREN = [
  { id: 1, name: "Andra Pratama", avatar: "AP", arrivalTime: "08:15", status: "Tidur",    statusColor: "#99ADFF", logDone: true  },
  { id: 2, name: "Lana Safira",   avatar: "LS", arrivalTime: "07:50", status: "Bermain",  statusColor: "#C4E02F", logDone: false },
  { id: 3, name: "Budi Wijaya",   avatar: "BW", arrivalTime: "08:30", status: "Makan",    statusColor: "#FFE26F", logDone: false },
  { id: 4, name: "Rina Putri",    avatar: "RP", arrivalTime: "07:45", status: "Belajar",  statusColor: "#1883FF", logDone: true  },
  { id: 5, name: "Dani Saputra",  avatar: "DS", arrivalTime: "08:05", status: "Bermain",  statusColor: "#C4E02F", logDone: false },
];

const QUICK_ACTIVITIES = [
  { label: "Makan",     icon: Utensils,  color: "#1883FF" },
  { label: "Tidur",     icon: Moon,      color: "#99ADFF" },
  { label: "Main",      icon: Gamepad2,  color: "#C4E02F" },
  { label: "Higienitas",icon: Sparkles,  color: "#FFA9DD" },
];

const TIMELINE = [
  { time: "07:00", label: "Pembukaan & Penyambutan", done: true  },
  { time: "07:30", label: "Sarapan Pagi",             done: true  },
  { time: "08:30", label: "Circle Time & Doa",        done: true  },
  { time: "09:00", label: "Kegiatan Belajar",         done: false },
  { time: "10:00", label: "Snack Time",               done: false },
  { time: "10:30", label: "Outdoor Play",             done: false },
  { time: "12:00", label: "Makan Siang",              done: false },
];

const NOTIFS = [
  { text: "Anak 2 (Lana) belum check-in hari ini",       color: "#FFA9DD", time: "08:30" },
  { text: "Pesan baru dari orang tua Budi Wijaya",        color: "#1883FF", time: "08:15" },
  { text: "Pengingat: 3 daily log belum diisi",           color: "#FFE26F", time: "07:00" },
];

// ─── Komponen ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub: string; color: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1A1A1A] leading-none mb-1">{value}</p>
      <p className="text-[11px] font-semibold text-[#1A1A1A]">{label}</p>
      <p className="text-[10px] text-[#4A4A4A] mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PengasuhDashboardPage() {
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [catatan, setCatatan] = useState("");
  const [logSent, setLogSent] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif">("aktif");

  const hadirCount  = CHILDREN.length;
  const logDone     = CHILDREN.filter((c) => c.logDone).length;
  const logBelum    = hadirCount - logDone;

  const handleKirimLog = () => {
    if (!selectedChild || !selectedActivity) return;
    setLogSent(true);
    setTimeout(() => {
      setLogSent(false);
      setSelectedChild(null);
      setSelectedActivity(null);
      setCatatan("");
    }, 1800);
  };

  return (
    <div className="space-y-5">

      {/* ── Row 1: Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Anak Hadir"  value={`${hadirCount}/24`} sub="3 lebih banyak dari kemarin" color="#1883FF" icon={Users}        />
        <StatCard label="Log Aktivitas"     value={logDone}            sub={`${logBelum} belum diisi`}   color="#C4E02F" icon={BookOpen}      />
        <StatCard label="Masuk/Keluar"      value="18"                 sub="6 belum check-in"            color="#FFE26F" icon={LogIn}         />
        <StatCard label="Pesan Masuk"       value="3"                  sub="2 belum dibalas"             color="#FFA9DD" icon={MessageSquare} />
      </div>

      {/* ── Row 2: List anak + Quick Log ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* List anak hadir */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-3">
              <p className="text-[13px] font-bold text-[#1A1A1A]">List Anak Hadir</p>
              <div className="flex gap-1">
                {(["semua","aktif"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all
                      ${filterStatus === f
                        ? "bg-[#1883FF] text-white"
                        : "bg-[#F4F6FA] text-[#4A4A4A] hover:bg-[#1883FF]/10"}`}
                  >
                    {f === "semua" ? "Hari Ini" : "Aktif"}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/pengasuh/kedatangan")}
              className="text-[11px] text-[#1883FF] font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={13} />
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#F4F6FA]">
            <p className="col-span-5 text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]">Nama Anak</p>
            <p className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]">Status</p>
            <p className="col-span-4 text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] text-right">Tombol Cepat</p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#F0F0F0]">
            {CHILDREN.map((child) => (
              <div key={child.id} className="grid grid-cols-12 gap-2 items-center px-5 py-3 hover:bg-[#F4F6FA] transition-colors">
                {/* Nama */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1883FF]/10 border-2 border-[#1883FF]/20 flex items-center justify-center text-[10px] font-bold text-[#1883FF] flex-shrink-0">
                    {child.avatar}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1A1A1A]">{child.name}</p>
                    <p className="text-[10px] text-[#4A4A4A] flex items-center gap-1">
                      <Clock size={9} /> Tiba pukul {child.arrivalTime}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-3">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${child.statusColor}25`, color: child.statusColor }}
                  >
                    {child.status}
                  </span>
                </div>

                {/* Quick action buttons */}
                <div className="col-span-4 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => { setSelectedChild(child.id); router.push("/dashboard/pengasuh/daily-log"); }}
                    className="w-8 h-8 rounded-lg bg-[#1883FF]/10 hover:bg-[#1883FF] text-[#1883FF] hover:text-white flex items-center justify-center transition-all hover:scale-105"
                    title="Log Aktivitas"
                  >
                    <BookOpen size={13} />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/pengasuh/kedatangan")}
                    className="w-8 h-8 rounded-lg bg-[#C4E02F]/20 hover:bg-[#C4E02F] text-[#C4E02F] hover:text-white flex items-center justify-center transition-all hover:scale-105"
                    title="Check-in/out"
                  >
                    <LogIn size={13} />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/pengasuh/pesan")}
                    className="w-8 h-8 rounded-lg bg-[#FFA9DD]/20 hover:bg-[#FFA9DD] text-[#FFA9DD] hover:text-[#1A1A1A] flex items-center justify-center transition-all hover:scale-105"
                    title="Kirim Pesan"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#F0F0F0] text-center">
            <button
              onClick={() => router.push("/dashboard/pengasuh/kedatangan")}
              className="text-[11px] text-[#1883FF] font-semibold hover:underline"
            >
              Lihat Semua {hadirCount} Anak Hadir →
            </button>
          </div>
        </div>

        {/* Quick Log + Tips */}
        <div className="flex flex-col gap-4">

          {/* Log Harian Cepat */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5 flex-1">
            <p className="text-[13px] font-bold text-[#1A1A1A] mb-4">Log Harian Cepat</p>

            {/* Pilih anak */}
            <div className="mb-3">
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Pilih Anak</p>
              <select
                value={selectedChild ?? ""}
                onChange={(e) => setSelectedChild(Number(e.target.value) || null)}
                className="w-full text-[12px] border border-[#F0F0F0] rounded-xl px-3 py-2.5 bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 focus:border-[#1883FF]/30 text-[#1A1A1A]"
              >
                <option value="">Pilih dari daftar...</option>
                {CHILDREN.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Jenis aktivitas */}
            <div className="mb-3">
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Jenis Aktivitas</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIVITIES.map(({ label, icon: Icon, color }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedActivity(label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold border-2 transition-all duration-150 hover:scale-[1.02]
                      ${selectedActivity === label
                        ? "text-white border-transparent shadow-md"
                        : "bg-[#F4F6FA] border-[#F0F0F0] text-[#4A4A4A] hover:border-opacity-50"}`}
                    style={selectedActivity === label ? { background: color, borderColor: color } : {}}
                  >
                    <Icon size={13} style={{ color: selectedActivity === label ? "white" : color }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Catatan (Opsional)</p>
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Bagaimana kondisi anak?..."
                className="w-full text-[11px] border border-[#F0F0F0] rounded-xl px-3 py-2.5 bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 placeholder:text-[#4A4A4A]/40 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleKirimLog}
              disabled={!selectedChild || !selectedActivity || logSent}
              className={`w-full py-3 rounded-xl text-[12px] font-bold transition-all duration-200 shadow-sm
                ${logSent
                  ? "bg-[#C4E02F] text-[#1A1A1A]"
                  : !selectedChild || !selectedActivity
                    ? "bg-[#F4F6FA] text-[#4A4A4A] cursor-not-allowed"
                    : "bg-[#1883FF] text-white hover:bg-[#1570e0] hover:shadow-md hover:scale-[1.01] active:scale-[0.99] shadow-[#1883FF]/20"}`}
            >
              {logSent ? "✓ Log Terkirim!" : "Kirim Log Harian"}
            </button>
          </div>

          {/* Tips Pengasuh */}
          <div className="bg-[#FEB700] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">Tips Pengasuh</p>
            </div>
            <p className="text-[11px] text-[#1A1A1A] leading-relaxed font-medium">
              Budi merespons dengan sangat baik musik klasik selama waktu tidur siang hari ini.
            </p>
            <div className="flex items-center justify-end gap-2 mt-3">
              <button className="text-[10px] font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nanti</button>
              <button className="text-[10px] font-bold bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#4A4A4A] transition-colors">Terima</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Timeline + Notifikasi ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Jadwal Hari Ini */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5">
          <p className="text-[13px] font-bold text-[#1A1A1A] mb-4">Jadwal Hari Ini</p>
          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <p className="text-[10px] font-bold text-[#4A4A4A] w-10 flex-shrink-0">{item.time}</p>
                <div className="flex items-center gap-2 flex-1">
                  {item.done
                    ? <CheckCircle2 size={15} className="text-[#C4E02F] flex-shrink-0" />
                    : <div className="w-[15px] h-[15px] rounded-full border-2 border-[#F0F0F0] flex-shrink-0" />}
                  <p className={`text-[12px] font-medium ${item.done ? "text-[#4A4A4A] line-through" : "text-[#1A1A1A]"}`}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifikasi */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold text-[#1A1A1A]">Notifikasi Terbaru</p>
            <button className="text-[10px] text-[#1883FF] font-semibold hover:underline">Tandai Semua</button>
          </div>
          <div className="space-y-3">
            {NOTIFS.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F6FA] hover:bg-[#F0F2F8] transition-colors">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: n.color }} />
                <div className="flex-1">
                  <p className="text-[11px] text-[#1A1A1A] font-medium leading-snug">{n.text}</p>
                  <p className="text-[10px] text-[#4A4A4A] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/dashboard/pengasuh/pesan")}
            className="w-full mt-4 py-2.5 rounded-xl text-[11px] font-bold text-[#1883FF] bg-[#1883FF]/10 hover:bg-[#1883FF]/20 transition-colors"
          >
            Lihat Semua Notifikasi →
          </button>
        </div>
      </div>
    </div>
  );
}