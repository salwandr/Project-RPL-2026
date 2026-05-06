"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  logDone: boolean;
}

interface DailyLogForm {
  mandi: string;
  makan: string;
  bermain: string;
  mengaji: string;
  sholat: string;
  nilaiStimulasi: number;
  foto: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialChildren: Child[] = [
  { id: 1, name: "Anak 1", kelas: "Rainbow Room",   avatar: "A1", logDone: false },
  { id: 2, name: "Anak 2", kelas: "Sunshine Class", avatar: "A2", logDone: true  },
  { id: 3, name: "Anak 3", kelas: "Rainbow Room",   avatar: "A3", logDone: false },
  { id: 4, name: "Anak 4", kelas: "Star Class",     avatar: "A4", logDone: false },
  { id: 5, name: "Anak 5", kelas: "Sunshine Class", avatar: "A5", logDone: true  },
  { id: 6, name: "Anak 6", kelas: "Rainbow Room",   avatar: "A6", logDone: false },
  { id: 7, name: "Anak 7", kelas: "Star Class",     avatar: "A7", logDone: false },
  { id: 8, name: "Anak 8", kelas: "Sunshine Class", avatar: "A8", logDone: false },
];

const emptyForm: DailyLogForm = {
  mandi: "", makan: "", bermain: "", mengaji: "", sholat: "",
  nilaiStimulasi: 0, foto: [],
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="text-2xl transition-all duration-100 hover:scale-110"
        >
          <span className={(hovered || value) >= star ? "text-amber-400" : "text-stone-200"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Textarea Field ───────────────────────────────────────────────────────────
function LogField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-stone-600 mb-1">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[11px] border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300 transition-shadow resize-none"
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DailyLogPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [selected, setSelected] = useState<Child | null>(null);
  const [form, setForm]         = useState<DailyLogForm>(emptyForm);
  const [saved, setSaved]       = useState(false);
  const [search, setSearch]     = useState("");

  const logDone  = children.filter((c) => c.logDone).length;
  const logBelum = children.filter((c) => !c.logDone).length;
  const total    = children.length;

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChild = (child: Child) => {
    setSelected(child);
    setForm(emptyForm);
    setSaved(false);
  };

  const handleBack = () => {
    setSelected(null);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    setChildren((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, logDone: true } : c))
    );
    setSaved(true);
    setTimeout(() => {
      setSelected(null);
      setSaved(false);
    }, 1500);
  };

  const updateForm = (key: keyof DailyLogForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        {/* Back header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-150"
          >
            ←
          </button>
          <div>
            <p className="text-[13px] font-bold text-stone-700">Input Daily Log</p>
            <p className="text-[10px] text-stone-400">{selected.name} · {selected.kelas}</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-5">

          {/* Rutinitas Harian */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">
              Rutinitas Harian
            </p>
            <div className="space-y-3">
              <LogField label="Mandi"   value={form.mandi}   onChange={(v) => updateForm("mandi", v)}   placeholder="Catatan tentang mandi..." />
              <LogField label="Makan"   value={form.makan}   onChange={(v) => updateForm("makan", v)}   placeholder="Catatan tentang makan..." />
              <LogField label="Bermain" value={form.bermain} onChange={(v) => updateForm("bermain", v)} placeholder="Catatan tentang bermain..." />
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Kegiatan Khusus */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">
              Kegiatan Khusus
            </p>
            <div className="space-y-3">
              <LogField label="Mengaji"        value={form.mengaji} onChange={(v) => updateForm("mengaji", v)} placeholder="Catatan tentang mengaji..." />
              <LogField label="Latihan Sholat" value={form.sholat}  onChange={(v) => updateForm("sholat", v)}  placeholder="Catatan tentang latihan sholat..." />
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Nilai Stimulasi */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-2">
              Nilai Stimulasi
            </p>
            <StarRating
              value={form.nilaiStimulasi}
              onChange={(v) => updateForm("nilaiStimulasi", v)}
            />
          </div>

          <div className="border-t border-stone-100" />

          {/* Upload Foto */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">
              Upload Foto
            </p>
            <div className="flex gap-3">
              {/* Upload button */}
              <label className="w-24 h-20 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:border-sage-green hover:bg-sage-green/5 hover:scale-[1.02] transition-all duration-150">
                <span className="text-xl text-stone-300">+</span>
                <span className="text-[9px] text-stone-300 mt-0.5">Tambah</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
              {/* Placeholder slots */}
              {[1, 2].map((i) => (
                <div key={i} className="w-24 h-20 rounded-xl bg-stone-50 border border-stone-100" />
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-3 rounded-xl text-[12px] font-bold transition-all duration-200 shadow-sm
              ${saved
                ? "bg-sage-green/50 text-white cursor-default"
                : "bg-sage-green text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"}`}
          >
            {saved ? "Tersimpan ✓" : "Simpan Daily Log"}
          </button>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",    value: total,    bg: "bg-sage-green/20",  text: "text-sage-green", sub: "Hari ini" },
          { label: "Log Selesai",   value: logDone,  bg: "bg-sage-green/30",  text: "text-sage-green", sub: "Sudah diisi" },
          { label: "Belum Diisi",   value: logBelum, bg: "bg-warm-beige",     text: "text-stone-500",  sub: "Perlu diisi" },
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
          <p className="text-[12px] font-semibold text-stone-700">Progress Pengisian Daily Log</p>
          <span className="text-[12px] font-bold text-sage-green">{logDone}/{total}</span>
        </div>
        <div className="w-full h-3 bg-warm-beige rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-green rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(logDone / total) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-stone-400 mt-2">{logBelum} log belum diisi</p>
      </div>

      {/* Child list */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="text-[12px] font-bold text-stone-700">Pilih Anak</p>
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
            <button
              key={child.id}
              onClick={() => !child.logDone && handleSelectChild(child)}
              disabled={child.logDone}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-200
                ${child.logDone
                  ? "bg-stone-50 border-stone-100 cursor-default opacity-60"
                  : "bg-white border-stone-100 shadow-sm hover:shadow-md hover:scale-[1.005] cursor-pointer"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500 flex-shrink-0 shadow-sm">
                {child.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-stone-700 truncate">{child.name}</p>
                <p className="text-[10px] text-stone-400 truncate">{child.kelas}</p>
              </div>

              {/* Status */}
              {child.logDone ? (
                <span className="text-[10px] font-bold text-white bg-sage-green px-3 py-1.5 rounded-full shadow-sm flex-shrink-0">
                  Selesai ✓
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-stone-400 bg-warm-beige px-3 py-1.5 rounded-full flex-shrink-0">
                  Isi Log →
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}