"use client";

import { useState } from "react";

interface Child {
  id: number;
  name: string;
  kelas: string;
  usia: string;
  wali: string;
  telepon: string;
  avatar: string;
  program: "Harian" | "Bulanan";
}

const kelasList = ["Semua", "Rainbow Room", "Sunshine Class", "Star Class"];

const initialChildren: Child[] = [
  { id: 1, name: "Almira Zahra",   kelas: "Rainbow Room",   usia: "3 th", wali: "Budi S.",    telepon: "0812-xxxx-0001", avatar: "AZ", program: "Bulanan" },
  { id: 2, name: "Bintang Putra",  kelas: "Sunshine Class", usia: "4 th", wali: "Rina W.",    telepon: "0812-xxxx-0002", avatar: "BP", program: "Harian"  },
  { id: 3, name: "Citra Nadia",    kelas: "Rainbow Room",   usia: "3 th", wali: "Doni P.",    telepon: "0812-xxxx-0003", avatar: "CN", program: "Bulanan" },
  { id: 4, name: "Dafa Ramadhan",  kelas: "Star Class",     usia: "5 th", wali: "Sari L.",    telepon: "0812-xxxx-0004", avatar: "DR", program: "Bulanan" },
  { id: 5, name: "Elisa Putri",    kelas: "Sunshine Class", usia: "4 th", wali: "Hendra K.",  telepon: "0812-xxxx-0005", avatar: "EP", program: "Harian"  },
  { id: 6, name: "Farhan Akbar",   kelas: "Rainbow Room",   usia: "3 th", wali: "Dewi M.",    telepon: "0812-xxxx-0006", avatar: "FA", program: "Bulanan" },
  { id: 7, name: "Gita Lestari",   kelas: "Star Class",     usia: "5 th", wali: "Agus R.",    telepon: "0812-xxxx-0007", avatar: "GL", program: "Harian"  },
  { id: 8, name: "Hendra Wijaya",  kelas: "Sunshine Class", usia: "4 th", wali: "Lestari N.", telepon: "0812-xxxx-0008", avatar: "HW", program: "Bulanan" },
];

const programColors = {
  Bulanan: { bg: "bg-[#1883FF]/10", text: "text-[#1883FF]", border: "border-[#1883FF]/20" },
  Harian:  { bg: "bg-[#C4E02F]/10", text: "text-[#5a7a00]", border: "border-[#C4E02F]/20" },
};

const kelasColors: Record<string, string> = {
  "Rainbow Room":   "bg-[#FFA9DD]/10 text-[#a0306a]",
  "Sunshine Class": "bg-[#FEB700]/10 text-[#a07000]",
  "Star Class":     "bg-[#99ADFF]/20 text-[#3a4aaa]",
};

const avatarColors = [
  "bg-[#1883FF]/15 text-[#1883FF]",
  "bg-[#FFA9DD]/20 text-[#a0306a]",
  "bg-[#C4E02F]/15 text-[#5a7a00]",
  "bg-[#FEB700]/15 text-[#a07000]",
  "bg-[#99ADFF]/20 text-[#3a4aaa]",
];

type ModalForm = {
  name: string;
  kelas: string;
  usia: string;
  wali: string;
  telepon: string;
  program: "Harian" | "Bulanan";
};

const emptyForm: ModalForm = {
  name: "", kelas: "Rainbow Room", usia: "", wali: "", telepon: "", program: "Bulanan",
};

