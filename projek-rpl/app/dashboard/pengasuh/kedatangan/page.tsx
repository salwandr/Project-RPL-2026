"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle2, Car } from "lucide-react";

type PickupStatus = "menunggu" | "dijemput";

interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  jamMasuk: string;
  penjemput: string;
  status: PickupStatus;
  jamJemput: string | null;
}

const initialChildren: Child[] = [
  { id: 1, name: "Andra Pratama", kelas: "Rainbow Room",   avatar: "AP", jamMasuk: "07:10", penjemput: "Ayah",  status: "dijemput", jamJemput: "15:30" },
  { id: 2, name: "Lana Safira",   kelas: "Sunshine Class", avatar: "LS", jamMasuk: "07:25", penjemput: "Ibu",   status: "dijemput", jamJemput: "15:45" },
  { id: 3, name: "Budi Wijaya",   kelas: "Rainbow Room",   avatar: "BW", jamMasuk: "07:30", penjemput: "Ayah",  status: "menunggu", jamJemput: null    },
  { id: 4, name: "Rina Putri",    kelas: "Star Class",     avatar: "RP", jamMasuk: "07:15", penjemput: "Ibu",   status: "menunggu", jamJemput: null    },
  { id: 5, name: "Dani Saputra",  kelas: "Sunshine Class", avatar: "DS", jamMasuk: "07:40", penjemput: "Nenek", status: "dijemput", jamJemput: "16:00" },
  { id: 6, name: "Maya Sari",     kelas: "Rainbow Room",   avatar: "MS", jamMasuk: "07:20", penjemput: "Ayah",  status: "menunggu", jamJemput: null    },
  { id: 7, name: "Citra Dewi",    kelas: "Sunshine Class", avatar: "CD", jamMasuk: "07:22", penjemput: "Kakek", status: "menunggu", jamJemput: null    },
];

export default function PengasuhPenjemputanPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [search, setSearch]     = useState("");

  const dijemput = children.filter((c) => c.status === "dijemput").length;
  const menunggu = children.filter((c) => c.status === "menunggu").length;
  const total    = children.length;

  const filtered = children.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.penjemput.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = (id: number) => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setChildren((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: "dijemput" as PickupStatus, jamJemput: now } : c)
    );
  };

  return (
    <div className="space-y-5">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Hadir",     value: total,    bg: "#1883FF", sub: "Anak hari ini"              },
          { label: "Sudah Dijemput",  value: dijemput, bg: "#C4E02F", sub: `${Math.round((dijemput/total)*100)}% dari total` },
          { label: "Menunggu Jemput", value: menunggu, bg: "#FFE26F", sub: "Masih di daycare"           },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
            <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.bg}20` }}>
              <Car size={15} style={{ color: s.bg }} />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A] leading-none mb-1">{s.value}</p>
            <p className="text-[11px] font-semibold text-[#1A1A1A]">{s.label}</p>
            <p className="text-[10px] text-[#4A4A4A]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-[#1A1A1A]">Progress Penjemputan</p>
          <span className="text-[12px] font-bold text-[#1883FF]">{dijemput}/{total}</span>
        </div>
        <div className="w-full h-2.5 bg-[#F4F6FA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(dijemput/total)*100}%`, background: "#1883FF" }}
          />
        </div>
        <p className="text-[10px] text-[#4A4A4A] mt-2">{menunggu} anak masih menunggu jemputan</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <p className="text-[13px] font-bold text-[#1A1A1A]">Daftar Penjemputan</p>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
            <input
              type="text"
              placeholder="Cari nama / penjemput..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-[11px] border border-[#F0F0F0] rounded-xl bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 w-44 placeholder:text-[#4A4A4A]/40"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#F4F6FA] border-b border-[#F0F0F0]">
          {["Anak", "Kelas", "Jam Masuk", "Penjemput", "Status", "Aksi"].map((h) => (
            <p key={h} className="col-span-2 text-[9px] font-bold uppercase tracking-wider text-[#4A4A4A]">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#F0F0F0]">
          {filtered.map((child) => (
            <div key={child.id} className="grid grid-cols-12 gap-2 items-center px-5 py-3 hover:bg-[#F4F6FA] transition-colors">
              {/* Anak */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1883FF]/10 flex items-center justify-center text-[9px] font-bold text-[#1883FF] flex-shrink-0">
                  {child.avatar}
                </div>
                <p className="text-[11px] font-semibold text-[#1A1A1A] truncate">{child.name}</p>
              </div>
              {/* Kelas */}
              <p className="col-span-2 text-[11px] text-[#4A4A4A] truncate">{child.kelas}</p>
              {/* Jam masuk */}
              <p className="col-span-2 text-[11px] font-semibold text-[#1A1A1A]">{child.jamMasuk}</p>
              {/* Penjemput */}
              <p className="col-span-2 text-[11px] text-[#4A4A4A]">{child.penjemput}</p>
              {/* Status */}
              <div className="col-span-2">
                {child.status === "dijemput" ? (
                  <div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                      style={{ background: "#C4E02F25", color: "#5a8a00" }}>
                      <CheckCircle2 size={10} /> Dijemput
                    </span>
                    {child.jamJemput && (
                      <p className="text-[9px] text-[#4A4A4A] mt-0.5 pl-1">{child.jamJemput}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                    style={{ background: "#FFE26F25", color: "#a07000" }}>
                    <Clock size={10} /> Menunggu
                  </span>
                )}
              </div>
              {/* Aksi */}
              <div className="col-span-2">
                {child.status === "menunggu" ? (
                  <button
                    onClick={() => handleCheckout(child.id)}
                    className="text-[10px] font-bold bg-[#1883FF] text-white px-2.5 py-1.5 rounded-lg hover:bg-[#1570e0] hover:scale-105 transition-all shadow-sm"
                  >
                    Check-out
                  </button>
                ) : (
                  <span className="text-[10px] text-[#C4E02F] font-semibold">✓ Selesai</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}