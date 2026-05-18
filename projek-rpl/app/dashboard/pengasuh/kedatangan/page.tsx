"use client";

import { useState } from "react";

type CheckInStatus = "belum" | "hadir" | "izin" | "sakit";

const STATUS_CONFIG: Record<CheckInStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  belum: {
    label: "Belum Check-in",
    color: "#FEB700",
    bg: "bg-[#FFE26F]/20",
    border: "border-[#FFE26F]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  hadir: {
    label: "Sudah Hadir",
    color: "#4a7500",
    bg: "bg-[#C4E02F]/15",
    border: "border-[#C4E02F]/40",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4E02F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  izin: {
    label: "Izin Tidak Hadir",
    color: "#3344aa",
    bg: "bg-[#99ADFF]/15",
    border: "border-[#99ADFF]/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#99ADFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  sakit: {
    label: "Sakit",
    color: "#aa3366",
    bg: "bg-[#FFA9DD]/15",
    border: "border-[#FFA9DD]/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFA9DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
};

interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  programJam: string;
  status: CheckInStatus;
  jamCheckin: string | null;
  keterangan: string | null;
}

const initialChildren: Child[] = [
  { id: 1, name: "Almira Zahra",  kelas: "Rainbow Room",   avatar: "AZ", programJam: "07:00–17:00", status: "hadir",  jamCheckin: "07:15", keterangan: null             },
  { id: 2, name: "Andra Pratama", kelas: "Rainbow Room",   avatar: "AP", programJam: "07:00–17:00", status: "hadir",  jamCheckin: "07:22", keterangan: null             },
  { id: 3, name: "Budi Wijaya",   kelas: "Rainbow Room",   avatar: "BW", programJam: "07:00–17:00", status: "belum",  jamCheckin: null,    keterangan: null             },
  { id: 4, name: "Lana Safira",   kelas: "Sunshine Class", avatar: "LS", programJam: "07:00–12:00", status: "hadir",  jamCheckin: "07:30", keterangan: null             },
  { id: 5, name: "Rina Putri",    kelas: "Star Class",     avatar: "RP", programJam: "07:00–17:00", status: "sakit",  jamCheckin: null,    keterangan: "Demam"          },
  { id: 6, name: "Dani Saputra",  kelas: "Sunshine Class", avatar: "DS", programJam: "07:00–12:00", status: "belum",  jamCheckin: null,    keterangan: null             },
  { id: 7, name: "Maya Sari",     kelas: "Rainbow Room",   avatar: "MS", programJam: "07:00–17:00", status: "izin",   jamCheckin: null,    keterangan: "Acara keluarga" },
  { id: 8, name: "Citra Dewi",    kelas: "Sunshine Class", avatar: "CD", programJam: "07:00–12:00", status: "belum",  jamCheckin: null,    keterangan: null             },
  { id: 9, name: "Rafi Akbar",    kelas: "Star Class",     avatar: "RA", programJam: "08:00–11:00", status: "belum",  jamCheckin: null,    keterangan: null             },
];

type ModalState =
  | { type: "checkin"; child: Child }
  | { type: "absen";   child: Child }
  | null;

const avatarBg: Record<string, string> = {
  "Rainbow Room":   "#1883FF",
  "Sunshine Class": "#FEB700",
  "Star Class":     "#FFA9DD",
};

