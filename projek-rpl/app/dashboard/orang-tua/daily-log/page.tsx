"use client";

import { useState, useEffect } from "react";
import {
  getChildrenByParent,
  getDailyLogDates,
  getDailyLogByDate,
  type Child,
  type DailyLog,
} from "@/lib/services/dailyLogs";
import { supabase } from "@/lib/supabase";

// ── Types ────────────────────────────────────────────────────────────────────
type Mood = "senang" | "biasa" | "rewel" | "mengantuk";
type PortiMakan = "habis" | "setengah" | "sedikit" | "tidak";
type TidurKualitas = "nyenyak" | "gelisah" | "tidak";
type ToiletStatus = "mandiri" | "dibantu" | "belum" | "tidak";

// ── Config ───────────────────────────────────────────────────────────────────
const moodConfig: Record<Mood, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  senang:    { label: "Senang",    emoji: "😊", color: "#4a7500", bg: "#C4E02F18", border: "#C4E02F44" },
  biasa:     { label: "Biasa",     emoji: "😐", color: "#1883FF", bg: "#1883FF12", border: "#1883FF33" },
  rewel:     { label: "Rewel",     emoji: "😢", color: "#a0306a", bg: "#FFA9DD18", border: "#FFA9DD44" },
  mengantuk: { label: "Mengantuk", emoji: "😴", color: "#a07000", bg: "#FEB70018", border: "#FEB70033" },
};

const porsiConfig: Record<PortiMakan, { label: string; color: string; bg: string; bar: number }> = {
  habis:    { label: "Habis",    color: "#4a7500", bg: "#C4E02F18", bar: 100 },
  setengah: { label: "Setengah", color: "#a07000", bg: "#FEB70018", bar: 50  },
  sedikit:  { label: "Sedikit",  color: "#aa3366", bg: "#FFA9DD18", bar: 25  },
  tidak:    { label: "Tidak",    color: "#999",    bg: "#F0EDE6",   bar: 0   },
};

const tidurConfig: Record<TidurKualitas, { label: string; emoji: string; color: string }> = {
  nyenyak: { label: "Nyenyak",     emoji: "😴", color: "#4a7500" },
  gelisah: { label: "Gelisah",     emoji: "😟", color: "#a07000" },
  tidak:   { label: "Tidak Tidur", emoji: "😑", color: "#aa3366" },
};