export default function DataAnakPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ModalForm>(emptyForm);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filtered = children.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.wali.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === "Semua" || c.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const handleSubmit = () => {
    if (!form.name || !form.wali || !form.usia) return;
    const initials = form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const newChild: Child = {
      id: children.length + 1,
      name: form.name,
      kelas: form.kelas as Child["kelas"],
      usia: form.usia,
      wali: form.wali,
      telepon: form.telepon,
      avatar: initials,
      program: form.program,
    };
    setChildren((prev) => [newChild, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowModal(false);
      setForm(emptyForm);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Data Anak</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Kelola data seluruh anak yang terdaftar di Tanika Daycare.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1883FF] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#1570e0] active:scale-95 transition-all shadow-lg shadow-[#1883FF]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Anak
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",      value: children.length,                                        bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]"  },
          { label: "Program Bulanan", value: children.filter((c) => c.program === "Bulanan").length, bg: "bg-[#FFE26F]/30", border: "border-[#FFE26F]/50", text: "text-[#a07000]"  },
          { label: "Program Harian",  value: children.filter((c) => c.program === "Harian").length,  bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]"  },
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
            placeholder="Cari nama / wali..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#FFE26F]/60 rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
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
                  : "bg-white text-[#4A4A4A] border-[#FFE26F]/60 hover:border-[#FFE26F]"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-3">Nama</div>
          <div className="col-span-2">Kelas</div>
          <div className="col-span-1">Usia</div>
          <div className="col-span-2">Wali</div>
          <div className="col-span-2">Telepon</div>
          <div className="col-span-2 text-center">Program</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {filtered.map((child, i) => {
            const prog = programColors[child.program];
            const avatarColor = avatarColors[i % avatarColors.length];
            return (
              <div
                key={child.id}
                className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 hover:bg-[#FFFDF7] transition-colors items-center gap-y-1"
              >
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${avatarColor}`}>
                    {child.avatar}
                  </div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{child.name}</p>
                </div>
                <div className="hidden md:block col-span-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${kelasColors[child.kelas] ?? "bg-gray-100 text-gray-500"}`}>
                    {child.kelas}
                  </span>
                </div>
                <div className="hidden md:block col-span-1 text-[12px] text-[#4A4A4A] font-medium">{child.usia}</div>
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium truncate">{child.wali}</div>
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] truncate">{child.telepon}</div>
                <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${prog.bg} ${prog.text} ${prog.border}`}>
                    {child.program}
                  </span>
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

      {/* Modal Tambah Anak */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#FFE26F]/30">
              <div>
                <h2 className="text-[16px] font-bold text-[#1A1A1A]">Tambah Anak Baru</h2>
                <p className="text-[11px] text-[#4A4A4A] mt-0.5">Isi data lengkap anak yang akan didaftarkan</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-[#F0EDE6] hover:bg-[#FFE26F]/40 flex items-center justify-center text-[#4A4A4A] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {submitSuccess ? (
              <div className="px-6 py-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-[#C4E02F] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[15px] font-bold text-[#1A1A1A]">Anak berhasil ditambahkan!</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Nama anak */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Nama Lengkap Anak</label>
                  <input
                    type="text"
                    placeholder="Contoh: Almira Zahra"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] border-2 border-[#FFE26F] rounded-xl focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
                  />
                </div>

                {/* Kelas + Usia */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Kelas</label>
                    <select
                      value={form.kelas}
                      onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                      className="w-full px-4 py-3 text-[13px] border-2 border-[#FFE26F] rounded-xl focus:outline-none focus:border-[#1883FF] transition-colors font-medium bg-white"
                    >
                      {kelasList.filter((k) => k !== "Semua").map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Usia</label>
                    <input
                      type="text"
                      placeholder="Contoh: 3 th"
                      value={form.usia}
                      onChange={(e) => setForm({ ...form, usia: e.target.value })}
                      className="w-full px-4 py-3 text-[13px] border-2 border-[#FFE26F] rounded-xl focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
                    />
                  </div>
                </div>

                {/* Nama wali */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Nama Wali</label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={form.wali}
                    onChange={(e) => setForm({ ...form, wali: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] border-2 border-[#FFE26F] rounded-xl focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
                  />
                </div>

                {/* Telepon */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={form.telepon}
                    onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] border-2 border-[#FFE26F] rounded-xl focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
                  />
                </div>

                {/* Program */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1A1A1A] mb-1.5">Program</label>
                  <div className="flex gap-2">
                    {(["Bulanan", "Harian"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, program: p })}
                        className={`flex-1 py-3 rounded-xl text-[13px] font-bold border-2 transition-all
                          ${form.program === p
                            ? "bg-[#1883FF] border-[#1883FF] text-white"
                            : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.wali || !form.usia}
                  className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all active:scale-95
                    ${form.name && form.wali && form.usia
                      ? "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-lg shadow-[#1883FF]/20"
                      : "bg-[#F0EDE6] text-[#4A4A4A] cursor-not-allowed"}`}
                >
                  Simpan Data Anak
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}