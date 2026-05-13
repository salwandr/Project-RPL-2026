"use client";

import { useState, useRef } from "react";
import { Search, Clock, CheckCircle2, Car, Camera, X, Image as ImageIcon, Send } from "lucide-react";

type PickupStatus = "menunggu" | "dijemput";

interface Child {
  id: number;
  name: string;
  kelas: string;
  avatar: string;
  jamMasuk: string;
  penjemput: string;
  status: PickupStatus;
  jamJemput: string | null;
  fotoPenjemputan: string | null;
}

const initialChildren: Child[] = [
  { id: 1, name: "Andra Pratama", kelas: "Rainbow Room",   avatar: "AP", jamMasuk: "07:10", penjemput: "Ayah",  status: "dijemput", jamJemput: "15:30", fotoPenjemputan: null },
  { id: 2, name: "Lana Safira",   kelas: "Sunshine Class", avatar: "LS", jamMasuk: "07:25", penjemput: "Ibu",   status: "dijemput", jamJemput: "15:45", fotoPenjemputan: null },
  { id: 3, name: "Budi Wijaya",   kelas: "Rainbow Room",   avatar: "BW", jamMasuk: "07:30", penjemput: "Ayah",  status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 4, name: "Rina Putri",    kelas: "Star Class",     avatar: "RP", jamMasuk: "07:15", penjemput: "Ibu",   status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 5, name: "Dani Saputra",  kelas: "Sunshine Class", avatar: "DS", jamMasuk: "07:40", penjemput: "Nenek", status: "dijemput", jamJemput: "16:00", fotoPenjemputan: null },
  { id: 6, name: "Maya Sari",     kelas: "Rainbow Room",   avatar: "MS", jamMasuk: "07:20", penjemput: "Ayah",  status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
  { id: 7, name: "Citra Dewi",    kelas: "Sunshine Class", avatar: "CD", jamMasuk: "07:22", penjemput: "Kakek", status: "menunggu", jamJemput: null,    fotoPenjemputan: null },
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
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSkipFoto(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => onConfirm(child.id, skipFoto ? null : preview), 1200);
    }, 900);
  };

  const canConfirm = (preview !== null || skipFoto) && !loading && !done;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1883FF]/10 flex items-center justify-center text-[10px] font-bold text-[#1883FF]">
              {child.avatar}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A]">Foto Penjemputan</p>
              <p className="text-[10px] text-[#4A4A4A]">{child.name} · Dijemput {child.penjemput}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#4A4A4A] hover:bg-red-50 hover:text-red-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-[12px] text-[#4A4A4A] leading-relaxed">
            Ambil atau upload foto sebagai bukti penjemputan. Foto akan otomatis dikirim ke orang tua.
          </p>

          {/* Upload area */}
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-44 border-2 border-dashed border-[#1883FF]/30 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1883FF] hover:bg-[#1883FF]/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1883FF]/10 flex items-center justify-center group-hover:bg-[#1883FF]/20 transition-colors">
                <Camera size={24} className="text-[#1883FF]" />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-bold text-[#1883FF]">Ambil / Upload Foto</p>
                <p className="text-[10px] text-[#4A4A4A] mt-0.5">JPG, PNG · Maks 5MB</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview penjemputan"
                className="w-full h-44 object-cover rounded-2xl border border-[#F0F0F0]"
              />
              <button
                onClick={() => { setPreview(null); setSkipFoto(false); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-[#4A4A4A] hover:bg-red-50 hover:text-red-400 shadow-sm transition-all"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <ImageIcon size={10} className="text-white" />
                <p className="text-[10px] text-white font-medium">Foto siap dikirim</p>
              </div>
            </div>
          )}

          {/* Skip option */}
          <button
            onClick={() => { setSkipFoto(!skipFoto); setPreview(null); }}
            className={`w-full py-2.5 rounded-xl text-[11px] font-semibold border-2 transition-all
              ${skipFoto
                ? "border-[#FFE26F] bg-[#FFE26F]/20 text-[#a07000]"
                : "border-[#F0F0F0] text-[#4A4A4A] hover:border-[#FFE26F] hover:bg-[#FFE26F]/10"}`}
          >
            {skipFoto ? "✓ Lanjutkan tanpa foto" : "Lanjutkan tanpa foto"}
          </button>

          {/* Info kirim */}
          {(preview || skipFoto) && (
            <div className="flex items-start gap-2 bg-[#1883FF]/5 rounded-xl px-3 py-2.5 border border-[#1883FF]/15">
              <Send size={13} className="text-[#1883FF] mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-[#1883FF] leading-relaxed">
                {preview
                  ? "Foto penjemputan akan otomatis dikirim ke orang tua sebagai notifikasi."
                  : "Notifikasi penjemputan tanpa foto akan dikirim ke orang tua."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[12px] font-bold border-2 border-[#F0F0F0] text-[#4A4A4A] hover:bg-[#F4F6FA] transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-1 py-3 rounded-xl text-[12px] font-bold transition-all shadow-md
              ${done
                ? "bg-[#C4E02F] text-[#1A1A1A]"
                : loading
                  ? "bg-[#1883FF]/60 text-white cursor-wait"
                  : !canConfirm
                    ? "bg-[#F4F6FA] text-[#4A4A4A] cursor-not-allowed shadow-none"
                    : "bg-[#1883FF] text-white hover:bg-[#1570e0] hover:scale-[1.01] shadow-[#1883FF]/20"}`}
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

  const dijemput = children.filter((c) => c.status === "dijemput").length;
  const menunggu = children.filter((c) => c.status === "menunggu").length;
  const total    = children.length;

  const filtered = children.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.penjemput.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmCheckout = (id: number, fotoUrl: string | null) => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "dijemput" as PickupStatus, jamJemput: now, fotoPenjemputan: fotoUrl }
          : c
      )
    );
    setModalChild(null);
  };

  return (
    <>
      {modalChild && (
        <UploadFotoModal
          child={modalChild}
          onClose={() => setModalChild(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      <div className="space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Hadir",     value: total,    bg: "#1883FF", sub: "Anak hari ini" },
            { label: "Sudah Dijemput",  value: dijemput, bg: "#C4E02F", sub: `${Math.round((dijemput / total) * 100)}% dari total` },
            { label: "Menunggu Jemput", value: menunggu, bg: "#FFE26F", sub: "Masih di daycare" },
          ].map((s) => (
            <div key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
              <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.bg}20` }}>
                <Car size={15} style={{ color: s.bg }} />
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
            <p className="text-[13px] font-semibold text-[#1A1A1A]">Progress Penjemputan</p>
            <span className="text-[12px] font-bold text-[#1883FF]">{dijemput}/{total}</span>
          </div>
          <div className="w-full h-2.5 bg-[#F4F6FA] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(dijemput / total) * 100}%`, background: "#1883FF" }}
            />
          </div>
          <p className="text-[10px] text-[#4A4A4A] mt-2">{menunggu} anak masih menunggu jemputan</p>
        </div>

        {/* Table */}
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
            {filtered.map((child) => (
              <div key={child.id} className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 hover:bg-[#F4F6FA] transition-colors">

                {/* Anak */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1883FF]/10 flex items-center justify-center text-[9px] font-bold text-[#1883FF] flex-shrink-0">
                    {child.avatar}
                  </div>
                  <p className="text-[11px] font-semibold text-[#1A1A1A] truncate">{child.name}</p>
                </div>

                {/* Kelas */}
                <p className="col-span-2 text-[11px] text-[#4A4A4A] truncate">{child.kelas}</p>

                {/* Jam masuk */}
                <p className="col-span-2 text-[11px] font-semibold text-[#1A1A1A]">{child.jamMasuk}</p>

                {/* Penjemput */}
                <p className="col-span-2 text-[11px] text-[#4A4A4A]">{child.penjemput}</p>

                {/* Status */}
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
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                      style={{ background: "#FFE26F25", color: "#a07000" }}>
                      <Clock size={10} /> Menunggu
                    </span>
                  )}
                </div>

                {/* Aksi */}
                <div className="col-span-2">
                  {child.status === "menunggu" ? (
                    <button
                      onClick={() => setModalChild(child)}
                      className="flex items-center gap-1.5 text-[10px] font-bold bg-[#1883FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#1570e0] hover:scale-105 transition-all shadow-sm"
                    >
                      <Camera size={11} />
                      Check-out
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[#5a8a00]">
                      <CheckCircle2 size={13} />
                      <span className="text-[10px] font-semibold">Selesai</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}