const toiletConfig: Record<ToiletStatus, { label: string; color: string; bg: string }> = {
  mandiri: { label: "Mandiri 🎉", color: "#4a7500", bg: "#C4E02F18" },
  dibantu: { label: "Dibantu",    color: "#a07000", bg: "#FEB70018" },
  belum:   { label: "Belum",      color: "#aa3366", bg: "#FFA9DD18" },
  tidak:   { label: "Tidak",      color: "#999",    bg: "#F0EDE6"   },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({ icon, title, color, children }: {
  icon: string; title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: color + "20" }}>
          {icon}
        </div>
        <h2 className="font-bold text-[#1A1A1A] text-[15px]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MakanRow({ label, porsi, menu, catatan }: {
  label: string; porsi: PortiMakan; menu: string; catatan: string;
}) {
  const cfg = porsiConfig[porsi];
  return (
    <div className="space-y-2 p-4 rounded-2xl" style={{ background: cfg.bg }}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold text-[#1A1A1A]">{label}</p>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ color: cfg.color, background: cfg.bg }}>
          {cfg.label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cfg.bar}%`, background: cfg.color }} />
      </div>
      {menu && menu !== "-" && <p className="text-[12px] text-[#4A4A4A] font-medium">🍽 {menu}</p>}
      {catatan && <p className="text-[11px] text-[#4A4A4A] italic font-light">"{catatan}"</p>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0EDE6]" />
            <div className="h-4 w-32 rounded-lg bg-[#F0EDE6]" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-[#F0EDE6]" />
            <div className="h-3 w-3/4 rounded bg-[#F0EDE6]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DailyLogOrangTua() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil parentId dari session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setParentId(data.user.id);
    });
  }, []);

  // Ambil daftar anak
  useEffect(() => {
    if (!parentId) return;
    setLoadingChildren(true);
    getChildrenByParent(parentId)
      .then((data) => {
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]);
      })
      .catch(() => setError("Gagal memuat data anak."))
      .finally(() => setLoadingChildren(false));
  }, [parentId]);

  // Ambil daftar tanggal saat anak berubah
  useEffect(() => {
    if (!selectedChild) return;
    setLoadingDates(true);
    setDates([]);
    setSelectedDate("");
    setLog(null);
    getDailyLogDates(selectedChild.id)
      .then((d) => {
        setDates(d);
        if (d.length > 0) setSelectedDate(d[0]);
      })
      .catch(() => setError("Gagal memuat tanggal log."))
      .finally(() => setLoadingDates(false));
  }, [selectedChild]);

  // Ambil log saat tanggal berubah
  useEffect(() => {
    if (!selectedChild || !selectedDate) return;
    setLoadingLog(true);
    getDailyLogByDate(selectedChild.id, selectedDate)
      .then(setLog)
      .catch(() => setError("Gagal memuat log harian."))
      .finally(() => setLoadingLog(false));
  }, [selectedChild, selectedDate]);

  const mood = log?.mood ? moodConfig[log.mood as Mood] : null;
  const tidur = log?.tidur_kualitas ? tidurConfig[log.tidur_kualitas as TidurKualitas] : null;
  const toilet = log?.toilet ? toiletConfig[log.toilet as ToiletStatus] : null;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-red-100 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-[15px] font-bold text-[#1A1A1A]">{error}</p>
        <button onClick={() => setError(null)} className="mt-4 text-sm text-[#1883FF] underline">Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFE26F]/20 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1883FF]/10 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FFE26F]/30 border border-[#FFE26F] rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
              <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Laporan Harian</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Daily Log {selectedChild ? selectedChild.full_name : "—"}
            </h1>
          </div>
          {selectedDate && (
            <div className="flex items-center gap-2 bg-[#1883FF]/10 border border-[#1883FF]/20 rounded-2xl px-4 py-3">
              <span className="text-[#1883FF]">📅</span>
              <span className="text-sm font-bold text-[#1883FF]">{formatDate(selectedDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CHILD SELECTOR ── */}
      {loadingChildren ? (
        <div className="flex gap-3 animate-pulse">
          {[1, 2].map(i => <div key={i} className="h-10 w-28 rounded-2xl bg-[#F0EDE6]" />)}
        </div>
      ) : children.length > 1 && (
        <div>
          <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-3 ml-1">Pilih Anak</p>
          <div className="flex gap-2 flex-wrap">
            {children.map((child) => {
              const isSelected = child.id === selectedChild?.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-4 py-2 rounded-2xl border-2 font-semibold text-sm transition-all
                    ${isSelected
                      ? "bg-[#1883FF] border-[#1883FF] text-white shadow-lg shadow-[#1883FF]/25"
                      : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]/40"}`}
                >
                  {child.full_name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DATE SELECTOR ── */}
      {loadingDates ? (
        <div className="flex gap-2 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 w-14 rounded-2xl bg-[#F0EDE6]" />)}
        </div>
      ) : dates.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-3 ml-1">Pilih Tanggal</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d) => {
              const isSelected = d === selectedDate;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`flex flex-col items-center px-4 py-3 rounded-2xl border-2 font-semibold transition-all whitespace-nowrap shrink-0
                    ${isSelected
                      ? "bg-[#1883FF] border-[#1883FF] text-white shadow-lg shadow-[#1883FF]/25"
                      : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]/40"}`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                    {new Date(d).toLocaleDateString("id-ID", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-bold leading-tight">{new Date(d).getDate()}</span>
                  <span className="text-[10px] opacity-70">
                    {new Date(d).toLocaleDateString("id-ID", { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LOADING LOG ── */}
      {loadingLog && <Skeleton />}

      {/* ── EMPTY STATE ── */}
      {!loadingLog && !loadingDates && dates.length === 0 && selectedChild && (
        <div className="bg-white rounded-[2rem] p-12 border border-[#FFE26F]/40 shadow-sm text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-[15px] font-bold text-[#1A1A1A]">Belum ada laporan</p>
          <p className="text-[13px] text-[#4A4A4A] mt-1 font-light">
            Belum ada daily log untuk {selectedChild.full_name}
          </p>
        </div>
      )}

      {!loadingLog && selectedDate && !log && dates.length > 0 && (
        <div className="bg-white rounded-[2rem] p-12 border border-[#FFE26F]/40 shadow-sm text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-[15px] font-bold text-[#1A1A1A]">Belum ada laporan</p>
          <p className="text-[13px] text-[#4A4A4A] mt-1 font-light">Log untuk tanggal ini belum diisi</p>
        </div>
      )}

      {/* ── CONTENT ── */}
      {!loadingLog && log && (
        <div className="space-y-6">

          {/* MOOD HERO */}
          {mood && (
            <div className="rounded-[2rem] p-6 border-2 flex items-center gap-5"
              style={{ background: mood.bg, borderColor: mood.border }}>
              <div className="text-5xl">{mood.emoji}</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-1">Mood Hari Ini</p>
                <p className="text-2xl font-black" style={{ color: mood.color }}>{mood.label}</p>
                {log.mood_catatan && (
                  <p className="text-[13px] text-[#4A4A4A] mt-1 font-light italic">"{log.mood_catatan}"</p>
                )}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">

            {/* MAKAN */}
            <SectionCard icon="🍽️" title="Makan & Minum" color="#FEB700">
              <div className="space-y-3">
                {log.makan_pagi_porsi && (
                  <MakanRow
                    label="Makan Pagi"
                    porsi={log.makan_pagi_porsi as PortiMakan}
                    menu={log.makan_pagi_menu ?? ""}
                    catatan={log.makan_pagi_catatan ?? ""}
                  />
                )}
                {log.makan_siang_porsi && (
                  <MakanRow
                    label="Makan Siang"
                    porsi={log.makan_siang_porsi as PortiMakan}
                    menu={log.makan_siang_menu ?? ""}
                    catatan={log.makan_siang_catatan ?? ""}
                  />
                )}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { label: "Snack Pagi", value: log.snack_pagi },
                    { label: "Snack Sore", value: log.snack_sore },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-[#FFF8E8] border border-[#FFE26F]/30">
                      <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-[13px] font-semibold text-[#1A1A1A]">
                        {value && value !== "-" ? value : <span className="text-[#ccc] font-normal">–</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* TIDUR & TOILET */}
            <div className="space-y-4">
              <SectionCard icon="🌙" title="Tidur Siang" color="#99ADFF">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#99ADFF]/10">
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">Mulai</p>
                      <p className="text-xl font-black text-[#1A1A1A]">{log.tidur_mulai?.slice(0, 5) || "–"}</p>
                    </div>
                    <div className="text-[#99ADFF] text-xl">→</div>
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">Bangun</p>
                      <p className="text-xl font-black text-[#1A1A1A]">{log.tidur_selesai?.slice(0, 5) || "–"}</p>
                    </div>
                  </div>

                  {log.tidur_mulai && log.tidur_selesai && (() => {
                    const [hM, mM] = log.tidur_mulai!.split(":").map(Number);
                    const [hS, mS] = log.tidur_selesai!.split(":").map(Number);
                    const dur = (hS * 60 + mS) - (hM * 60 + mM);
                    if (dur <= 0) return null;
                    return (
                      <p className="text-[12px] text-center text-[#4A4A4A] font-medium">
                        Durasi: <strong className="text-[#1A1A1A]">{Math.floor(dur / 60)}j {dur % 60}m</strong>
                      </p>
                    );
                  })()}

                  {tidur && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F0]">
                      <p className="text-[12px] font-semibold text-[#4A4A4A]">Kualitas Tidur</p>
                      <span className="text-[13px] font-bold" style={{ color: tidur.color }}>
                        {tidur.emoji} {tidur.label}
                      </span>
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard icon="🚽" title="Toilet Training" color="#1883FF">
                {toilet && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: toilet.bg }}>
                      <p className="text-[12px] font-semibold text-[#4A4A4A]">Status</p>
                      <span className="text-[13px] font-bold" style={{ color: toilet.color }}>{toilet.label}</span>
                    </div>
                    {log.toilet_frekuensi && (
                      <p className="text-[12px] text-[#4A4A4A] font-medium px-1">{log.toilet_frekuensi}</p>
                    )}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* AKTIVITAS */}
            <SectionCard icon="📚" title="Aktivitas Belajar" color="#C4E02F">
              <div className="space-y-4">
                {log.aktivitas_belajar && log.aktivitas_belajar.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {log.aktivitas_belajar.map((item) => (
                      <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold"
                        style={{ background: "#C4E02F18", color: "#4a7500", border: "1px solid #C4E02F44" }}>
                        <span className="text-[10px]">✓</span> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[#ccc]">Tidak ada aktivitas tercatat</p>
                )}

                {log.bermain_catatan && (
                  <div>
                    <p className="text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Bermain Bebas</p>
                    <div className="p-3 rounded-xl bg-[#FFA9DD]/10 border border-[#FFA9DD]/20">
                      <p className="text-[13px] text-[#4A4A4A] font-medium leading-relaxed">🧸 {log.bermain_catatan}</p>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* CATATAN PENGASUH */}
            {log.catatan_umum && (
              <SectionCard icon="💬" title="Catatan Pengasuh" color="#C4E02F">
                <div className="relative bg-[#FFFDF7] border border-[#FFE26F]/40 rounded-2xl p-5">
                  <div className="absolute top-4 left-4 w-1 h-[calc(100%-2rem)] bg-[#FFE26F] rounded-full" />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed pl-4 font-light italic">
                    "{log.catatan_umum}"
                  </p>
                </div>
              </SectionCard>
            )}

          </div>
        </div>
      )}
    </div>
  );
}