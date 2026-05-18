"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Check } from "lucide-react";

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

type ModalMode = "tambah" | "edit" | null;

// ─── Reusable Form Modal ──────────────────────────────────────────────────────
function FormModal({
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  submitSuccess,
}: {
  mode: ModalMode;
  form: ModalForm;
  setForm: (f: ModalForm) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitSuccess: boolean;
}) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#FFE26F]/30">
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A]">
              {isEdit ? "Edit Data Anak" : "Tambah Anak Baru"}
            </h2>
            <p className="text-[11px] text-[#4A4A4A] mt-0.5">
              {isEdit ? "Perbarui informasi data anak" : "Isi data lengkap anak yang akan didaftarkan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F0EDE6] hover:bg-[#FFE26F]/40 flex items-center justify-center text-[#4A4A4A] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Success state */}
        {submitSuccess ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#C4E02F] rounded-full flex items-center justify-center">
              <Check size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">
              {isEdit ? "Data berhasil diperbarui!" : "Anak berhasil ditambahkan!"}
            </p>
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
              onClick={onSubmit}
              disabled={!form.name || !form.wali || !form.usia}
              className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all active:scale-95
                ${form.name && form.wali && form.usia
                  ? "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-lg shadow-[#1883FF]/20"
                  : "bg-[#F0EDE6] text-[#4A4A4A] cursor-not-allowed"}`}
            >
              {isEdit ? "Simpan Perubahan" : "Simpan Data Anak"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  child,
  onClose,
  onConfirm,
}: {
  child: Child;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => onConfirm(), 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {done ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#C4E02F] rounded-full flex items-center justify-center">
              <Check size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-[15px] font-bold text-[#1A1A1A]">Data berhasil dihapus!</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <Trash2 size={28} className="text-red-400" />
              </div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Hapus Data Anak?</h2>
              <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                Data <strong className="text-[#1A1A1A]">{child.name}</strong> akan dihapus secara permanen dan tidak bisa dikembalikan.
              </p>
            </div>

            {/* Child preview */}
            <div className="mx-6 mb-5 flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8F8] border border-red-100">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[11px] font-bold text-red-400 shrink-0">
                {child.avatar}
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1A1A1A]">{child.name}</p>
                <p className="text-[11px] text-[#4A4A4A]">{child.kelas} · Wali: {child.wali}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold border-2 border-[#F0EDE6] text-[#4A4A4A] hover:bg-[#F7F5F0] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-[13px] font-bold text-white transition-all
                  ${loading ? "bg-red-300 cursor-wait" : "bg-red-500 hover:bg-red-600 active:scale-95 shadow-lg shadow-red-500/20"}`}
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DataAnakPage() {
  const [children, setChildren]       = useState<Child[]>(initialChildren);
  const [search, setSearch]           = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");

  // Modal state
  const [modalMode, setModalMode]         = useState<ModalMode>(null);
  const [editingChild, setEditingChild]   = useState<Child | null>(null);
  const [deletingChild, setDeletingChild] = useState<Child | null>(null);
  const [form, setForm]                   = useState<ModalForm>(emptyForm);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filtered = children.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.wali.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === "Semua" || c.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  // ── Open tambah
  const openTambah = () => {
    setForm(emptyForm);
    setEditingChild(null);
    setModalMode("tambah");
    setSubmitSuccess(false);
  };

  // ── Open edit
  const openEdit = (child: Child) => {
    setForm({
      name:     child.name,
      kelas:    child.kelas,
      usia:     child.usia,
      wali:     child.wali,
      telepon:  child.telepon,
      program:  child.program,
    });
    setEditingChild(child);
    setModalMode("edit");
    setSubmitSuccess(false);
  };

  // ── Close modal form
  const closeModal = () => {
    setModalMode(null);
    setEditingChild(null);
    setSubmitSuccess(false);
  };

  // ── Submit tambah / edit
  const handleSubmit = () => {
    if (!form.name || !form.wali || !form.usia) return;

    const initials = form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    if (modalMode === "edit" && editingChild) {
      // Update existing
      setChildren((prev) =>
        prev.map((c) =>
          c.id === editingChild.id
            ? { ...c, ...form, avatar: initials, kelas: form.kelas as Child["kelas"] }
            : c
        )
      );
    } else {
      // Tambah baru
      const newChild: Child = {
        id: Date.now(),
        ...form,
        kelas:  form.kelas as Child["kelas"],
        avatar: initials,
      };
      setChildren((prev) => [newChild, ...prev]);
    }

    setSubmitSuccess(true);
    setTimeout(() => closeModal(), 1800);
  };

  // ── Confirm hapus
  const handleDelete = () => {
    if (!deletingChild) return;
    setChildren((prev) => prev.filter((c) => c.id !== deletingChild.id));
    setDeletingChild(null);
  };

  return (
    <div className="space-y-6">

      {/* ── Form Modal (tambah / edit) ── */}
      {modalMode && (
        <FormModal
          mode={modalMode}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitSuccess={submitSuccess}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingChild && (
        <DeleteModal
          child={deletingChild}
          onClose={() => setDeletingChild(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Data Anak</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Kelola data seluruh anak yang terdaftar di Tanika Daycare.</p>
        </div>
        <button
          onClick={openTambah}
          className="flex items-center gap-2 bg-[#1883FF] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#1570e0] active:scale-95 transition-all shadow-lg shadow-[#1883FF]/20"
        >
          <Plus size={15} strokeWidth={2.5} />
          Tambah Anak
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",      value: children.length,                                        bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]" },
          { label: "Program Bulanan", value: children.filter((c) => c.program === "Bulanan").length, bg: "bg-[#FFE26F]/30", border: "border-[#FFE26F]/50", text: "text-[#a07000]" },
          { label: "Program Harian",  value: children.filter((c) => c.program === "Harian").length,  bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A4A] mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.text} leading-none`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── FILTER + SEARCH ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A4A4A]" />
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

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-[#F0EDE6] text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          <div className="col-span-3">Nama</div>
          <div className="col-span-2">Kelas</div>
          <div className="col-span-1">Usia</div>
          <div className="col-span-2">Wali</div>
          <div className="col-span-2">Telepon</div>
          <div className="col-span-1 text-center">Program</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        <div className="divide-y divide-[#F7F5F0]">
          {filtered.map((child, i) => {
            const prog        = programColors[child.program];
            const avatarColor = avatarColors[i % avatarColors.length];

            return (
              <div
                key={child.id}
                className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 hover:bg-[#FFFDF7] transition-colors items-center gap-y-1 group"
              >
                {/* Nama */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${avatarColor}`}>
                    {child.avatar}
                  </div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{child.name}</p>
                </div>

                {/* Kelas */}
                <div className="hidden md:block col-span-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${kelasColors[child.kelas] ?? "bg-gray-100 text-gray-500"}`}>
                    {child.kelas}
                  </span>
                </div>

                {/* Usia */}
                <div className="hidden md:block col-span-1 text-[12px] text-[#4A4A4A] font-medium">{child.usia}</div>

                {/* Wali */}
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] font-medium truncate">{child.wali}</div>

                {/* Telepon */}
                <div className="hidden md:block col-span-2 text-[12px] text-[#4A4A4A] truncate">{child.telepon}</div>

                {/* Program */}
                <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${prog.bg} ${prog.text} ${prog.border}`}>
                    {child.program}
                  </span>
                </div>

                {/* ── AKSI ── */}
                <div className="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center gap-1.5">
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(child)}
                    title="Edit data anak"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4A4A] bg-[#F7F5F0] hover:bg-[#1883FF]/10 hover:text-[#1883FF] transition-all hover:scale-110 active:scale-95"
                  >
                    <Pencil size={13} />
                  </button>

                  {/* Hapus */}
                  <button
                    onClick={() => setDeletingChild(child)}
                    title="Hapus data anak"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4A4A] bg-[#F7F5F0] hover:bg-red-50 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={13} />
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