export default function PengasuhKedatanganPage() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [modal, setModal]             = useState<ModalState>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [jenisAbsen, setJenisAbsen]   = useState<"izin" | "sakit">("izin");
  const [alasanAbsen, setAlasanAbsen] = useState("");
  const [loadingId, setLoadingId]     = useState<number | null>(null);

  const hadir = children.filter((c) => c.status === "hadir").length;
  const belum = children.filter((c) => c.status === "belum").length;
  const absen = children.filter((c) => c.status === "izin" || c.status === "sakit").length;
  const total = children.length;

  // Anak yang sedang difokuskan (default: pertama yang belum)
  const focusChild = selectedChild ?? children.find((c) => c.status === "belum") ?? children[0];
  const focusCfg   = STATUS_CONFIG[focusChild.status];

  const handleCheckIn = () => {
    if (!modal || modal.type !== "checkin") return;
    setLoadingId(modal.child.id);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setChildren((prev) =>
        prev.map((c) =>
          c.id === modal.child.id ? { ...c, status: "hadir", jamCheckin: now, keterangan: null } : c
        )
      );
      if (selectedChild?.id === modal.child.id) {
        setSelectedChild((prev) => prev ? { ...prev, status: "hadir", jamCheckin: now, keterangan: null } : prev);
      }
      setLoadingId(null);
      setModal(null);
    }, 700);
  };

  const handleAbsen = () => {
    if (!modal || modal.type !== "absen") return;
    setChildren((prev) =>
      prev.map((c) =>
        c.id === modal.child.id
          ? { ...c, status: jenisAbsen, jamCheckin: null, keterangan: alasanAbsen || null }
          : c
      )
    );
    if (selectedChild?.id === modal.child.id) {
      setSelectedChild((prev) => prev ? { ...prev, status: jenisAbsen, keterangan: alasanAbsen || null } : prev);
    }
    setModal(null);
    setAlasanAbsen("");
    setJenisAbsen("izin");
  };

  return (
    <div className="space-y-8">

      {/* ── MODAL CHECK-IN ── */}
      {modal?.type === "checkin" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setModal(null)}
        >
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-9" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#E8E4DB] rounded-full mx-auto mb-6" />
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0"
                style={{ background: avatarBg[modal.child.kelas] + "20", color: avatarBg[modal.child.kelas] }}
              >
                {modal.child.avatar}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#1A1A1A]">{modal.child.name}</p>
                <p className="text-[12px] text-[#4A4A4A] mt-0.5">{modal.child.kelas} · {modal.child.programJam}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#C4E02F]/10 border border-[#C4E02F]/40 rounded-2xl p-4 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a7500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-[12px] text-[#4a7500] font-semibold leading-snug">
                Waktu check-in akan dicatat otomatis sesuai jam sekarang
              </p>
            </div>
            <div className="flex justify-between items-center bg-[#F4F6FA] rounded-xl px-4 py-3 mb-6">
              <span className="text-[12px] text-[#4A4A4A] font-semibold">Jam Check-in</span>
              <span className="text-[18px] font-bold text-[#1A1A1A]">
                {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-4 border border-[#E8E4DB] rounded-2xl text-[13px] font-bold text-[#4A4A4A] hover:bg-[#F4F6FA] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCheckIn}
                disabled={loadingId === modal.child.id}
                className="flex-[2] py-4 bg-[#1A1A1A] text-[#C4E02F] rounded-2xl text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loadingId === modal.child.id ? "Menyimpan..." : "✓ Konfirmasi Check-in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ABSEN ── */}
      {modal?.type === "absen" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setModal(null)}
        >
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-9" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#E8E4DB] rounded-full mx-auto mb-6" />
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0"
                style={{ background: avatarBg[modal.child.kelas] + "20", color: avatarBg[modal.child.kelas] }}
              >
                {modal.child.avatar}
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#1A1A1A]">{modal.child.name}</p>
                <p className="text-[12px] text-[#4A4A4A] mt-0.5">{modal.child.kelas} · {modal.child.programJam}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Jenis Ketidakhadiran</p>
            <div className="flex gap-3 mb-4">
              {(["izin", "sakit"] as const).map((j) => (
                <button
                  key={j}
                  onClick={() => setJenisAbsen(j)}
                  className="flex-1 py-3 rounded-xl border-2 text-[13px] font-bold transition-all"
                  style={{
                    borderColor: jenisAbsen === j ? (j === "izin" ? "#99ADFF" : "#FFA9DD") : "#E8E4DB",
                    background:  jenisAbsen === j ? (j === "izin" ? "#99ADFF18" : "#FFA9DD18") : "#fff",
                    color:       jenisAbsen === j ? (j === "izin" ? "#3344aa"  : "#aa3366")  : "#4A4A4A",
                  }}
                >
                  {j === "izin" ? "📋 Izin" : "🤒 Sakit"}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-2">Keterangan (opsional)</p>
            <textarea
              value={alasanAbsen}
              onChange={(e) => setAlasanAbsen(e.target.value)}
              placeholder={jenisAbsen === "izin" ? "Contoh: Acara keluarga..." : "Contoh: Demam, flu..."}
              className="w-full px-4 py-3 border border-[#E8E4DB] rounded-xl text-[13px] text-[#1A1A1A] resize-none focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 mb-5"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-4 border border-[#E8E4DB] rounded-2xl text-[13px] font-bold text-[#4A4A4A] hover:bg-[#F4F6FA] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAbsen}
                className="flex-[2] py-4 rounded-2xl text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: jenisAbsen === "izin" ? "#99ADFF" : "#FFA9DD" }}
              >
                Simpan Ketidakhadiran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C4E02F]/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1883FF]/10 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C4E02F]/20 border border-[#C4E02F]/30 rounded-full px-3 py-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C4E02F] animate-pulse" />
            <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Kehadiran Hari Ini</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Check-in Anak</h1>
          <p className="text-[#4A4A4A] text-sm font-light mt-1">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}Jam masuk 07:00 WIB
          </p>

          {/* Mini stat row */}
          <div className="flex gap-4 mt-4">
            {[
              { label: "Hadir",  value: hadir, color: "#4a7500",  dot: "#C4E02F" },
              { label: "Belum",  value: belum, color: "#a07000",  dot: "#FFE26F" },
              { label: "Absen",  value: absen, color: "#aa3366",  dot: "#FFA9DD" },
              { label: "Total",  value: total, color: "#1883FF",  dot: "#1883FF" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                <span className="text-[13px] font-black" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[11px] text-[#4A4A4A] font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATUS CARD (focused child) ── */}
      <div className={`${focusCfg.bg} border-2 ${focusCfg.border} rounded-[2rem] p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            {focusCfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5">Status Terpilih</p>
            <p className="text-xl font-black truncate" style={{ color: focusCfg.color }}>{focusCfg.label}</p>
            <p className="text-[12px] text-[#4A4A4A] mt-0.5 font-medium">{focusChild.name} · {focusChild.kelas}</p>
          </div>
          {focusChild.jamCheckin && (
            <div className="text-right shrink-0">
              <p className="text-[10px] text-[#4A4A4A] uppercase tracking-wider font-semibold">Check-in</p>
              <p className="text-2xl font-black text-[#1A1A1A]">{focusChild.jamCheckin}</p>
              <p className="text-[10px] text-[#4A4A4A]">WIB</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#4A4A4A]">Progress kehadiran</span>
            <span className="text-[11px] font-bold" style={{ color: focusCfg.color }}>{hadir}/{total} anak</span>
          </div>
          <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${total ? (hadir / total) * 100 : 0}%`, background: "#C4E02F" }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── DAFTAR ANAK ── */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#1883FF]/10 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Daftar Anak</h2>
          </div>

          <div className="space-y-2">
            {children.map((child) => {
              const cfg = STATUS_CONFIG[child.status];
              const isSelected = focusChild.id === child.id;

              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99]
                    ${isSelected
                      ? "border-[#1883FF] bg-[#1883FF]/5"
                      : "border-[#FFE26F]/40 bg-white hover:border-[#1883FF]/30"
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: avatarBg[child.kelas] + "20", color: avatarBg[child.kelas] }}
                  >
                    {child.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{child.name}</p>
                    <p className="text-[11px] text-[#4A4A4A] font-light">{child.kelas}</p>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0 text-right">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: cfg.bg.replace("bg-", "").replace("/15", "25").replace("/20", "25"), color: cfg.color }}
                    >
                      {child.status === "hadir" ? `✓ ${child.jamCheckin}` : cfg.label.split(" ")[0]}
                    </span>
                    {child.keterangan && (
                      <p className="text-[9px] text-[#4A4A4A] mt-0.5">{child.keterangan}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── AKSI CHECK-IN ── */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C4E02F]/20 rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a7500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-bold text-[#1A1A1A]">Aksi Kehadiran</h2>
          </div>

          {/* Selected child detail */}
          <div className={`${focusCfg.bg} border ${focusCfg.border} rounded-2xl p-4 flex items-center gap-4`}>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: avatarBg[focusChild.kelas] + "30", color: avatarBg[focusChild.kelas] }}
            >
              {focusChild.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#1A1A1A]">{focusChild.name}</p>
              <p className="text-[12px] text-[#4A4A4A]">{focusChild.kelas} · {focusChild.programJam}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: focusCfg.color + "20" }}>
              {focusCfg.icon}
            </div>
          </div>

          {focusChild.status === "hadir" ? (
            // Already checked in
            <div className="bg-[#C4E02F]/15 border border-[#C4E02F]/40 rounded-2xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-[#C4E02F] rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-[#1A1A1A]">Sudah Check-in</p>
              <p className="text-sm text-[#4A4A4A] font-light">
                {focusChild.name} tercatat hadir pukul{" "}
                <strong className="text-[#1A1A1A]">{focusChild.jamCheckin} WIB</strong>
              </p>
            </div>
          ) : focusChild.status === "izin" || focusChild.status === "sakit" ? (
            // Absen state
            <div
              className="rounded-2xl p-5 text-center space-y-3"
              style={{
                background: focusChild.status === "izin" ? "#99ADFF18" : "#FFA9DD18",
                border: `1px solid ${focusChild.status === "izin" ? "#99ADFF40" : "#FFA9DD40"}`,
              }}
            >
              <p className="text-2xl">{focusChild.status === "izin" ? "📋" : "🤒"}</p>
              <p className="font-bold text-[#1A1A1A]">
                {focusChild.status === "izin" ? "Izin Tidak Hadir" : "Sakit"}
              </p>
              {focusChild.keterangan && (
                <p className="text-sm text-[#4A4A4A] font-light">{focusChild.keterangan}</p>
              )}
              <button
                onClick={() => setModal({ type: "checkin", child: focusChild })}
                className="w-full py-3 border-2 border-[#1883FF]/30 rounded-xl text-[13px] font-bold text-[#1883FF] hover:bg-[#1883FF]/5 transition-colors"
              >
                Batalkan & Check-in
              </button>
            </div>
          ) : (
            // Belum hadir — tampilkan tombol aksi
            <div className="space-y-3">
              <p className="text-[12px] text-[#4A4A4A] font-medium">
                Pilih tindakan untuk <strong className="text-[#1A1A1A]">{focusChild.name}</strong>:
              </p>

              <button
                onClick={() => setModal({ type: "checkin", child: focusChild })}
                disabled={loadingId === focusChild.id}
                className="w-full py-4 bg-[#1A1A1A] text-[#C4E02F] rounded-2xl font-bold text-base transition-all active:scale-95 hover:opacity-90 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                {loadingId === focusChild.id ? "Menyimpan..." : "Check-in Sekarang"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setJenisAbsen("izin"); setModal({ type: "absen", child: focusChild }); }}
                  className="py-3 border-2 border-[#99ADFF]/40 rounded-2xl text-[13px] font-bold text-[#3344aa] hover:bg-[#99ADFF]/10 transition-colors"
                >
                  📋 Izin
                </button>
                <button
                  onClick={() => { setJenisAbsen("sakit"); setModal({ type: "absen", child: focusChild }); }}
                  className="py-3 border-2 border-[#FFA9DD]/40 rounded-2xl text-[13px] font-bold text-[#aa3366] hover:bg-[#FFA9DD]/10 transition-colors"
                >
                  🤒 Sakit
                </button>
              </div>

              <p className="text-[11px] text-[#4A4A4A]/60 text-center font-light">
                Atau tap nama anak lain di daftar untuk beralih
              </p>
            </div>
          )}

          {/* Riwayat hari ini */}
          <div>
            <p className="text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider mb-3">Sudah Check-in Hari Ini</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {children.filter((c) => c.status === "hadir").length === 0 ? (
                <p className="text-[12px] text-[#4A4A4A]/40 text-center py-4">Belum ada yang check-in</p>
              ) : (
                children
                  .filter((c) => c.status === "hadir")
                  .map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF7] border border-[#FFE26F]/30">
                      <div className="w-8 h-8 bg-[#C4E02F]/20 rounded-xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#4a7500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#1A1A1A] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#4A4A4A] font-light">{c.kelas}</p>
                      </div>
                      <span className="text-[13px] font-black text-[#1883FF] shrink-0">{c.jamCheckin}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}