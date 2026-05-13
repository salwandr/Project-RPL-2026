"use client";

import { useRouter } from "next/navigation";

const stats = [
  { label: "Anak Hadir Hari Ini", value: "18", sub: "dari 24 terdaftar", color: "#C4E02F", bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20" },
  { label: "Menunggu Jemput",     value: "6",  sub: "perlu konfirmasi",  color: "#FEB700", bg: "bg-[#FEB700]/10", border: "border-[#FEB700]/20" },
  { label: "Total Terdaftar",     value: "24", sub: "anak aktif",        color: "#1883FF", bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20" },
  { label: "Verifikasi Pending",  value: "3",  sub: "pembayaran baru",   color: "#FFA9DD", bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20" },
];

const recentActivity = [
  { nama: "Almira Zahra",    aksi: "Sudah dijemput Ibu Rina",   jam: "15.32", status: "selesai" },
  { nama: "Bintang Putra",   aksi: "Check-in pagi",             jam: "07.12", status: "hadir"   },
  { nama: "Citra Nadia",     aksi: "Pembayaran diterima",       jam: "09.00", status: "bayar"   },
  { nama: "Dafa Ramadhan",   aksi: "Menunggu penjemputan",      jam: "15.00", status: "tunggu"  },
  { nama: "Elisa Putri",     aksi: "Data anak diperbarui",      jam: "10.20", status: "info"    },
];

const statusColor: Record<string, string> = {
  selesai: "#C4E02F",
  hadir:   "#1883FF",
  bayar:   "#99ADFF",
  tunggu:  "#FEB700",
  info:    "#FFA9DD",
};

const statusLabel: Record<string, string> = {
  selesai: "Selesai",
  hadir:   "Hadir",
  bayar:   "Pembayaran",
  tunggu:  "Menunggu",
  info:    "Info",
};

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Selamat datang kembali</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Berikut ringkasan aktivitas Tanika Daycare hari ini.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/admin/kedatangan")}
          className="shrink-0 bg-[#1A1A1A] text-[#FFE26F] px-5 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Catat Kedatangan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[11px] font-semibold text-[#4A4A4A] uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-3xl font-black text-[#1A1A1A] leading-none">{s.value}</p>
            <p className="text-[11px] text-[#4A4A4A] mt-1.5 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE6] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Aktivitas Terkini</h2>
            <span className="text-[11px] text-[#4A4A4A] font-medium">Hari ini</span>
          </div>
          <div className="divide-y divide-[#F7F5F0]">
            {recentActivity.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FFFDF7] transition-colors">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  style={{ background: statusColor[item.status] }}
                >
                  {item.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{item.nama}</p>
                  <p className="text-[11px] text-[#4A4A4A] truncate">{item.aksi}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-semibold text-[#1A1A1A]">{item.jam}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: statusColor[item.status] + "20", color: statusColor[item.status] }}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm p-5">
            <h2 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-4">Akses Cepat</h2>
            <div className="space-y-2">
              {[
                { label: "Verifikasi Pembayaran", href: "/dashboard/admin/pengguna",    color: "#FFA9DD", count: "3" },
                { label: "Data Anak Baru",        href: "/dashboard/admin/data-anak",   color: "#1883FF", count: "2" },
                { label: "Laporan Hari Ini",      href: "/dashboard/admin/laporan",     color: "#C4E02F", count: ""  },
                { label: "Penjemputan Aktif",     href: "/dashboard/admin/penjemputan", color: "#FEB700", count: "6" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FFFDF7] border border-transparent hover:border-[#FFE26F]/40 transition-all text-left"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="flex-1 text-[12px] font-semibold text-[#1A1A1A]">{item.label}</span>
                  {item.count && (
                    <span
                      className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ background: item.color }}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Kehadiran mini */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5">
            <p className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-3">Kehadiran</p>
            <div className="flex items-end gap-2 mb-3">
              <p className="text-4xl font-black text-white leading-none">75%</p>
              <p className="text-[11px] text-white/40 mb-1">hari ini</p>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#C4E02F] rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-[11px] text-white/30 mt-2">18 dari 24 anak hadir</p>
          </div>
        </div>
      </div>
    </div>
  );
}