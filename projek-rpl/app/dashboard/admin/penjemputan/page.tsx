"use client";

import { useState } from "react";

type PickupStatus = "menunggu" | "dijemput";

interface Child {
  id: number;
  name: string;
  kelas: string;
  jamMasuk: string;
  penjemput: string;
  status: PickupStatus;
  avatar: string;
}

const initialChildren: Child[] = [
  { id: 1, name: "Almira Zahra",  kelas: "Rainbow Room",   jamMasuk: "07:10", penjemput: "Ayah",  status: "dijemput", avatar: "AZ" },
  { id: 2, name: "Bintang Putra", kelas: "Rainbow Room",   jamMasuk: "07:25", penjemput: "Ibu",   status: "dijemput", avatar: "BP" },
  { id: 3, name: "Citra Nadia",   kelas: "Sun Room",       jamMasuk: "07:30", penjemput: "Ayah",  status: "menunggu", avatar: "CN" },
  { id: 4, name: "Dafa Ramadhan", kelas: "Sun Room",       jamMasuk: "07:15", penjemput: "Ibu",   status: "menunggu", avatar: "DR" },
  { id: 5, name: "Elisa Putri",   kelas: "Moon Room",      jamMasuk: "07:40", penjemput: "Nenek", status: "dijemput", avatar: "EP" },
  { id: 6, name: "Farhan Akbar",  kelas: "Moon Room",      jamMasuk: "07:20", penjemput: "Ayah",  status: "menunggu", avatar: "FA" },
  { id: 7, name: "Gita Lestari",  kelas: "Rainbow Room",   jamMasuk: "07:35", penjemput: "Ibu",   status: "menunggu", avatar: "GL" },
  { id: 8, name: "Hendra Wijaya", kelas: "Sun Room",       jamMasuk: "07:22", penjemput: "Kakek", status: "dijemput", avatar: "HW" },
];

export default function PenjemputanPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"semua" | "menunggu" | "dijemput">("semua");

  const dijemput = children.filter((c) => c.status === "dijemput").length;
  const menunggu = children.filter((c) => c.status === "menunggu").length;
  const total = children.length;
  const pct = Math.round((dijemput / total) * 100);

  const filtered = children.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.kelas.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "semua" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCheckout = (id: number) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "dijemput" as PickupStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Penjemputan</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Pantau dan konfirmasi penjemputan anak hari ini.</p>
        </div>
        <div className="text-[12px] font-semibold text-[#4A4A4A]">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Hadir",     value: total,    sub: "Anak hari ini",      bg: "bg-[#1883FF]/10",  border: "border-[#1883FF]/20",  text: "text-[#1883FF]"  },
          { label: "Sudah Dijemput",  value: dijemput, sub: `${pct}% dari total`, bg: "bg-[#C4E02F]/10",  border: "border-[#C4E02F]/20",  text: "text-[#5a7a00]"  },
          { label: "Menunggu Jemput", value: menunggu, sub: "Masih di daycare",   bg: "bg-[#FEB700]/10",  border: "border-[#FEB700]/20",  text: "text-[#a07000]"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A4A] mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.text} leading-none mb-1`}>{s.value}</p>
            <p className="text-[11px] text-[#4A4A4A] font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/40 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-bold text-[#1A1A1A]">Progress Penjemputan</p>
            <p className="text-[11px] text-[#4A4A4A] mt-0.5">{menunggu} anak masih menunggu jemputan</p>
          </div>
          <span className="text-2xl font-black text-[#1A1A1A]">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-[#F0EDE6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C4E02F] rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#4A4A4A]">0</span>
          <span className="text-[10px] text-[#4A4A4A]">{total} anak</span>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / kelas..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#FFE26F]/60 rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
          />
        </div>
        <div className="flex gap-2">
          {(["semua", "menunggu", "dijemput"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all capitalize
                ${filter === f
                  ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                  : "bg-white text-[#4A4A4A] border-[#FFE26F]/60 hover:border-[#FFE26F]"}`}
            >
              {f === "semua" ? "Semua" : f === "menunggu" ? "Menunggu" : "Dijemput"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-4">Nama</div>
          <div className="col-span-2">Kelas</div>
          <div className="col-span-2">Jam Masuk</div>
          <div className="col-span-2">Penjemput</div>
          <div className="col-span-2 text-center">Aksi</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {filtered.map((child) => (
            <div
              key={child.id}
              className={`grid grid-cols-2 md:grid-cols-12 px-6 py-4 items-center gap-y-1 transition-colors
                ${child.status === "dijemput" ? "bg-[#F9FFF0]" : "hover:bg-[#FFFDF7]"}`}
            >
              <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0
                  ${child.status === "dijemput"
                    ? "bg-[#C4E02F]/20 text-[#5a7a00]"
                    : "bg-[#1883FF]/10 text-[#1883FF]"}`}>
                  {child.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">{child.name}</p>
                  <p className="text-[11px] text-[#4A4A4A] md:hidden">{child.kelas}</p>
                </div>
              </div>
              <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium">{child.kelas}</div>
              <div className="hidden md:block col-span-2 text-[13px] font-bold text-[#1A1A1A]">{child.jamMasuk}</div>
              <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium">{child.penjemput}</div>
              <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center">
                {child.status === "dijemput" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#C4E02F]/20 text-[#5a7a00] border border-[#C4E02F]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Dijemput
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckout(child.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#1883FF] text-white hover:bg-[#1570e0] active:scale-95 transition-all shadow-sm shadow-[#1883FF]/20"
                  >
                    Check-out
                  </button>
                )}
              </div>
            </div>
          ))}
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