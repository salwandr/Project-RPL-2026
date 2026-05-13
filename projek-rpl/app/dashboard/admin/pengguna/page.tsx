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
  { id: 1, name: "Admin Utama",   email: "admin@tanika.id",    role: "Admin",     status: "Aktif",    avatar: "AU", bergabung: "Jan 2025" },
  { id: 2, name: "Siti Pengasuh", email: "siti@tanika.id",     role: "Pengasuh",  status: "Aktif",    avatar: "SP", bergabung: "Feb 2025" },
  { id: 3, name: "Rina Pengasuh", email: "rina@tanika.id",     role: "Pengasuh",  status: "Aktif",    avatar: "RP", bergabung: "Mar 2025" },
  { id: 4, name: "Budi Wali",     email: "budi@mail.com",      role: "Orang Tua", status: "Aktif",    avatar: "BW", bergabung: "Jan 2025" },
  { id: 5, name: "Rina Wali",     email: "rina.w@mail.com",    role: "Orang Tua", status: "Aktif",    avatar: "RW", bergabung: "Feb 2025" },
  { id: 6, name: "Doni Wali",     email: "doni@mail.com",      role: "Orang Tua", status: "Nonaktif", avatar: "DW", bergabung: "Apr 2025" },
  { id: 7, name: "Sari Wali",     email: "sari@mail.com",      role: "Orang Tua", status: "Aktif",    avatar: "SW", bergabung: "Jan 2025" },
  { id: 8, name: "Hendra Wali",   email: "hendra@mail.com",    role: "Orang Tua", status: "Aktif",    avatar: "HW", bergabung: "Mar 2025" },
];

const roleConfig: Record<Role, { bg: string; text: string; border: string }> = {
  "Admin":     { bg: "bg-[#1883FF]/10", text: "text-[#1883FF]",  border: "border-[#1883FF]/20" },
  "Pengasuh":  { bg: "bg-[#99ADFF]/15", text: "text-[#3a4aaa]",  border: "border-[#99ADFF]/30" },
  "Orang Tua": { bg: "bg-[#FFE26F]/30", text: "text-[#a07000]",  border: "border-[#FFE26F]/50" },
};

const avatarBg: Record<Role, string> = {
  "Admin":     "bg-[#1883FF]/15 text-[#1883FF]",
  "Pengasuh":  "bg-[#99ADFF]/20 text-[#3a4aaa]",
  "Orang Tua": "bg-[#FFA9DD]/15 text-[#a0306a]",
};

const roleFilters: (Role | "Semua")[] = ["Semua", "Admin", "Pengasuh", "Orang Tua"];

export default function PenggunaPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "Semua">("Semua");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "Semua" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Aktif" ? "Nonaktif" : "Aktif" } : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Pengguna</h1>
        <p className="text-[13px] text-[#4A4A4A] mt-1">Kelola akun admin, pengasuh, dan orang tua.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: users.length,                                        bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]"  },
          { label: "Admin",          value: users.filter((u) => u.role === "Admin").length,      bg: "bg-[#FFE26F]/30", border: "border-[#FFE26F]/50", text: "text-[#a07000]"  },
          { label: "Pengasuh",       value: users.filter((u) => u.role === "Pengasuh").length,   bg: "bg-[#99ADFF]/15", border: "border-[#99ADFF]/30", text: "text-[#3a4aaa]"  },
          { label: "Orang Tua",      value: users.filter((u) => u.role === "Orang Tua").length,  bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#a0306a]"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A4A] mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.text} leading-none`}>{s.value}</p>
          </div>
        ))}
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
            placeholder="Cari nama / email..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#FFE26F]/60 rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all
                ${filterRole === r
                  ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                  : "bg-white text-[#4A4A4A] border-[#FFE26F]/60 hover:border-[#FFE26F]"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-3">Pengguna</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Bergabung</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {filtered.map((user) => {
            const role = roleConfig[user.role];
            const avBg = avatarBg[user.role];
            return (
              <div
                key={user.id}
                className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 items-center hover:bg-[#FFFDF7] transition-colors gap-y-1"
              >
                {/* Pengguna */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${avBg}`}>
                    {user.avatar}
                  </div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{user.name}</p>
                </div>
                {/* Email */}
                <div className="hidden md:block col-span-3 text-[11px] text-[#4A4A4A] truncate">{user.email}</div>
                {/* Role */}
                <div className="hidden md:block col-span-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${role.bg} ${role.text} ${role.border}`}>
                    {user.role}
                  </span>
                </div>
                {/* Bergabung */}
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium">{user.bergabung}</div>
                {/* Status */}
                <div className="hidden md:block col-span-1 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${user.status === "Aktif" ? "bg-[#C4E02F]" : "bg-[#4A4A4A]/30"}`} />
                </div>
                {/* Aksi */}
                <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all
                      ${user.status === "Aktif"
                        ? "border-red-200 text-red-400 hover:bg-red-50"
                        : "border-[#C4E02F]/40 text-[#5a7a00] hover:bg-[#C4E02F]/10"}`}
                  >
                    {user.status === "Aktif" ? "Nonaktif" : "Aktifkan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[13px] text-[#4A4A4A] font-medium">
            Tidak ada pengguna yang cocok.
          </div>
        )}
      </div>
    </div>
  );
}