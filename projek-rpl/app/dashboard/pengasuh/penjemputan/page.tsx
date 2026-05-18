"use client";

import { useState, useRef } from "react";
import { Search, Clock, CheckCircle2, Car, Camera, X, Image as ImageIcon, Send, UserX, Lock } from "lucide-react";

type CheckInStatus = "belum" | "hadir" | "izin" | "sakit";
type PickupStatus  = "menunggu" | "dijemput";

interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  avatarColor: string;
  jamMasuk: string | null;
  checkInStatus: CheckInStatus;
  penjemput: string;
  status: PickupStatus;
  jamJemput: string | null;
  fotoPenjemputan: string | null;
}

const initialChildren: Child[] = [
  { id: 1, name: "Andra Pratama", kelas: "Rainbow Room",   avatar: "AP", avatarColor: "#1883FF", jamMasuk: "07:10", checkInStatus: "hadir",  penjemput: "Ayah",  status: "dijemput", jamJemput: "15:30", fotoPenjemputan: null },
  { id: 2, name: "Lana Safira",   kelas: "Sunshine Class", avatar: "LS", avatarColor: "#FEB700", jamMasuk: "07:25", checkInStatus: "hadir",  penjemput: "Ibu",   status: "dijemput", jamJemput: "15:45", fotoPenjemputan: null },
  { id: 3, name: "Budi Wijaya",   kelas: "Rainbow Room",   avatar: "BW", avatarColor: "#1883FF", jamMasuk: null,    checkInStatus: "belum",  penjemput: "Ayah",  status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 4, name: "Rina Putri",    kelas: "Star Class",     avatar: "RP", avatarColor: "#FFA9DD", jamMasuk: "07:15", checkInStatus: "hadir",  penjemput: "Ibu",   status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 5, name: "Dani Saputra",  kelas: "Sunshine Class", avatar: "DS", avatarColor: "#FEB700", jamMasuk: "07:40", checkInStatus: "hadir",  penjemput: "Nenek", status: "dijemput", jamJemput: "16:00", fotoPenjemputan: null },
  { id: 6, name: "Maya Sari",     kelas: "Rainbow Room",   avatar: "MS", avatarColor: "#1883FF", jamMasuk: null,    checkInStatus: "belum",  penjemput: "Ayah",  status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 7, name: "Citra Dewi",    kelas: "Sunshine Class", avatar: "CD", avatarColor: "#FEB700", jamMasuk: "07:22", checkInStatus: "hadir",  penjemput: "Kakek", status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 8, name: "Rafi Akbar",    kelas: "Star Class",     avatar: "RA", avatarColor: "#FFA9DD", jamMasuk: null,    checkInStatus: "sakit",  penjemput: "Ibu",   status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
];

// ─── Modal Upload Foto ────────────────────────────────────────────────────────
function UploadFotoModal({
  child,
  onClose,
  onConfirm,
}: {
  child: Child;
  onClose: () => void;
  onConfirm: (id: number, fotoUrl: string | null) => void;
}) {
  const [preview, setPreview]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [skipFoto, setSkipFoto] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSkipFoto(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => onConfirm(child.id, skipFoto ? null : preview), 1000);
    }, 900);
  };

  const canConfirm = (preview !== null || skipFoto) && !loading && !done;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white w-full max-w-md overflow-hidden"
        style={{
          borderRadius: "28px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1.5px solid #F0EDE6",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: child.avatarColor + "22",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 800, color: child.avatarColor,
              }}
            >
              {child.avatar}
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Foto Penjemputan</p>
              <p style={{ fontSize: "11px", color: "#4A4A4A", margin: "2px 0 0", fontWeight: 500 }}>
                {child.name} · Dijemput {child.penjemput}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "#F7F5F0", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#4A4A4A", transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FFE8E8"; e.currentTarget.style.color = "#cc3333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#F7F5F0"; e.currentTarget.style.color = "#4A4A4A"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "12px", color: "#4A4A4A", lineHeight: "1.6", margin: 0, fontWeight: 500 }}>
            Ambil atau upload foto sebagai bukti penjemputan. Foto akan otomatis dikirim ke orang tua.
          </p>

          {/* Upload area */}
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                height: "160px", border: "2px dashed #1883FF44", borderRadius: "16px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "10px", cursor: "pointer", background: "#F7FBFF",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1883FF"; e.currentTarget.style.background = "#EBF4FF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1883FF44"; e.currentTarget.style.background = "#F7FBFF"; }}
            >
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: "#1883FF15", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Camera size={24} color="#1883FF" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1883FF", margin: 0 }}>Ambil / Upload Foto</p>
                <p style={{ fontSize: "11px", color: "#999", margin: "3px 0 0", fontWeight: 500 }}>JPG, PNG · Maks 5MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img src={preview} alt="Preview" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "16px", border: "1.5px solid #F0EDE6" }} />
              <button
                onClick={() => { setPreview(null); setSkipFoto(false); }}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#4A4A4A",
                }}
              >
                <X size={13} />
              </button>
              <div style={{
                position: "absolute", bottom: "8px", left: "8px",
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                borderRadius: "8px", padding: "4px 10px",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <ImageIcon size={10} color="white" />
                <p style={{ fontSize: "10px", color: "white", margin: 0, fontWeight: 600 }}>Foto siap dikirim</p>
              </div>
            </div>
          )}

          {/* Skip option */}
          <button
            onClick={() => { setSkipFoto(!skipFoto); setPreview(null); }}
            style={{
              padding: "10px", borderRadius: "12px", border: "none", cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 700,
              transition: "all 0.15s ease",
              background: skipFoto ? "#FFF8E8" : "#F7F5F0",
              color: skipFoto ? "#a07000" : "#4A4A4A",
              outline: skipFoto ? "1.5px solid #FFE26F" : "1.5px solid transparent",
            }}
          >
            {skipFoto ? "✓ Lanjutkan tanpa foto" : "Lanjutkan tanpa foto"}
          </button>

          {/* Info kirim */}
          {(preview || skipFoto) && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              background: "#EBF4FF", borderRadius: "12px", padding: "12px 14px",
              border: "1px solid #1883FF22",
            }}>
              <Send size={13} color="#1883FF" style={{ marginTop: "1px", flexShrink: 0 }} />
              <p style={{ fontSize: "11px", color: "#1883FF", margin: 0, lineHeight: "1.5", fontWeight: 600 }}>
                {preview
                  ? "Foto penjemputan akan otomatis dikirim ke orang tua sebagai notifikasi."
                  : "Notifikasi penjemputan tanpa foto akan dikirim ke orang tua."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "13px", border: "1.5px solid #E8E4DB", borderRadius: "14px",
              background: "#fff", color: "#4A4A4A", fontSize: "13px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              flex: 2, padding: "13px", border: "none", borderRadius: "14px",
              fontSize: "13px", fontWeight: 800, cursor: canConfirm ? "pointer" : "not-allowed",
              fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease",
              background: done ? "#C4E02F" : loading ? "#1883FF99" : !canConfirm ? "#F0EDE6" : "#1883FF",
              color: done ? "#1A1A1A" : !canConfirm ? "#999" : "#fff",
              boxShadow: canConfirm && !loading && !done ? "0 4px 16px rgba(24,131,255,0.25)" : "none",
            }}
          >
            {done ? "✓ Berhasil!" : loading ? "Memproses..." : "Konfirmasi & Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PengasuhPenjemputanPage() {
  const [children, setChildren]     = useState<Child[]>(initialChildren);
  const [search, setSearch]         = useState("");
  const [modalChild, setModalChild] = useState<Child | null>(null);
  const [tooltipId, setTooltipId]   = useState<number | null>(null);

  const dijemput  = children.filter((c) => c.status === "dijemput").length;
  const menunggu  = children.filter((c) => c.status === "menunggu").length;
  const belumHadir = children.filter((c) => c.checkInStatus === "belum").length;
  const total     = children.length;

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.penjemput.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmCheckout = (id: number, fotoUrl: string | null) => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "dijemput" as PickupStatus, jamJemput: now, fotoPenjemputan: fotoUrl } : c
      )
    );
    setModalChild(null);
  };

  const canCheckout = (child: Child) =>
    child.status === "menunggu" && child.checkInStatus === "hadir";

  const checkoutBlocked = (child: Child) =>
    child.status === "menunggu" && child.checkInStatus !== "hadir";

  return (
    <>
      {modalChild && (
        <UploadFotoModal
          child={modalChild}
          onClose={() => setModalChild(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      <div className="space-y-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Hadir",      value: total - belumHadir, bg: "#1883FF", sub: "Sudah check-in",     icon: <Car size={15} color="#1883FF" /> },
            { label: "Sudah Dijemput",   value: dijemput,           bg: "#C4E02F", sub: `${total ? Math.round((dijemput/total)*100) : 0}% dari total`, icon: <CheckCircle2 size={15} color="#4a7500" /> },
            { label: "Menunggu Jemput",  value: menunggu,           bg: "#FFE26F", sub: "Masih di daycare",   icon: <Clock size={15} color="#a07000" /> },
            { label: "Belum Check-in",   value: belumHadir,         bg: "#FFA9DD", sub: "Tidak bisa dijemput", icon: <Lock size={15} color="#aa3366" /> },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg + "20" }}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] leading-none mb-1">{s.value}</p>
              <p className="text-[11px] font-semibold text-[#1A1A1A]">{s.label}</p>
              <p className="text-[10px] text-[#4A4A4A]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── PROGRESS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#1A1A1A]">Progress Penjemputan</p>
            <span className="text-[12px] font-bold text-[#1883FF]">{dijemput}/{total}</span>
          </div>
          <div className="w-full h-2.5 bg-[#F4F6FA] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${total ? (dijemput / total) * 100 : 0}%`, background: "#1883FF" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-[#4A4A4A]">{menunggu} anak masih menunggu jemputan</p>
            {belumHadir > 0 && (
              <div className="flex items-center gap-1">
                <Lock size={9} color="#FFA9DD" />
                <p className="text-[10px] text-[#aa3366] font-semibold">{belumHadir} belum check-in</p>
              </div>
            )}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A]">Daftar Penjemputan</p>
              <p className="text-[10px] text-[#4A4A4A] mt-0.5 flex items-center gap-1">
                <Camera size={10} /> Foto penjemputan otomatis dikirim ke orang tua
              </p>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
              <input
                type="text"
                placeholder="Cari nama / penjemput..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-[11px] border border-[#F0F0F0] rounded-xl bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 w-48 placeholder:text-[#4A4A4A]/40"
              />
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#F4F6FA] border-b border-[#F0F0F0]">
            {["Anak", "Kelas", "Jam Masuk", "Penjemput", "Status", "Aksi"].map((h) => (
              <p key={h} className="col-span-2 text-[9px] font-bold uppercase tracking-wider text-[#4A4A4A]">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#F0F0F0]">
            {filtered.map((child) => {
              const blocked = checkoutBlocked(child);
              const isAbsen = child.checkInStatus === "izin" || child.checkInStatus === "sakit";

              return (
                <div
                  key={child.id}
                  className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 transition-colors"
                  style={{
                    background: blocked ? "#FFF8F8" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!blocked) e.currentTarget.style.background = "#F4F6FA"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = blocked ? "#FFF8F8" : "transparent"; }}
                >
                  {/* Anak */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{ background: child.avatarColor + "20", color: child.avatarColor }}
                    >
                      {child.avatar}
                    </div>
                    <p className="text-[11px] font-semibold text-[#1A1A1A] truncate">{child.name}</p>
                  </div>

                  {/* Kelas */}
                  <p className="col-span-2 text-[11px] text-[#4A4A4A] truncate">{child.kelas}</p>

                  {/* Jam Masuk */}
                  <div className="col-span-2">
                    {child.jamMasuk ? (
                      <div className="flex items-center gap-1">
                        <Clock size={9} color="#4a7500" />
                        <p className="text-[11px] font-semibold text-[#1A1A1A]">{child.jamMasuk}</p>
                      </div>
                    ) : isAbsen ? (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: child.checkInStatus === "sakit" ? "#FFA9DD22" : "#99ADFF22", color: child.checkInStatus === "sakit" ? "#aa3366" : "#3344aa" }}
                      >
                        {child.checkInStatus === "sakit" ? "🤒 Sakit" : "📋 Izin"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFE26F] animate-pulse" />
                        <p className="text-[10px] text-[#a07000] font-semibold">Belum hadir</p>
                      </div>
                    )}
                  </div>

                  {/* Penjemput */}
                  <p className="col-span-2 text-[11px] text-[#4A4A4A]">{child.penjemput}</p>

                  {/* Status penjemputan */}
                  <div className="col-span-2 space-y-1">
                    {child.status === "dijemput" ? (
                      <>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                          style={{ background: "#C4E02F25", color: "#5a8a00" }}>
                          <CheckCircle2 size={10} /> Dijemput
                        </span>
                        {child.jamJemput && (
                          <p className="text-[9px] text-[#4A4A4A] pl-1">{child.jamJemput}</p>
                        )}
                        {child.fotoPenjemputan ? (
                          <div
                            className="flex items-center gap-1 pl-1 cursor-pointer group w-fit"
                            onClick={() => window.open(child.fotoPenjemputan!, "_blank")}
                          >
                            <div className="w-7 h-7 rounded-md overflow-hidden border border-[#F0F0F0] group-hover:scale-110 transition-transform shadow-sm">
                              <img src={child.fotoPenjemputan} alt="foto" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[9px] text-[#1883FF] font-semibold group-hover:underline">Lihat foto</p>
                          </div>
                        ) : (
                          <p className="text-[9px] text-[#4A4A4A]/50 pl-1 flex items-center gap-1">
                            <Camera size={9} /> Tanpa foto
                          </p>
                        )}
                      </>
                    ) : blocked ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#FFA9DD22", color: "#aa3366" }}>
                        <Lock size={9} /> Terkunci
                      </span>
                    ) : isAbsen ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#99ADFF22", color: "#3344aa" }}>
                        <UserX size={9} /> Tidak hadir
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#FFE26F25", color: "#a07000" }}>
                        <Clock size={10} /> Menunggu
                      </span>
                    )}
                  </div>

                  {/* Aksi */}
                  <div className="col-span-2 relative">
                    {child.status === "dijemput" ? (
                      <div className="flex items-center gap-1 text-[#5a8a00]">
                        <CheckCircle2 size={13} />
                        <span className="text-[10px] font-semibold">Selesai</span>
                      </div>
                    ) : isAbsen ? (
                      <span className="text-[10px] text-[#999] font-medium flex items-center gap-1">
                        <UserX size={11} /> Tidak hadir
                      </span>
                    ) : blocked ? (
                      <div className="relative">
                        <button
                          disabled
                          onMouseEnter={() => setTooltipId(child.id)}
                          onMouseLeave={() => setTooltipId(null)}
                          className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-not-allowed"
                          style={{ background: "#F0EDE6", color: "#ccc" }}
                        >
                          <Lock size={10} />
                          Check-out
                        </button>
                        {/* Tooltip */}
                        {tooltipId === child.id && (
                          <div
                            style={{
                              position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                              transform: "translateX(-50%)", zIndex: 20,
                              background: "#1A1A1A", color: "#fff",
                              fontSize: "10px", fontWeight: 600, fontFamily: "'Montserrat', sans-serif",
                              padding: "6px 10px", borderRadius: "8px",
                              whiteSpace: "nowrap",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                          >
                            Anak belum check-in hari ini
                            <div style={{
                              position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                              width: 0, height: 0,
                              borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                              borderTop: "5px solid #1A1A1A",
                            }} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setModalChild(child)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg hover:scale-105 transition-all shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)",
                          boxShadow: "0 2px 8px rgba(24,131,255,0.25)",
                        }}
                      >
                        <Camera size={11} />
                        Check-out
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}