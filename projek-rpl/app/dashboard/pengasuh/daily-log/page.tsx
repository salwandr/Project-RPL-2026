"use client";

import { useState, useRef } from "react";

type Mood = "senang" | "biasa" | "rewel" | "mengantuk" | "";
type PortiMakan = "habis" | "setengah" | "sedikit" | "tidak";
type ToiletStatus = "mandiri" | "dibantu" | "belum" | "tidak";

type LogForm = {
  makan_pagi_porsi: PortiMakan;
  makan_pagi_menu: string;
  makan_pagi_catatan: string;
  makan_siang_porsi: PortiMakan;
  makan_siang_menu: string;
  makan_siang_catatan: string;
  snack_pagi: string;
  snack_sore: string;
  tidur_mulai: string;
  tidur_selesai: string;
  tidur_kualitas: "nyenyak" | "gelisah" | "tidak" | "";
  toilet: ToiletStatus;
  toilet_frekuensi: string;
  mood: Mood;
  mood_catatan: string;
  aktivitas_belajar: string[];
  bermain_catatan: string;
  catatan_umum: string;
  foto: { url: string; file: File }[];
};

type Anak = {
  id: number;
  nama: string;
  kelas: string;
  program: string;
  logDone: boolean;
};

const initialAnak: Anak[] = [
  { id: 1, nama: "Almira Zahra",  kelas: "Rainbow Room", program: "Full Day",  logDone: false },
  { id: 2, nama: "Bintang Putra", kelas: "Rainbow Room", program: "Half Day",  logDone: true  },
  { id: 3, nama: "Citra Nadia",   kelas: "Sun Room",     program: "Full Day",  logDone: false },
  { id: 4, nama: "Dafa Ramadhan", kelas: "Sun Room",     program: "Playgroup", logDone: false },
  { id: 5, nama: "Elisa Putri",   kelas: "Moon Room",    program: "Full Day",  logDone: true  },
  { id: 6, nama: "Farhan Akbar",  kelas: "Moon Room",    program: "Half Day",  logDone: false },
];

const emptyForm: LogForm = {
  makan_pagi_porsi: "",
  makan_pagi_menu: "",
  makan_pagi_catatan: "",
  makan_siang_porsi: "",
  makan_siang_menu: "",
  makan_siang_catatan: "",
  snack_pagi: "",
  snack_sore: "",
  tidur_mulai: "",
  tidur_selesai: "",
  tidur_kualitas: "",
  toilet: "tidak",
  toilet_frekuensi: "",
  mood: "",
  mood_catatan: "",
  aktivitas_belajar: [],
  bermain_catatan: "",
  catatan_umum: "",
  foto: [],
};

const moodOptions: { value: Mood; label: string; color: string; bg: string }[] = [
  { value: "senang",    label: "Senang",    color: "#5a7a00", bg: "bg-[#C4E02F]/15 border-[#C4E02F]/40"  },
  { value: "biasa",     label: "Biasa",     color: "#1883FF", bg: "bg-[#1883FF]/10 border-[#1883FF]/30"  },
  { value: "rewel",     label: "Rewel",     color: "#a0306a", bg: "bg-[#FFA9DD]/15 border-[#FFA9DD]/40"  },
  { value: "mengantuk", label: "Mengantuk", color: "#a07000", bg: "bg-[#FEB700]/15 border-[#FEB700]/30"  },
];

const porsiOptions: { value: PortiMakan; label: string }[] = [
  { value: "habis",    label: "Habis"    },
  { value: "setengah", label: "Setengah" },
  { value: "sedikit",  label: "Sedikit"  },
  { value: "tidak",    label: "Tidak"    },
];

const tidurKualitasOptions = [
  { value: "nyenyak", label: "Nyenyak" },
  { value: "gelisah", label: "Gelisah" },
  { value: "tidak",   label: "Tidak Tidur" },
];

const toiletOptions: { value: ToiletStatus; label: string }[] = [
  { value: "mandiri",  label: "Mandiri"  },
  { value: "dibantu",  label: "Dibantu"  },
  { value: "belum",    label: "Belum"    },
  { value: "tidak",    label: "Tidak"    },
];

