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
  { id: 1, name: "Anak 1", kelas: "Rainbow Room",   jamMasuk: "07:10", penjemput: "Ayah",    status: "dijemput",  avatar: "A1" },
  { id: 2, name: "Anak 2", kelas: "Sunshine Class", jamMasuk: "07:25", penjemput: "Ibu",     status: "dijemput",  avatar: "A2" },
  { id: 3, name: "Anak 3", kelas: "Rainbow Room",   jamMasuk: "07:30", penjemput: "Ayah",    status: "menunggu",  avatar: "A3" },
  { id: 4, name: "Anak 4", kelas: "Star Class",     jamMasuk: "07:15", penjemput: "Ibu",     status: "menunggu",  avatar: "A4" },
  { id: 5, name: "Anak 5", kelas: "Sunshine Class", jamMasuk: "07:40", penjemput: "Nenek",   status: "dijemput",  avatar: "A5" },
  { id: 6, name: "Anak 6", kelas: "Rainbow Room",   jamMasuk: "07:20", penjemput: "Ayah",    status: "menunggu",  avatar: "A6" },
  { id: 7, name: "Anak 7", kelas: "Star Class",     jamMasuk: "07:35", penjemput: "Ibu",     status: "menunggu",  avatar: "A7" },
  { id: 8, name: "Anak 8", kelas: "Sunshine Class", jamMasuk: "07:22", penjemput: "Kakek",   status: "dijemput",  avatar: "A8" },
];

export default function PenjemputanPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [search, setSearch] = useState("");

  const dijemput  = children.filter((c) => c.status === "dijemput").length;
  const menunggu  = children.filter((c) => c.status === "menunggu").length;
  const total     = children.length;

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = (id: number) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "dijemput" as PickupStatus } : c))
    );
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Hadir",     value: total,    bg: "bg-sage-green/20",  text: "text-sage-green", sub: "Anak hari ini" },
          { label: "Sudah Dijemput",  value: dijemput, bg: "bg-pastel-blue/30", text: "text-blue-500",   sub: `${Math.round((dijemput/total)*100)}% dari total` },
          { label: "Menunggu Jemput", value: menunggu, bg: "bg-warm-beige",     text: "text-stone-500",  sub: "Masih di daycare" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.text} leading-none mb-1`}>{s.value}</p>
            <p className="text-[10px] text-stone-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold text-stone-700">Progress Penjemputan Hari Ini</p>
          <span className="text-[12px] font-bold text-blue-400">{dijemput}/{total}</span>
        </div>
        <div className="w-full h-3 bg-warm-beige rounded-full overflow-hidden">
          <div
            className="h-full bg-pastel-blue rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(dijemput / total) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-stone-400 mt-2">{menunggu} anak masih menunggu jemputan</p>
      </div>

      {/* Child list */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="text-[12px] font-bold text-stone-700">Daftar Penjemputan</p>
          <input
            type="text"
            placeholder="Cari nama anak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[11px] border border-stone-200 rounded-xl px-4 py-2 w-48 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow"
          />
        </div>

        <div className="p-4 space-y-2">
          {filtered.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 border border-stone-100"
            >
              <div className="w-10 h-10 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500 flex-shrink-0 shadow-sm">
                {child.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-stone-700 truncate">{child.name}</p>
                <p className="text-[10px] text-stone-400 truncate">{child.kelas}</p>
              </div>
              <div className="text-[10px] text-stone-400 hidden sm:block text-right">
                <p>Masuk <span className="font-medium text-stone-600">{child.jamMasuk}</span></p>
                <p>Dijemput <span className="font-medium text-stone-600">{child.penjemput}</span></p>
              </div>
              {child.status === "dijemput" ? (
                <span className="text-[10px] font-bold text-white bg-pastel-blue px-3 py-1.5 rounded-full shadow-sm text-blue-800">
                  Dijemput ✓
                </span>
              ) : (
                <button
                  onClick={() => handleCheckout(child.id)}
                  className="text-[10px] font-bold text-white bg-pastel-blue px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 text-blue-800"
                >
                  Check-out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}