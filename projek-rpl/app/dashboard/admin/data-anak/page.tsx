"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Check } from "lucide-react";
import {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
} from "@/lib/services/children";

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

const programColors = {
  Bulanan: { bg: "bg-[#1883FF]/10", text: "text-[#1883FF]", border: "border-[#1883FF]/20" },
  Harian: { bg: "bg-[#C4E02F]/10", text: "text-[#5a7a00]", border: "border-[#C4E02F]/20" },
};

const kelasColors: Record<string, string> = {
  "Rainbow Room": "bg-[#FFA9DD]/10 text-[#a0306a]",
  "Sunshine Class": "bg-[#FEB700]/10 text-[#a07000]",
  "Star Class": "bg-[#99ADFF]/20 text-[#3a4aaa]",
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
  name: "",
  kelas: "Rainbow Room",
  usia: "",
  wali: "",
  telepon: "",
  program: "Bulanan",
};

type ModalMode = "tambah" | "edit" | null;

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
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#FFE26F]/30">
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A]">
              {isEdit ? "Edit Data Anak" : "Tambah Anak Baru"}
            </h2>
            <p className="text-[11px] text-[#4A4A4A] mt-0.5">
              {isEdit ? "Perbarui informasi data anak" : "Isi data lengkap anak"}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F0EDE6] flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#C4E02F] rounded-full flex items-center justify-center">
              <Check size={28} className="text-white" />
            </div>
            <p className="text-[15px] font-bold">
              {isEdit ? "Data berhasil diperbarui!" : "Anak berhasil ditambahkan!"}
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anak" className="w-full px-4 py-3 border-2 border-[#FFE26F] rounded-xl" />
            <select value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} className="w-full px-4 py-3 border-2 border-[#FFE26F] rounded-xl">
              {kelasList.filter((k) => k !== "Semua").map((k) => <option key={k}>{k}</option>)}
            </select>
            <input value={form.usia} onChange={(e) => setForm({ ...form, usia: e.target.value })} placeholder="Usia" className="w-full px-4 py-3 border-2 border-[#FFE26F] rounded-xl" />
            <input value={form.wali} onChange={(e) => setForm({ ...form, wali: e.target.value })} placeholder="Nama Wali" className="w-full px-4 py-3 border-2 border-[#FFE26F] rounded-xl" />
            <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} placeholder="Telepon" className="w-full px-4 py-3 border-2 border-[#FFE26F] rounded-xl" />

            <button onClick={onSubmit} className="w-full py-3.5 rounded-xl bg-[#1883FF] text-white font-bold">
              {isEdit ? "Simpan Perubahan" : "Simpan Data Anak"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DataAnakPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deletingChild, setDeletingChild] = useState<Child | null>(null);
  const [form, setForm] = useState<ModalForm>(emptyForm);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadChildren() {
      try {
        const data = await getChildren();
        setChildren(data);
      } catch {
        setError("Gagal mengambil data anak");
      } finally {
        setLoading(false);
      }
    }

    loadChildren();
  }, []);

  const closeModal = () => {
    setModalMode(null);
    setEditingChild(null);
    setSubmitSuccess(false);
  };

  const openTambah = () => {
    setForm(emptyForm);
    setEditingChild(null);
    setModalMode("tambah");
    setSubmitSuccess(false);
  };

  const openEdit = (child: Child) => {
    setForm({
      name: child.name,
      kelas: child.kelas,
      usia: child.usia,
      wali: child.wali,
      telepon: child.telepon,
      program: child.program,
    });
    setEditingChild(child);
    setModalMode("edit");
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.wali || !form.usia) return;

    const avatar = form.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    try {
      if (modalMode === "edit" && editingChild) {
        const updated = await updateChild(editingChild.id, { ...form, avatar });
        setChildren((prev) => prev.map((c) => (c.id === editingChild.id ? updated : c)));
      } else {
        const created = await createChild({ ...form, avatar });
        setChildren((prev) => [created, ...prev]);
      }

      setSubmitSuccess(true);
      setTimeout(closeModal, 1800);
    } catch {
      setError("Gagal menyimpan data anak");
    }
  };

  const handleDelete = async () => {
    if (!deletingChild) return;

    try {
      await deleteChild(deletingChild.id);
      setChildren((prev) => prev.filter((c) => c.id !== deletingChild.id));
      setDeletingChild(null);
    } catch {
      setError("Gagal menghapus data anak");
    }
  };

  const filtered = children.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.wali.toLowerCase().includes(search.toLowerCase());

    const matchKelas = filterKelas === "Semua" || c.kelas === filterKelas;

    return matchSearch && matchKelas;
  });

  if (loading) return <p>Loading data anak...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
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

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Data Anak</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">
            Kelola data seluruh anak yang terdaftar di Tanika Daycare.
          </p>
        </div>

        <button onClick={openTambah} className="flex items-center gap-2 bg-[#1883FF] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold">
          <Plus size={15} />
          Tambah Anak
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A4A4A]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / wali..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#FFE26F]/60 rounded-xl bg-white"
          />
        </div>

        <div className="flex gap-2">
          {kelasList.map((k) => (
            <button
              key={k}
              onClick={() => setFilterKelas(k)}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-bold border ${
                filterKelas === k ? "bg-[#1A1A1A] text-[#FFE26F]" : "bg-white text-[#4A4A4A]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b text-[11px] font-bold text-[#4A4A4A] uppercase">
          <div className="col-span-3">Nama</div>
          <div className="col-span-2">Kelas</div>
          <div className="col-span-1">Usia</div>
          <div className="col-span-2">Wali</div>
          <div className="col-span-2">Telepon</div>
          <div className="col-span-1 text-center">Program</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {filtered.map((child, i) => {
          const prog = programColors[child.program];
          const avatarColor = avatarColors[i % avatarColors.length];

          return (
            <div key={child.id} className="grid grid-cols-2 md:grid-cols-12 px-6 py-4 items-center">
              <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black ${avatarColor}`}>
                  {child.avatar}
                </div>
                <p className="text-[13px] font-bold">{child.name}</p>
              </div>

              <div className="hidden md:block col-span-2">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${kelasColors[child.kelas]}`}>
                  {child.kelas}
                </span>
              </div>

              <div className="hidden md:block col-span-1 text-[12px]">{child.usia}</div>
              <div className="hidden md:block col-span-2 text-[12px]">{child.wali}</div>
              <div className="hidden md:block col-span-2 text-[12px]">{child.telepon}</div>

              <div className="col-span-1 flex justify-center">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${prog.bg} ${prog.text} ${prog.border}`}>
                  {child.program}
                </span>
              </div>

              <div className="col-span-1 flex justify-center gap-1.5">
                <button onClick={() => openEdit(child)} className="w-8 h-8 rounded-lg bg-[#F7F5F0] flex items-center justify-center">
                  <Pencil size={13} />
                </button>

                <button onClick={() => setDeletingChild(child)} className="w-8 h-8 rounded-lg bg-[#F7F5F0] flex items-center justify-center text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {deletingChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-2xl">
              <p className="font-bold mb-4">Hapus {deletingChild.name}?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingChild(null)}>Batal</button>
                <button onClick={handleDelete} className="text-red-500 font-bold">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[13px] text-[#4A4A4A]">
            Tidak ada data yang cocok.
          </div>
        )}
      </div>
    </div>
  );
}