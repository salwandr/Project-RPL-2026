"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mood = "senang" | "biasa" | "rewel" | "mengantuk" | "";
type PorsiMakan = "habis" | "setengah" | "sedikit" | "tidak" | "";
type ToiletStatus = "mandiri" | "dibantu" | "belum" | "tidak";
type TidurKualitas = "nyenyak" | "gelisah" | "tidak" | "";

type Anak = {
  id: string;
  full_name: string;
  birth_date?: string | null;
  program?: string | null;
  logDone?: boolean;
};

type LogForm = {
  makan_pagi_porsi: PorsiMakan;
  makan_pagi_menu: string;
  makan_pagi_catatan: string;
  makan_siang_porsi: PorsiMakan;
  makan_siang_menu: string;
  makan_siang_catatan: string;
  snack_pagi: string;
  snack_sore: string;
  tidur_mulai: string;
  tidur_selesai: string;
  tidur_kualitas: TidurKualitas;
  toilet: ToiletStatus;
  toilet_frekuensi: string;
  mood: Mood;
  mood_catatan: string;
  aktivitas_belajar: string[];
  bermain_catatan: string;
  catatan_umum: string;
  foto: { url: string; file: File }[];
};

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

const porsiOptions: { value: PorsiMakan; label: string }[] = [
  { value: "habis", label: "Habis" },
  { value: "setengah", label: "Setengah" },
  { value: "sedikit", label: "Sedikit" },
  { value: "tidak", label: "Tidak" },
];

const tidurOptions: { value: TidurKualitas; label: string }[] = [
  { value: "nyenyak", label: "Nyenyak" },
  { value: "gelisah", label: "Gelisah" },
  { value: "tidak", label: "Tidak Tidur" },
];

const toiletOptions: { value: ToiletStatus; label: string }[] = [
  { value: "mandiri", label: "Mandiri" },
  { value: "dibantu", label: "Dibantu" },
  { value: "belum", label: "Belum" },
  { value: "tidak", label: "Tidak" },
];

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: "senang", label: "Senang", emoji: "😊" },
  { value: "biasa", label: "Biasa", emoji: "😐" },
  { value: "rewel", label: "Rewel", emoji: "😢" },
  { value: "mengantuk", label: "Mengantuk", emoji: "😴" },
];

const aktivitasPilihan = [
  "Membaca buku",
  "Mewarnai",
  "Menggambar",
  "Puzzle",
  "Menyanyi",
  "Menari",
  "Berhitung",
  "Bahasa Inggris",
  "Seni & Kerajinan",
  "Cerita interaktif",
];

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function PillSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all ${
            value === option.value
              ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
              : "bg-white text-[#4A4A4A] border-[#E8E4DB] hover:border-[#FFE26F]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      rows={3}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full text-[13px] border border-[#E8E4DB] rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#1883FF] placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] resize-none"
    />
  );
}

