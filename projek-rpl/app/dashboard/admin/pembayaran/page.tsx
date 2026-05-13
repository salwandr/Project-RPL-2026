"use client";

import { useState } from "react";

type PaymentStatus = "pending" | "verified" | "rejected";

interface Payment {
  id: number;
  namaOrtu: string;
  namaAnak: string;
  program: string;
  jumlah: number;
  bulan: string;
  tanggalUpload: string;
  status: PaymentStatus;
  metode: string;
  avatar: string;
  buktiUrl: string;
}

const initialPayments: Payment[] = [
  { id: 1, namaOrtu: "Budi Santoso",   namaAnak: "Almira Zahra",  program: "Bulanan", jumlah: 1500000, bulan: "Januari 2026", tanggalUpload: "2 Jan 2026",  status: "pending",  metode: "Transfer BCA",  avatar: "BS", buktiUrl: "#" },
  { id: 2, namaOrtu: "Rina Wijaya",    namaAnak: "Bintang Putra", program: "Harian",  jumlah: 850000,  bulan: "Januari 2026", tanggalUpload: "3 Jan 2026",  status: "pending",  metode: "Transfer BRI",  avatar: "RW", buktiUrl: "#" },
  { id: 3, namaOrtu: "Doni Pratama",   namaAnak: "Citra Nadia",   program: "Bulanan", jumlah: 1500000, bulan: "Januari 2026", tanggalUpload: "1 Jan 2026",  status: "verified", metode: "Transfer Mandiri", avatar: "DP", buktiUrl: "#" },
  { id: 4, namaOrtu: "Sari Lestari",   namaAnak: "Dafa Ramadhan", program: "Bulanan", jumlah: 1500000, bulan: "Januari 2026", tanggalUpload: "4 Jan 2026",  status: "pending",  metode: "GoPay",         avatar: "SL", buktiUrl: "#" },
  { id: 5, namaOrtu: "Hendra Kurnia",  namaAnak: "Elisa Putri",   program: "Harian",  jumlah: 850000,  bulan: "Desember 2025", tanggalUpload: "28 Des 2025", status: "rejected", metode: "Transfer BCA",  avatar: "HK", buktiUrl: "#" },
  { id: 6, namaOrtu: "Dewi Maharani",  namaAnak: "Farhan Akbar",  program: "Bulanan", jumlah: 1500000, bulan: "Januari 2026", tanggalUpload: "5 Jan 2026",  status: "verified", metode: "OVO",           avatar: "DM", buktiUrl: "#" },
];

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; border: string }> = {
  pending:  { label: "Menunggu",   bg: "bg-[#FEB700]/10", text: "text-[#a07000]", border: "border-[#FEB700]/30" },
  verified: { label: "Terverifikasi", bg: "bg-[#C4E02F]/10", text: "text-[#5a7a00]", border: "border-[#C4E02F]/30" },
  rejected: { label: "Ditolak",    bg: "bg-[#FFA9DD]/10", text: "text-[#a0306a]", border: "border-[#FFA9DD]/30" },
};

