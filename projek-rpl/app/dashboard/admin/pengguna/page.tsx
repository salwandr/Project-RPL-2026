"use client";

import { useState } from "react";

type Role = "Admin" | "Pengasuh" | "Orang Tua";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Aktif" | "Nonaktif";
  avatar: string;
  bergabung: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Admin Utama",   email: "admin@tanika.id",     role: "Admin",      status: "Aktif",    avatar: "AU", bergabung: "Jan 2025" },
  { id: 2, name: "Siti Pengasuh", email: "siti@tanika.id",      role: "Pengasuh",   status: "Aktif",    avatar: "SP", bergabung: "Feb 2025" },
  { id: 3, name: "Rina Pengasuh", email: "rina@tanika.id",      role: "Pengasuh",   status: "Aktif",    avatar: "RP", bergabung: "Mar 2025" },
  { id: 4, name: "Budi Wali",     email: "budi@mail.com",       role: "Orang Tua",  status: "Aktif",    avatar: "BW", bergabung: "Jan 2025" },
  { id: 5, name: "Rina Wali",     email: "rina.w@mail.com",     role: "Orang Tua",  status: "Aktif",    avatar: "RW", bergabung: "Feb 2025" },
  { id: 6, name: "Doni Wali",     email: "doni@mail.com",       role: "Orang Tua",  status: "Nonaktif", avatar: "DW", bergabung: "Apr 2025" },
  { id: 7, name: "Sari Wali",     email: "sari@mail.com",       role: "Orang Tua",  status: "Aktif",    avatar: "SW", bergabung: "Jan 2025" },
  { id: 8, name: "Hendra Wali",   email: "hendra@mail.com",     role: "Orang Tua",  status: "Aktif",    avatar: "HW", bergabung: "Mar 2025" },
];

const roleColors: Record<Role, string> = {
  Admin:      "bg-sage-green/20 text-sage-green",
  Pengasuh:   "bg-pastel-blue/30 text-blue-500",
  "Orang Tua":"bg-warm-beige text-stone-500",
};

const roleFilters: (Role | "Semua")[] = ["Semua", "Admin", "Pengasuh", "Orang Tua"];

export default function PenggunaPage() {
  const [users, setUsers]       = useState<User[]>(initialUsers);
  const [search, setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState<Role | "Semua">("Semua");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === "Semua" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "Aktif" ? "Nonaktif" : "Aktif" } : u)
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: users.length,                                        bg: "bg-sage-green/20",  text: "text-sage-green" },
          { label: "Admin",          value: users.filter((u) => u.role === "Admin").length,      bg: "bg-warm-beige",     text: "text-stone-500"  },
          { label: "Pengasuh",       value: users.filter((u) => u.role === "Pengasuh").length,   bg: "bg-pastel-blue/30", text: "text-blue-500"   },
          { label: "Orang Tua",      value: users.filter((u) => u.role === "Orang Tua").length,  bg: "bg-sage-green/10",  text: "text-sage-green" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-default`}>
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.text} leading-none`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-100">
          <p className="text-[12px] font-bold text-stone-700">Manajemen Pengguna</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {roleFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105
                    ${filterRole === r
                      ? "bg-sage-green text-white shadow-sm"
                      : "bg-warm-beige text-stone-500 hover:bg-sage-green/20"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Cari nama / email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[11px] border border-stone-200 rounded-xl px-4 py-2 w-44 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow"
            />
          </div>
        </div>

        <div className="p-4 space-y-2">
          {/* Column labels */}
          <div className="grid grid-cols-12 gap-3 px-4 pb-1">
            {["Pengguna", "Email", "Role", "Bergabung", "Status", "Aksi"].map((h) => (
              <p key={h} className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-400 col-span-2">{h}</p>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-stone-400 py-10">Tidak ada pengguna.</p>
          ) : (
            filtered.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-3 items-center px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 border border-stone-100"
              >
                {/* Pengguna */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-500 flex-shrink-0">
                    {user.avatar}
                  </div>
                  <p className="text-[11px] font-semibold text-stone-700 truncate">{user.name}</p>
                </div>
                {/* Email */}
                <p className="col-span-2 text-[10px] text-stone-400 truncate">{user.email}</p>
                {/* Role */}
                <div className="col-span-2">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                {/* Bergabung */}
                <p className="col-span-2 text-[10px] text-stone-400">{user.bergabung}</p>
                {/* Status */}
                <div className="col-span-2">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full
                    ${user.status === "Aktif"
                      ? "bg-sage-green/20 text-sage-green"
                      : "bg-stone-100 text-stone-400"}`}>
                    {user.status}
                  </span>
                </div>
                {/* Aksi */}
                <div className="col-span-2">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all duration-150 hover:scale-105
                      ${user.status === "Aktif"
                        ? "border-red-200 text-red-400 hover:bg-red-50"
                        : "border-sage-green/50 text-sage-green hover:bg-sage-green/10"}`}
                  >
                    {user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}