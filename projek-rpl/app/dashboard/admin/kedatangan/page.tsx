"use client";

import { useState } from "react";

type StatusKehadiran = "hadir" | "belum" | "izin";

type Anak = {
  id: number;
  nama: string;
  kelas: string;
  program: string;
  checkin: string | null;
  status: StatusKehadiran;
};

const initialData: Anak[] = [
  { id: 1, nama: "Almira Zahra",   kelas: "Rainbow Room", program: "Full Day",  checkin: "07.15", status: "hadir" },
  { id: 2, nama: "Bintang Putra",  kelas: "Rainbow Room", program: "Half Day",  checkin: "07.30", status: "hadir" },
  { id: 3, nama: "Citra Nadia",    kelas: "Sun Room",     program: "Full Day",  checkin: null,    status: "belum" },
  { id: 4, nama: "Dafa Ramadhan",  kelas: "Sun Room",     program: "Playgroup", checkin: "08.00", status: "hadir" },
  { id: 5, nama: "Elisa Putri",    kelas: "Moon Room",    program: "Full Day",  checkin: null,    status: "izin"  },
  { id: 6, nama: "Farhan Akbar",   kelas: "Moon Room",    program: "Half Day",  checkin: "07.45", status: "hadir" },
  { id: 7, nama: "Gita Lestari",   kelas: "Rainbow Room", program: "Full Day",  checkin: null,    status: "belum" },
  { id: 8, nama: "Hendra Wijaya",  kelas: "Sun Room",     program: "Playgroup", checkin: "08.10", status: "hadir" },
];

const statusConfig: Record<StatusKehadiran, { label: string; bg: string; text: string; border: string }> = {
  hadir: { label: "Hadir",  bg: "bg-[#C4E02F]/15", text: "text-[#5a7a00]", border: "border-[#C4E02F]/30" },
  belum: { label: "Belum",  bg: "bg-[#FEB700]/15", text: "text-[#a07000]", border: "border-[#FEB700]/30" },
  izin:  { label: "Izin",   bg: "bg-[#FFA9DD]/15", text: "text-[#a0306a]", border: "border-[#FFA9DD]/30" },
};

export default function KedatanganPage() {
  const [data, setData] = useState<Anak[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");

  const kelasList = ["Semua", ...Array.from(new Set(initialData.map((d) => d.kelas)))];

  const filtered = data.filter((d) => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === "Semua" || d.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const totalHadir = data.filter((d) => d.status === "hadir").length;
  const totalBelum = data.filter((d) => d.status === "belum").length;
  const totalIzin  = data.filter((d) => d.status === "izin").length;

  const toggleStatus = (id: number) => {
    setData((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (d.status === "belum") {
          const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ".");
          return { ...d, status: "hadir", checkin: now };
        }
        if (d.status === "hadir") return { ...d, status: "izin", checkin: null };
        return { ...d, status: "belum", checkin: null };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Kedatangan</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Catat dan pantau kehadiran anak hari ini.</p>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#4A4A4A]">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Hadir",  value: totalHadir, bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]"  },
          { label: "Belum",  value: totalBelum, bg: "bg-[#FEB700]/10", border: "border-[#FEB700]/20", text: "text-[#a07000]"  },
          { label: "Izin",   value: totalIzin,  bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#a0306a]"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-[11px] font-semibold text-[#4A4A4A] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anak..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#E8E4DB] rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {kelasList.map((k) => (
            <button
              key={k}
              onClick={() => setFilterKelas(k)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all
                ${filterKelas === k
                  ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                  : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#FFE26F]"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-4">Nama</div>
          <div className="col-span-2">Kelas</div>
          <div className="col-span-2">Program</div>
          <div className="col-span-2">Check-in</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {filtered.map((anak) => {
            const cfg = statusConfig[anak.status];
            return (
              <div key={anak.id} className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 hover:bg-[#FFFDF7] transition-colors items-center gap-y-1">
                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1883FF]/10 border border-[#1883FF]/20 flex items-center justify-center text-[10px] font-black text-[#1883FF] shrink-0">
                    {anak.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-[13px] font-bold text-[#1A1A1A] truncate">{anak.nama}</span>
                </div>
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium">{anak.kelas}</div>
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium">{anak.program}</div>
                <div className="hidden md:block col-span-2 text-[13px] font-bold text-[#1A1A1A]">
                  {anak.checkin ?? <span className="text-[#4A4A4A]/40">—</span>}
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center">
                  <button
                    onClick={() => toggleStatus(anak.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-80`}
                  >
                    {cfg.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[13px] text-[#4A4A4A] font-medium">
            Tidak ada data yang cocok.
          </div>
        )}
      </div>
    </div>
  );
}