const avatarColors = [
  "bg-[#1883FF]/15 text-[#1883FF]",
  "bg-[#FFA9DD]/20 text-[#a0306a]",
  "bg-[#C4E02F]/15 text-[#5a7a00]",
  "bg-[#FEB700]/15 text-[#a07000]",
  "bg-[#99ADFF]/20 text-[#3a4aaa]",
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PembayaranPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [filter, setFilter] = useState<PaymentStatus | "semua">("semua");
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ id: number; action: "verified" | "rejected" } | null>(null);

  const pending  = payments.filter((p) => p.status === "pending").length;
  const verified = payments.filter((p) => p.status === "verified").length;
  const rejected = payments.filter((p) => p.status === "rejected").length;
  const totalVerified = payments.filter((p) => p.status === "verified").reduce((s, p) => s + p.jumlah, 0);

  const filtered = payments.filter((p) => {
    const matchFilter = filter === "semua" || p.status === filter;
    const matchSearch =
      p.namaOrtu.toLowerCase().includes(search.toLowerCase()) ||
      p.namaAnak.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAction = (id: number, action: "verified" | "rejected") => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Konfirmasi Pembayaran</h1>
          <p className="text-[13px] text-[#4A4A4A] mt-1">Verifikasi bukti pembayaran yang diunggah orang tua.</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-[#FEB700]/10 border border-[#FEB700]/30 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
            <span className="text-[12px] font-bold text-[#a07000]">{pending} menunggu verifikasi</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Menunggu",       value: pending,              bg: "bg-[#FEB700]/10", border: "border-[#FEB700]/20", text: "text-[#a07000]"  },
          { label: "Terverifikasi",  value: verified,             bg: "bg-[#C4E02F]/10", border: "border-[#C4E02F]/20", text: "text-[#5a7a00]"  },
          { label: "Ditolak",        value: rejected,             bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#a0306a]"  },
          { label: "Total Diterima", value: formatRupiah(totalVerified), bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF] text-lg" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A4A4A] mb-1">{s.label}</p>
            <p className={`font-black ${s.text} leading-none text-3xl`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama orang tua / anak..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#FFE26F]/60 rounded-xl bg-white focus:outline-none focus:border-[#1883FF] transition-colors font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {(["semua", "pending", "verified", "rejected"] as const).map((f) => {
            const labels = { semua: "Semua", pending: "Menunggu", verified: "Terverifikasi", rejected: "Ditolak" };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-bold border transition-all
                  ${filter === f
                    ? "bg-[#1A1A1A] text-[#FFE26F] border-[#1A1A1A]"
                    : "bg-white text-[#4A4A4A] border-[#FFE26F]/60 hover:border-[#FFE26F]"}`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment cards */}
      <div className="space-y-3">
        {filtered.map((p, i) => {
          const cfg = statusConfig[p.status];
          const avColor = avatarColors[i % avatarColors.length];
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
                ${p.status === "pending" ? "border-[#FEB700]/40 shadow-[#FEB700]/5" : "border-[#FFE26F]/30"}`}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Left: avatar + info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0 ${avColor}`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-bold text-[#1A1A1A]">{p.namaOrtu}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#4A4A4A] mt-0.5">
                      Untuk: <span className="font-semibold text-[#1A1A1A]">{p.namaAnak}</span>
                      <span className="mx-1.5 text-[#4A4A4A]/30">·</span>
                      {p.program}
                    </p>
                  </div>
                </div>

                {/* Middle: payment detail */}
                <div className="flex gap-6 shrink-0">
                  <div>
                    <p className="text-[10px] text-[#4A4A4A] font-medium uppercase tracking-wider">Jumlah</p>
                    <p className="text-[14px] font-black text-[#1A1A1A] mt-0.5">{formatRupiah(p.jumlah)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A4A4A] font-medium uppercase tracking-wider">Bulan</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A] mt-0.5">{p.bulan}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A4A4A] font-medium uppercase tracking-wider">Metode</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A] mt-0.5">{p.metode}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A4A4A] font-medium uppercase tracking-wider">Upload</p>
                    <p className="text-[12px] font-semibold text-[#4A4A4A] mt-0.5">{p.tanggalUpload}</p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-2 rounded-xl text-[12px] font-bold border border-[#FFE26F]/60 text-[#4A4A4A] hover:bg-[#FFFDF7] transition-all flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Lihat Bukti
                  </button>
                  {p.status === "pending" && (
                    <>
                      <button
                        onClick={() => setConfirmModal({ id: p.id, action: "verified" })}
                        className="px-3 py-2 rounded-xl text-[12px] font-bold bg-[#C4E02F] text-[#1A1A1A] hover:opacity-90 active:scale-95 transition-all"
                      >
                        Verifikasi
                      </button>
                      <button
                        onClick={() => setConfirmModal({ id: p.id, action: "rejected" })}
                        className="px-3 py-2 rounded-xl text-[12px] font-bold border border-red-200 text-red-400 hover:bg-red-50 transition-all"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#FFE26F]/30 px-6 py-12 text-center text-[13px] text-[#4A4A4A] font-medium">
            Tidak ada data yang cocok.
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto
              ${confirmModal.action === "verified" ? "bg-[#C4E02F]/20" : "bg-red-50"}`}>
              {confirmModal.action === "verified" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#5a7a00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                {confirmModal.action === "verified" ? "Verifikasi Pembayaran?" : "Tolak Pembayaran?"}
              </h3>
              <p className="text-[12px] text-[#4A4A4A] mt-1">
                {confirmModal.action === "verified"
                  ? "Pembayaran akan ditandai sebagai terverifikasi dan orang tua akan diberitahu."
                  : "Pembayaran akan ditolak. Orang tua perlu mengupload ulang bukti pembayaran."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold border border-[#FFE26F]/60 text-[#4A4A4A] hover:bg-[#FFFDF7] transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all active:scale-95
                  ${confirmModal.action === "verified"
                    ? "bg-[#C4E02F] text-[#1A1A1A] hover:opacity-90"
                    : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                {confirmModal.action === "verified" ? "Ya, Verifikasi" : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}