"use client";

import { useState } from "react";
import { Search, BookOpen, CheckCircle2, ChevronLeft, Star, Upload, Clock } from "lucide-react";

interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  logDone: boolean;
}

interface LogForm {
  mandi: string;
  makan: string;
  bermain: string;
  membaca: string;
  Mewarnai: string;
  nilaiStimulasi: number;
}

const initialChildren: Child[] = [
  { id: 1, name: "Andra Pratama", kelas: "Rainbow Room",   avatar: "AP", logDone: false },
  { id: 2, name: "Lana Safira",   kelas: "Sunshine Class", avatar: "LS", logDone: true  },
  { id: 3, name: "Budi Wijaya",   kelas: "Rainbow Room",   avatar: "BW", logDone: false },
  { id: 4, name: "Rina Putri",    kelas: "Star Class",     avatar: "RP", logDone: false },
  { id: 5, name: "Dani Saputra",  kelas: "Sunshine Class", avatar: "DS", logDone: true  },
  { id: 6, name: "Maya Sari",     kelas: "Rainbow Room",   avatar: "MS", logDone: false },
  { id: 7, name: "Rafi Ahmad",    kelas: "Star Class",     avatar: "RA", logDone: false },
  { id: 8, name: "Citra Dewi",    kelas: "Sunshine Class", avatar: "CD", logDone: false },
];

const emptyForm: LogForm = { mandi: "", makan: "", bermain: "", membaca: "", Mewarnai: "", nilaiStimulasi: 0 };

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-all duration-100 hover:scale-110"
        >
          <Star
            size={24}
            className="transition-colors"
            fill={(hovered || value) >= star ? "#FEB700" : "none"}
            stroke={(hovered || value) >= star ? "#FEB700" : "#D0D0D0"}
          />
        </button>
      ))}
    </div>
  );
}

function LogField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[12px] border border-[#F0F0F0] rounded-xl px-4 py-3 bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 focus:border-[#1883FF]/30 placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] resize-none transition-all"
      />
    </div>
  );
}