export default function DailyLogPengasuhPage() {
  const [anakList, setAnakList] = useState<Anak[]>([]);
  const [selected, setSelected] = useState<Anak | null>(null);
  const [form, setForm] = useState<LogForm>(emptyForm);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const today = todayDate();

  const set = <K extends keyof LogForm>(key: K, value: LogForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAnak = anakList.filter((anak) =>
    anak.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const done = anakList.filter((anak) => anak.logDone).length;
  const belum = anakList.length - done;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData.user) throw new Error("User belum login.");

        setTeacherId(userData.user.id);

        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("id, full_name, birth_date, program")
          .order("full_name", { ascending: true });

        if (childrenError) throw childrenError;

        const { data: logsData, error: logsError } = await supabase
          .from("daily_logs")
          .select("child_id")
          .eq("log_date", today);

        if (logsError) throw logsError;

        const doneIds = new Set((logsData ?? []).map((log) => log.child_id));

        const mappedChildren = (childrenData ?? []).map((child) => ({
          ...child,
          logDone: doneIds.has(child.id),
        }));

        setAnakList(mappedChildren);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Gagal mengambil data anak.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [today]);

  const handleFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const mapped = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setForm((prev) => ({
      ...prev,
      foto: [...prev.foto, ...mapped].slice(0, 6),
    }));
  };

  const removeFoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      foto: prev.foto.filter((_, i) => i !== index),
    }));
  };

  const handleSelect = async (anak: Anak) => {
    try {
      setSelected(anak);
      setSaved(false);
      setError(null);
      setForm(emptyForm);

      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("child_id", anak.id)
        .eq("log_date", today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setForm({
          makan_pagi_porsi: data.makan_pagi_porsi ?? "",
          makan_pagi_menu: data.makan_pagi_menu ?? "",
          makan_pagi_catatan: data.makan_pagi_catatan ?? "",
          makan_siang_porsi: data.makan_siang_porsi ?? "",
          makan_siang_menu: data.makan_siang_menu ?? "",
          makan_siang_catatan: data.makan_siang_catatan ?? "",
          snack_pagi: data.snack_pagi ?? "",
          snack_sore: data.snack_sore ?? "",
          tidur_mulai: data.tidur_mulai ?? "",
          tidur_selesai: data.tidur_selesai ?? "",
          tidur_kualitas: data.tidur_kualitas ?? "",
          toilet: data.toilet ?? "tidak",
          toilet_frekuensi: data.toilet_frekuensi ?? "",
          mood: data.mood ?? "",
          mood_catatan: data.mood_catatan ?? "",
          aktivitas_belajar: data.aktivitas_belajar ?? [],
          bermain_catatan: data.bermain_catatan ?? "",
          catatan_umum: data.catatan_umum ?? "",
          foto: [],
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Gagal membuka daily log.");
    }
  };

  const toggleAktivitas = (item: string) => {
    setForm((prev) => ({
      ...prev,
      aktivitas_belajar: prev.aktivitas_belajar.includes(item)
        ? prev.aktivitas_belajar.filter((value) => value !== item)
        : [...prev.aktivitas_belajar, item],
    }));
  };

  const handleSave = async () => {
    if (!selected || !teacherId) return;

    try {
      setSaving(true);
      setError(null);

      const uploadedFotoUrls: string[] = [];

      for (const foto of form.foto) {
        const filePath = `daily-logs/${selected.id}/${today}/${Date.now()}_${foto.file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("foto_daily_log")
          .upload(filePath, foto.file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = await supabase.storage
          .from("foto_daily_log")
          .createSignedUrl(filePath, 60 * 60 * 24 * 7);

        if (urlError) throw urlError;

        uploadedFotoUrls.push(urlData.signedUrl);
      }

      const { data: oldLog, error: oldLogError } = await supabase
        .from("daily_logs")
        .select("foto")
        .eq("child_id", selected.id)
        .eq("log_date", today)
        .maybeSingle();

      if (oldLogError) throw oldLogError;

      const oldFoto = oldLog?.foto ?? [];

      const { data, error: saveError } = await supabase
        .from("daily_logs")
        .upsert(
          {
            child_id: selected.id,
            teacher_id: teacherId,
            log_date: today,
            
             title: "Daily Log",
              description: form.catatan_umum || "Daily log anak",
              photo_url: uploadedFotoUrls[0] ?? null,

            makan_pagi_porsi: form.makan_pagi_porsi || null,
            makan_pagi_menu: form.makan_pagi_menu || null,
            makan_pagi_catatan: form.makan_pagi_catatan || null,

            makan_siang_porsi: form.makan_siang_porsi || null,
            makan_siang_menu: form.makan_siang_menu || null,
            makan_siang_catatan: form.makan_siang_catatan || null,

            snack_pagi: form.snack_pagi || null,
            snack_sore: form.snack_sore || null,

            tidur_mulai: form.tidur_mulai || null,
            tidur_selesai: form.tidur_selesai || null,
            tidur_kualitas: form.tidur_kualitas || null,

            toilet: form.toilet,
            toilet_frekuensi: form.toilet_frekuensi || null,

            mood: form.mood || null,
            mood_catatan: form.mood_catatan || null,

            aktivitas_belajar: form.aktivitas_belajar,
            bermain_catatan: form.bermain_catatan || null,

            catatan_umum: form.catatan_umum || null,
            foto: [...oldFoto, ...uploadedFotoUrls],
          },
          { onConflict: "child_id,log_date" }
        )
        .select()
        .single();

      if (saveError) throw saveError;

      setAnakList((prev) =>
        prev.map((anak) =>
          anak.id === selected.id ? { ...anak, logDone: true } : anak
        )
      );

      setSaved(true);
      setForm((prev) => ({ ...prev, foto: [] }));

      setTimeout(() => {
        setSelected(null);
        setSaved(false);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Gagal menyimpan daily log.");
    } finally {
      setSaving(false);
    }
  };

  const isValid =
    form.mood !== "" ||
    form.makan_pagi_porsi !== "" ||
    form.makan_siang_porsi !== "" ||
    form.tidur_kualitas !== "" ||
    form.catatan_umum.trim() !== "";

  if (loading) {
    return <div className="p-8">Loading data anak...</div>;
  }

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-[#1A1A1A] rounded-2xl px-5 py-4">
          <button
            onClick={() => setSelected(null)}
            className="text-[#FFE26F] text-sm font-bold mb-4"
          >
            ← Kembali
          </button>

          <h1 className="text-white font-bold text-xl">{selected.full_name}</h1>
          <p className="text-white/50 text-sm">
            {selected.program ?? "Program belum dipilih"} · {today}
          </p>
          <p className="text-[#FFA9DD] text-xs font-bold mt-2">
            Data ini akan muncul di halaman orang tua setelah disimpan.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-semibold">
            {error}
          </div>
        )}

        {saved && (
          <div className="bg-[#C4E02F]/20 border border-[#C4E02F] text-[#4a7500] rounded-2xl p-4 text-sm font-bold">
            Daily log berhasil disimpan.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#FFE26F]/30 shadow-sm p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">🍽️ Makan & Minum</h2>

            <div className="space-y-3 p-4 bg-[#FFFDF7] rounded-2xl border border-[#FFE26F]/20">
              <p className="text-sm font-bold">Makan Pagi</p>
              <PillSelect
                options={porsiOptions}
                value={form.makan_pagi_porsi}
                onChange={(value) => set("makan_pagi_porsi", value)}
              />
              <input
                value={form.makan_pagi_menu}
                onChange={(event) => set("makan_pagi_menu", event.target.value)}
                placeholder="Menu makan pagi"
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
              <Textarea
                value={form.makan_pagi_catatan}
                onChange={(value) => set("makan_pagi_catatan", value)}
                placeholder="Catatan makan pagi"
              />
            </div>

            <div className="space-y-3 p-4 bg-[#FFFDF7] rounded-2xl border border-[#FFE26F]/20">
              <p className="text-sm font-bold">Makan Siang</p>
              <PillSelect
                options={porsiOptions}
                value={form.makan_siang_porsi}
                onChange={(value) => set("makan_siang_porsi", value)}
              />
              <input
                value={form.makan_siang_menu}
                onChange={(event) => set("makan_siang_menu", event.target.value)}
                placeholder="Menu makan siang"
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
              <Textarea
                value={form.makan_siang_catatan}
                onChange={(value) => set("makan_siang_catatan", value)}
                placeholder="Catatan makan siang"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={form.snack_pagi}
                onChange={(event) => set("snack_pagi", event.target.value)}
                placeholder="Snack pagi"
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
              <input
                value={form.snack_sore}
                onChange={(event) => set("snack_sore", event.target.value)}
                placeholder="Snack sore"
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">🌙 Tidur & Toilet</h2>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="time"
                value={form.tidur_mulai}
                onChange={(event) => set("tidur_mulai", event.target.value)}
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
              <input
                type="time"
                value={form.tidur_selesai}
                onChange={(event) => set("tidur_selesai", event.target.value)}
                className="w-full border rounded-xl px-4 py-2 text-sm"
              />
            </div>

            <PillSelect
              options={tidurOptions}
              value={form.tidur_kualitas}
              onChange={(value) => set("tidur_kualitas", value)}
            />

            <PillSelect
              options={toiletOptions}
              value={form.toilet}
              onChange={(value) => set("toilet", value)}
            />

            <Textarea
              value={form.toilet_frekuensi}
              onChange={(value) => set("toilet_frekuensi", value)}
              placeholder="Catatan toilet"
            />
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">😊 Mood</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {moodOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => set("mood", option.value)}
                  className={`rounded-2xl border p-4 text-center ${
                    form.mood === option.value
                      ? "bg-[#1883FF] text-white border-[#1883FF]"
                      : "bg-white border-[#E8E4DB]"
                  }`}
                >
                  <p className="text-2xl">{option.emoji}</p>
                  <p className="text-xs font-bold mt-1">{option.label}</p>
                </button>
              ))}
            </div>

            <Textarea
              value={form.mood_catatan}
              onChange={(value) => set("mood_catatan", value)}
              placeholder="Catatan mood anak"
            />
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">📚 Aktivitas</h2>

            <div className="flex flex-wrap gap-2">
              {aktivitasPilihan.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAktivitas(item)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                    form.aktivitas_belajar.includes(item)
                      ? "bg-[#C4E02F] border-[#C4E02F] text-[#1A1A1A]"
                      : "bg-white border-[#E8E4DB] text-[#4A4A4A]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <Textarea
              value={form.bermain_catatan}
              onChange={(value) => set("bermain_catatan", value)}
              placeholder="Catatan bermain"
            />
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">💬 Catatan & Foto</h2>

            <Textarea
              value={form.catatan_umum}
              onChange={(value) => set("catatan_umum", value)}
              placeholder="Catatan umum untuk orang tua"
            />

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFoto}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-[#FFE26F] rounded-2xl py-6 text-sm font-bold text-[#4A4A4A]"
            >
              + Upload Foto
            </button>

            {form.foto.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {form.foto.map((foto, index) => (
                  <div key={foto.url} className="relative">
                    <img
                      src={foto.url}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="w-full rounded-2xl py-4 font-bold text-sm bg-[#1883FF] text-white disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan / Update Daily Log"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
        <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          Daily Log Pengasuh
        </p>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mt-2">
          Input Daily Log Anak
        </h1>
        <p className="text-sm text-[#4A4A4A] mt-1">
          Pilih anak, isi laporan harian, lalu orang tua bisa langsung melihatnya.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-5 border border-[#FFE26F]/40">
          <p className="text-xs text-[#4A4A4A]">Sudah diisi</p>
          <p className="text-3xl font-black text-[#4a7500]">{done}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#FFE26F]/40">
          <p className="text-xs text-[#4A4A4A]">Belum diisi</p>
          <p className="text-3xl font-black text-[#a07000]">{belum}</p>
        </div>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari nama anak..."
        className="w-full bg-white border border-[#FFE26F]/40 rounded-2xl px-4 py-3 text-sm"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredAnak.map((anak) => (
          <button
            type="button"
            key={anak.id}
            onClick={() => handleSelect(anak)}
            className="bg-white rounded-2xl p-5 border border-[#FFE26F]/40 text-left hover:border-[#1883FF] transition-all"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-bold text-[#1A1A1A]">{anak.full_name}</p>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  {anak.program ?? "Program belum dipilih"}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${
                  anak.logDone
                    ? "bg-[#C4E02F]/20 text-[#4a7500]"
                    : "bg-[#FEB700]/20 text-[#a07000]"
                }`}
              >
                {anak.logDone ? "Sudah" : "Belum"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredAnak.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#FFE26F]/40">
          <p className="font-bold text-[#1A1A1A]">Tidak ada anak ditemukan</p>
        </div>
      )}
    </div>
  );
}