const aktivitasPilihan = [
  "Membaca buku", "Mewarnai", "Menggambar", "Puzzle",
  "Menyanyi", "Menari", "Berhitung", "Bahasa Inggris",
  "Seni & Kerajinan", "Cerita interaktif",
];

function SectionHeader({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "20" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest">{title}</p>
    </div>
  );
}

function PillSelect<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all
            ${value === o.value
              ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
              : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#FFE26F]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 2 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#1883FF] placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] resize-none transition-colors"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    />
  );
}

export default function DailyLogPage() {
  const [anakList, setAnakList]   = useState<Anak[]>(initialAnak);
  const [selected, setSelected]   = useState<Anak | null>(null);
  const [form, setForm]           = useState<LogForm>(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [search, setSearch]       = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const done  = anakList.filter((a) => a.logDone).length;
  const belum = anakList.filter((a) => !a.logDone).length;

  const set = <K extends keyof LogForm>(key: K, val: LogForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const mapped = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setForm((prev) => ({ ...prev, foto: [...prev.foto, ...mapped].slice(0, 6) }));
  };

  const removeFoto = (i: number) =>
    setForm((prev) => ({ ...prev, foto: prev.foto.filter((_, idx) => idx !== i) }));

  const handleSelect = (anak: Anak) => {
    if (anak.logDone) return;
    setSelected(anak);
    setForm(emptyForm);
    setSaved(false);
    setActiveSection(0);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAnakList((prev) => prev.map((a) => a.id === selected.id ? { ...a, logDone: true } : a));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSelected(null); setSaved(false); }, 1800);
  };

  const toggleAktivitas = (item: string) => {
    const current = form.aktivitas_belajar;
    set("aktivitas_belajar", current.includes(item) ? current.filter((a) => a !== item) : [...current, item]);
  };

  const sections = ["Makan", "Tidur & Toilet", "Mood", "Aktivitas", "Foto & Catatan"];

  const isValid =
    form.mood !== "" ||
    form.makan_pagi_porsi !== "" ||
    form.makan_siang_porsi !== "" ||
    form.tidur_kualitas !== "";

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-[#1A1A1A] rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-[#FFE26F] text-[13px] font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <span className="text-white/40 text-[11px] font-medium">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1883FF]/20 border border-[#1883FF]/30 flex items-center justify-center text-[11px] font-black text-[#99ADFF] shrink-0">
              {selected.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">{selected.nama}</p>
              <p className="text-white/40 text-[11px]">{selected.kelas} · {selected.program}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-[#FFA9DD]/15 border border-[#FFA9DD]/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFA9DD] animate-pulse" />
              <span className="text-[10px] font-bold text-[#FFA9DD]">Live ke orang tua</span>
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {sections.map((s, i) => (
            <button
              key={s}
              onClick={() => setActiveSection(i)}
              className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold border transition-all
                ${activeSection === i
                  ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                  : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#FFE26F]"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm p-6 space-y-6">

          {/* MAKAN */}
          {activeSection === 0 && (
            <div className="space-y-6">
              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Makan & Minum"
                color="#FEB700"
              />

              {[
                { label: "Makan Pagi", porsiKey: "makan_pagi_porsi" as const, menuKey: "makan_pagi_menu" as const, catatanKey: "makan_pagi_catatan" as const },
                { label: "Makan Siang", porsiKey: "makan_siang_porsi" as const, menuKey: "makan_siang_menu" as const, catatanKey: "makan_siang_catatan" as const },
              ].map((meal) => (
                <div key={meal.label} className="space-y-3 p-4 bg-[#FFFDF7] rounded-2xl border border-[#FFE26F]/20">
                  <p className="text-[12px] font-bold text-[#1A1A1A]">{meal.label}</p>
                  <div>
                    <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Porsi</p>
                    <PillSelect options={porsiOptions} value={form[meal.porsiKey]} onChange={(v) => set(meal.porsiKey, v)} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Menu</p>
                    <input
                      value={form[meal.menuKey]}
                      onChange={(e) => set(meal.menuKey, e.target.value)}
                      placeholder="Contoh: Nasi, ayam, sayur bayam..."
                      className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#1883FF] transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Catatan</p>
                    <Textarea value={form[meal.catatanKey]} onChange={(v) => set(meal.catatanKey, v)} placeholder="Catatan tambahan tentang makan..." />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Snack Pagi", key: "snack_pagi" as const },
                  { label: "Snack Sore", key: "snack_sore" as const },
                ].map((s) => (
                  <div key={s.label} className="space-y-2">
                    <p className="text-[12px] font-bold text-[#1A1A1A]">{s.label}</p>
                    <input
                      value={form[s.key]}
                      onChange={(e) => set(s.key, e.target.value)}
                      placeholder="Nama snack..."
                      className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#1883FF] transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIDUR & TOILET */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
                title="Tidur Siang"
                color="#99ADFF"
              />
              <div className="space-y-4 p-4 bg-[#FFFDF7] rounded-2xl border border-[#FFE26F]/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Mulai Tidur", key: "tidur_mulai" as const },
                    { label: "Bangun Tidur", key: "tidur_selesai" as const },
                  ].map((t) => (
                    <div key={t.label} className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#4A4A4A]">{t.label}</p>
                      <input
                        type="time"
                        value={form[t.key]}
                        onChange={(e) => set(t.key, e.target.value)}
                        className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#1883FF] transition-colors"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Kualitas Tidur</p>
                  <PillSelect
                    options={tidurKualitasOptions as { value: "nyenyak" | "gelisah" | "tidak"; label: string }[]}
                    value={form.tidur_kualitas}
                    onChange={(v) => set("tidur_kualitas", v)}
                  />
                </div>
              </div>

              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Toilet Training"
                color="#1883FF"
              />
              <div className="space-y-4 p-4 bg-[#FFFDF7] rounded-2xl border border-[#FFE26F]/20">
                <div>
                  <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Status</p>
                  <PillSelect options={toiletOptions} value={form.toilet} onChange={(v) => set("toilet", v)} />
                </div>
                {form.toilet !== "tidak" && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Frekuensi / Catatan</p>
                    <input
                      value={form.toilet_frekuensi}
                      onChange={(e) => set("toilet_frekuensi", e.target.value)}
                      placeholder="Contoh: 2x ke toilet, berhasil mandiri..."
                      className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#1883FF] transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MOOD */}
          {activeSection === 2 && (
            <div className="space-y-4">
              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Mood & Kondisi"
                color="#FFA9DD"
              />
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => set("mood", m.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all
                      ${form.mood === m.value
                        ? `${m.bg} border-current`
                        : "bg-white border-[#E8E4DB] hover:border-[#FFE26F]"}`}
                    style={form.mood === m.value ? { color: m.color } : {}}
                  >
                    <p className="text-[14px] font-black">{m.label}</p>
                  </button>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Catatan Kondisi</p>
                <Textarea
                  value={form.mood_catatan}
                  onChange={(v) => set("mood_catatan", v)}
                  placeholder="Contoh: Anak terlihat ceria sepanjang hari, sempat menangis saat makan siang..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* AKTIVITAS */}
          {activeSection === 3 && (
            <div className="space-y-5">
              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                title="Aktivitas Belajar"
                color="#C4E02F"
              />
              <div className="flex flex-wrap gap-2">
                {aktivitasPilihan.map((item) => {
                  const active = form.aktivitas_belajar.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleAktivitas(item)}
                      className={`px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all
                        ${active
                          ? "bg-[#C4E02F]/20 text-[#5a7a00] border-[#C4E02F]/50"
                          : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#C4E02F]/40"}`}
                    >
                      {active && <span className="mr-1">✓</span>}{item}
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#4A4A4A] mb-2">Catatan Bermain Bebas</p>
                <Textarea
                  value={form.bermain_catatan}
                  onChange={(v) => set("bermain_catatan", v)}
                  placeholder="Contoh: Bermain balok bersama teman, menyusun puzzle 12 keping secara mandiri..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* FOTO & CATATAN */}
          {activeSection === 4 && (
            <div className="space-y-5">
              <SectionHeader
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Foto Kegiatan"
                color="#1883FF"
              />
              <div className="grid grid-cols-3 gap-3">
                {form.foto.map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8E4DB]">
                    <img src={f.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white text-[10px] hover:bg-black/80 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {form.foto.length < 6 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-[#FFE26F] bg-[#FFF8E8] hover:border-[#1883FF] hover:bg-[#EBF4FF] transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#4A4A4A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] text-[#4A4A4A]/40 font-semibold">Tambah</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={handleFoto} className="hidden" />
              <p className="text-[11px] text-[#4A4A4A] font-medium">Maks 6 foto · Akan dikirim langsung ke orang tua</p>

              <div>
                <p className="text-[12px] font-bold text-[#1A1A1A] mb-2">Catatan Umum untuk Orang Tua</p>
                <Textarea
                  value={form.catatan_umum}
                  onChange={(v) => set("catatan_umum", v)}
                  placeholder="Pesan atau catatan khusus untuk orang tua hari ini..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex gap-3 pb-4">
          {activeSection > 0 && (
            <button
              onClick={() => setActiveSection(activeSection - 1)}
              className="px-5 py-3.5 rounded-2xl border border-[#E8E4DB] text-[13px] font-bold text-[#4A4A4A] hover:bg-[#FFFDF7] transition-all"
            >
              ←
            </button>
          )}
          {activeSection < sections.length - 1 ? (
            <button
              onClick={() => setActiveSection(activeSection + 1)}
              className="flex-1 py-3.5 rounded-2xl bg-[#1A1A1A] text-[#FFE26F] text-[14px] font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Lanjut ke {sections[activeSection + 1]} →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || saved || !isValid}
              className={`flex-1 py-3.5 rounded-2xl text-[14px] font-bold transition-all
                ${saved
                  ? "bg-[#C4E02F] text-[#1A1A1A]"
                  : !isValid
                    ? "bg-[#E8E4DB] text-[#999] cursor-not-allowed"
                    : saving
                      ? "bg-[#1883FF]/60 text-white"
                      : "bg-[#1A1A1A] text-[#FFE26F] hover:opacity-90 active:scale-95"}`}
            >
              {saved ? "Tersimpan & Dikirim ke Orang Tua" : saving ? "Menyimpan..." : "Simpan & Kirim ke Orang Tua"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Daily Log</h1>
        <p className="text-[13px] text-[#4A4A4A] mt-1">Isi laporan harian anak — langsung diterima orang tua.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Anak",  value: anakList.length, bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]"  },
          { label: "Selesai",     value: done,             bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]"  },
          { label: "Belum Diisi", value: belum,            bg: "bg-[#FEB700]/10", border: "border-[#FEB700]/20", text: "text-[#a07000]"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 md:p-5`}>
            <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-[11px] font-semibold text-[#4A4A4A] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider">Progress</p>
          <span className="text-[12px] font-bold text-[#1883FF]">{done}/{anakList.length}</span>
        </div>
        <div className="w-full h-2.5 bg-[#F0EDE6] rounded-full overflow-hidden">
          <div className="h-full bg-[#C4E02F] rounded-full transition-all duration-500" style={{ width: `${(done / anakList.length) * 100}%` }} />
        </div>
      </div>

      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama anak..."
          className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#E8E4DB] rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#F0EDE6]">
          <p className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-widest">Pilih Anak</p>
        </div>
        <div className="divide-y divide-[#F7F5F0]">
          {anakList
            .filter((a) => a.nama.toLowerCase().includes(search.toLowerCase()))
            .map((anak) => (
              <button
                key={anak.id}
                onClick={() => handleSelect(anak)}
                disabled={anak.logDone}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all
                  ${anak.logDone
                    ? "opacity-50 cursor-not-allowed bg-[#F7F5F0]"
                    : "hover:bg-[#FFFDF7] cursor-pointer"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#1883FF]/10 border border-[#1883FF]/20 flex items-center justify-center text-[11px] font-black text-[#1883FF] shrink-0">
                  {anak.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{anak.nama}</p>
                  <p className="text-[11px] text-[#4A4A4A]">{anak.kelas} · {anak.program}</p>
                </div>
                {anak.logDone ? (
                  <span className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-[#C4E02F]/15 text-[#5a7a00] border border-[#C4E02F]/30">
                    Selesai
                  </span>
                ) : (
                  <span className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-[#1883FF]/10 text-[#1883FF] border border-[#1883FF]/20">
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