export default function PengasuhDailyLogPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [selected, setSelected] = useState<Child | null>(null);
  const [form, setForm]         = useState<LogForm>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [search, setSearch]     = useState("");

  const logDone  = children.filter((c) => c.logDone).length;
  const logBelum = children.filter((c) => !c.logDone).length;
  const total    = children.length;

  const filtered = children.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (child: Child) => {
    if (child.logDone) return;
    setSelected(child);
    setForm(emptyForm);
    setSaved(false);
  };

  const handleBack = () => { setSelected(null); setSaved(false); };

  const handleSave = () => {
    if (!selected) return;
    setSaving(true);
    setTimeout(() => {
      setChildren((prev) => prev.map((c) => c.id === selected.id ? { ...c, logDone: true } : c));
      setSaving(false);
      setSaved(true);
      setTimeout(() => { setSelected(null); setSaved(false); }, 1500);
    }, 800);
  };

  const updateForm = (key: keyof LogForm, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const isFormValid = form.mandi || form.makan || form.bermain || form.nilaiStimulasi > 0;

  // ── FORM VIEW ──
  if (selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Back + child info */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-white border border-[#F0F0F0] flex items-center justify-center text-[#4A4A4A] shadow-sm hover:shadow-md hover:scale-105 hover:text-[#1883FF] transition-all"
          >
            <ChevronLeft size={17} />
          </button>
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm px-4 py-2.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-[#1883FF]/10 flex items-center justify-center text-[10px] font-bold text-[#1883FF]">
              {selected.avatar}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A]">Input Daily Log</p>
              <p className="text-[10px] text-[#4A4A4A]">{selected.name} · {selected.kelas}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[10px] text-[#4A4A4A]">
              <Clock size={11} />
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-6 space-y-5">

          {/* Rutinitas */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-[#1883FF]/10 flex items-center justify-center">
                <BookOpen size={13} className="text-[#1883FF]" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A]">Rutinitas Harian</p>
            </div>
            <div className="space-y-3">
              <LogField label="Mandi"   value={form.mandi}   onChange={(v) => updateForm("mandi", v)}   placeholder="Catatan tentang mandi..." />
              <LogField label="Makan"   value={form.makan}   onChange={(v) => updateForm("makan", v)}   placeholder="Catatan tentang makan..." />
              <LogField label="Bermain" value={form.bermain} onChange={(v) => updateForm("bermain", v)} placeholder="Catatan tentang bermain..." />
            </div>
          </div>

          <div className="border-t border-[#F0F0F0]" />

          {/* Kegiatan Khusus */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-[#FFE26F]/30 flex items-center justify-center">
                <Star size={13} className="text-[#FEB700]" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A]">Kegiatan Khusus</p>
            </div>
            <div className="space-y-3">
              <LogField label="membaca"        value={form.membaca} onChange={(v) => updateForm("membaca", v)} placeholder="Catatan tentang membaca..." />
              <LogField label="Mewarnai" value={form.Mewarnai}  onChange={(v) => updateForm("Mewarnai", v)}  placeholder="Catatan tentang Mewarnai..." />
            </div>
          </div>

          <div className="border-t border-[#F0F0F0]" />

          {/* Nilai Stimulasi */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-3">Nilai Stimulasi</p>
            <StarRating value={form.nilaiStimulasi} onChange={(v) => updateForm("nilaiStimulasi", v)} />
            {form.nilaiStimulasi > 0 && (
              <p className="text-[11px] text-[#FEB700] font-semibold mt-1">
                {["","Perlu Perhatian","Cukup Baik","Baik","Sangat Baik","Luar Biasa!"][form.nilaiStimulasi]}
              </p>
            )}
          </div>

          <div className="border-t border-[#F0F0F0]" />

          {/* Upload Foto */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-3">Upload Foto</p>
            <div className="flex gap-3">
              <label className="w-24 h-20 rounded-xl border-2 border-dashed border-[#F0F0F0] flex flex-col items-center justify-center cursor-pointer hover:border-[#1883FF] hover:bg-[#1883FF]/5 transition-all group">
                <Upload size={16} className="text-[#4A4A4A]/40 group-hover:text-[#1883FF] transition-colors" />
                <span className="text-[9px] text-[#4A4A4A]/40 mt-1 group-hover:text-[#1883FF]">Tambah</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
              {[1,2].map((i) => (
                <div key={i} className="w-24 h-20 rounded-xl bg-[#F4F6FA] border border-[#F0F0F0]" />
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || saved || !isFormValid}
            className={`w-full py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200
              ${saved
                ? "bg-[#C4E02F] text-[#1A1A1A]"
                : !isFormValid
                  ? "bg-[#F4F6FA] text-[#4A4A4A] cursor-not-allowed"
                  : saving
                    ? "bg-[#1883FF]/60 text-white cursor-wait"
                    : "bg-[#1883FF] text-white hover:bg-[#1570e0] hover:shadow-lg hover:shadow-[#1883FF]/20 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-[#1883FF]/15"}`}
          >
            {saved ? "✓ Daily Log Tersimpan!" : saving ? "Menyimpan..." : "Simpan Daily Log"}
          </button>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",  value: total,    bg: "#1883FF", sub: "Hari ini"    },
          { label: "Log Selesai", value: logDone,  bg: "#C4E02F", sub: "Sudah diisi" },
          { label: "Belum Diisi", value: logBelum, bg: "#FFE26F", sub: "Perlu diisi" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
            <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.bg}20` }}>
              <BookOpen size={15} style={{ color: s.bg }} />
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
          <p className="text-[13px] font-semibold text-[#1A1A1A]">Progress Pengisian Daily Log</p>
          <span className="text-[12px] font-bold text-[#1883FF]">{logDone}/{total}</span>
        </div>
        <div className="w-full h-2.5 bg-[#F4F6FA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(logDone/total)*100}%`, background: "#1883FF" }}
          />
        </div>
        <p className="text-[10px] text-[#4A4A4A] mt-2">{logBelum} log belum diisi</p>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <p className="text-[13px] font-bold text-[#1A1A1A]">Pilih Anak</p>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
            <input
              type="text"
              placeholder="Cari nama anak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-[11px] border border-[#F0F0F0] rounded-xl bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 w-44 placeholder:text-[#4A4A4A]/40"
            />
          </div>
        </div>

        <div className="divide-y divide-[#F0F0F0]">
          {filtered.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelect(child)}
              disabled={child.logDone}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all
                ${child.logDone
                  ? "bg-[#F4F6FA] opacity-60 cursor-not-allowed"
                  : "hover:bg-[#F4F6FA] hover:scale-[1.005] cursor-pointer"}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#1883FF]/10 border-2 border-[#1883FF]/20 flex items-center justify-center text-[10px] font-bold text-[#1883FF] flex-shrink-0">
                {child.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1A1A1A] truncate">{child.name}</p>
                <p className="text-[10px] text-[#4A4A4A] truncate">{child.kelas}</p>
              </div>
              {child.logDone ? (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#5a8a00] bg-[#C4E02F]/20 px-3 py-1.5 rounded-full flex-shrink-0">
                  <CheckCircle2 size={12} /> Selesai
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#1883FF] bg-[#1883FF]/10 px-3 py-1.5 rounded-full flex-shrink-0 hover:bg-[#1883FF] hover:text-white transition-colors">
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