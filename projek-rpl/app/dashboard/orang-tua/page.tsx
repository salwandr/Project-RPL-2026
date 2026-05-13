"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
 
const MOCK_STATUS: "pending" | "approved" = "pending";
 
const MOCK_CHILD = {
  name: "Almira Zahra",
  age: "3 tahun 4 bulan",
  kelas: "Rainbow Room",
  program: "Bulanan",
  checkin: "07.15",
  pengasuh: "Kak Dewi",
};
 
const MOCK_LOGS = [
  { label: "Makan Siang",  done: true,  time: "12.00" },
  { label: "Tidur Siang",  done: true,  time: "13.00" },
  { label: "Bermain",      done: true,  time: "14.00" },
  { label: "membaca",      done: false, time: null    },
  { label: "Dijemput",     done: false, time: null    },
];
 
const MOCK_NOTIFS = [
  { id: 1, text: "Almira sudah makan siang dengan lahap",     time: "12.05", color: "#C4E02F" },
  { id: 2, text: "Almira tidur siang pukul 13.00",           time: "13.02", color: "#1883FF" },
  { id: 3, text: "Aktivitas bermain balok selesai",           time: "14.30", color: "#FFA9DD" },
];
 
function PreApprovedDashboard() {
  const router = useRouter();
 
  const steps = [
    { label: "Pilih Program",     done: true,  desc: "Program Bulanan dipilih"     },
    { label: "Isi Data Anak",     done: true,  desc: "Data anak sudah diisi"        },
    { label: "Upload Pembayaran", done: true,  desc: "Bukti pembayaran dikirim"     },
    { label: "Verifikasi Admin",  done: false, desc: "Menunggu konfirmasi admin"    },
    { label: "Anak Aktif",        done: false, desc: "Akses dashboard penuh"        },
  ];
 
  const currentStep = steps.findIndex((s) => !s.done);
 
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative bg-[#1A1A1A] rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1883FF]/10 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFE26F]/10 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFE26F]/20 border border-[#FFE26F]/40 rounded-full px-3 md:px-4 py-1.5 mb-3 md:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FFE26F] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-bold text-[#FFE26F] uppercase tracking-wider">Menunggu Verifikasi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Pendaftaran dalam proses</h1>
          <p className="text-white/50 font-light text-sm max-w-md">
            Tim admin Tanika Daycare sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu 1x24 jam.
          </p>
        </div>
      </div>
 
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#FFE26F]/30 shadow-sm">
        <h2 className="text-[12px] md:text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-5 md:mb-6">
          Status Pendaftaran
        </h2>
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isDone   = step.done;
            const isLast   = i === steps.length - 1;
 
            return (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all
                    ${isDone
                      ? "bg-[#C4E02F] border-[#C4E02F]"
                      : isActive
                        ? "bg-white border-[#1883FF]"
                        : "bg-white border-[#FFE26F]/50"}`}
                  >
                    {isDone ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1883FF] animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#FFE26F]/40" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-8 mt-1 ${isDone ? "bg-[#C4E02F]" : "bg-[#FFE26F]/30"}`} />
                  )}
                </div>
 
                <div className="pb-7 md:pb-8">
                  <p className={`text-[12px] md:text-[13px] font-bold leading-none mb-1
                    ${isDone ? "text-[#1A1A1A]" : isActive ? "text-[#1883FF]" : "text-[#4A4A4A]/40"}`}>
                    {step.label}
                  </p>
                  <p className={`text-[11px] font-light
                    ${isDone ? "text-[#4A4A4A]" : isActive ? "text-[#1883FF]/60" : "text-[#4A4A4A]/30"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Program Dipilih", value: "Bulanan",              bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]" },
          { label: "Status Bayar",    value: "Menunggu Konfirmasi",  bg: "bg-[#FFE26F]/20", border: "border-[#FFE26F]/40", text: "text-[#FEB700]" },
          { label: "Estimasi Aktif",  value: "1x24 Jam",             bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#e07ba0]" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-4 md:p-5`}>
            <p className="text-[11px] text-[#4A4A4A] mb-1">{c.label}</p>
            <p className={`text-[14px] md:text-[15px] font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>
 
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#FFE26F]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-bold text-[#1A1A1A] mb-1">Belum mendaftar?</p>
          <p className="text-[11px] text-[#4A4A4A] font-light">Daftarkan anak Anda sekarang untuk memulai proses</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/orang-tua/daftar/program")}
          className="w-full md:w-auto shrink-0 bg-[#1A1A1A] text-[#FFE26F] px-6 py-3.5 md:py-3 rounded-2xl text-[14px] md:text-[13px] font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          Daftar Sekarang →
        </button>
      </div>
    </div>
  );
}
 
function ApprovedDashboard() {
  const router = useRouter();
 
  const quickAccess = [
    {
      label: "Daily Log",
      href: "/dashboard/orang-tua/daily-log",
      bg: "bg-[#1883FF]",
      textColor: "text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Rapor",
      href: "/dashboard/orang-tua/rapor",
      bg: "bg-[#FFE26F]",
      textColor: "text-[#1A1A1A]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Penjemputan",
      href: "/dashboard/orang-tua/penjemputan",
      bg: "bg-[#FFA9DD]",
      textColor: "text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
    {
      label: "Profil Anak",
      href: "/dashboard/orang-tua/profile",
      bg: "bg-[#99ADFF]",
      textColor: "text-white",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];
 
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative bg-[#1A1A1A] rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1883FF]/10 rounded-full translate-x-24 -translate-y-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFE26F]/10 rounded-full -translate-x-12 translate-y-12 pointer-events-none" />
 
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FFE26F]/20 rounded-2xl flex items-center justify-center border-2 border-white/10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-8 md:h-8 text-[#FFE26F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
 
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-[#C4E02F]/20 border border-[#C4E02F]/30 rounded-full px-3 py-1 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4E02F] animate-pulse" />
              <span className="text-[10px] font-bold text-[#C4E02F] uppercase tracking-wider">Sedang di Daycare</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">{MOCK_CHILD.name}</h1>
            <div className="flex flex-wrap gap-3 md:gap-4 mt-1">
              <span className="text-[11px] md:text-[12px] text-white/50">Usia: <span className="text-white/80">{MOCK_CHILD.age}</span></span>
              <span className="text-[11px] md:text-[12px] text-white/50">Kelas: <span className="text-white/80">{MOCK_CHILD.kelas}</span></span>
              <span className="text-[11px] md:text-[12px] text-white/50">Check-in: <span className="text-white/80">{MOCK_CHILD.checkin} WIB</span></span>
            </div>
          </div>
 
          <div className="bg-[#1883FF] rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-center shrink-0">
            <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">Program</p>
            <p className="text-[14px] md:text-[15px] font-bold text-white">{MOCK_CHILD.program}</p>
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Status",    value: "Hadir",              bg: "bg-[#C4E02F]/15", border: "border-[#C4E02F]/30", text: "text-[#5a7a00]", dot: "#C4E02F" },
          { label: "Check-in",  value: "07.15 WIB",          bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/20", text: "text-[#1883FF]", dot: "#1883FF" },
          { label: "Pengasuh",  value: MOCK_CHILD.pengasuh,  bg: "bg-[#FFE26F]/20", border: "border-[#FFE26F]/40", text: "text-[#FEB700]", dot: "#FFE26F" },
          { label: "Aktivitas", value: "3 / 5",              bg: "bg-[#FFA9DD]/10", border: "border-[#FFA9DD]/20", text: "text-[#e07ba0]", dot: "#FFA9DD" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 md:p-4`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
              <p className="text-[10px] text-[#4A4A4A] font-medium uppercase tracking-wider">{s.label}</p>
            </div>
            <p className={`text-[14px] md:text-[16px] font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#FFE26F]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="text-[12px] md:text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Aktivitas Hari Ini</h2>
            <button
              onClick={() => router.push("/dashboard/orang-tua/daily-log")}
              className="text-[11px] text-[#1883FF] font-bold hover:underline"
            >
              Lihat semua
            </button>
          </div>
          <div className="space-y-0">
            {MOCK_LOGS.map((log, i) => {
              const isLast = i === MOCK_LOGS.length - 1;
              return (
                <div key={log.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2
                      ${log.done ? "bg-[#C4E02F] border-[#C4E02F]" : "bg-white border-[#FFE26F]/40"}`}>
                      {log.done && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {!isLast && <div className={`w-0.5 h-6 mt-1 ${log.done ? "bg-[#C4E02F]/40" : "bg-[#FFE26F]/20"}`} />}
                  </div>
                  <div className="pb-5 flex-1 flex items-start justify-between">
                    <p className={`text-[12px] font-semibold ${log.done ? "text-[#1A1A1A]" : "text-[#4A4A4A]/40"}`}>
                      {log.label}
                    </p>
                    {log.time && <p className="text-[10px] text-[#4A4A4A]">{log.time} WIB</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#FFE26F]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="text-[12px] md:text-[13px] font-bold text-[#1A1A1A] uppercase tracking-widest">Notifikasi Terbaru</h2>
            <span className="w-5 h-5 bg-[#FFA9DD] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {MOCK_NOTIFS.length}
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_NOTIFS.map((notif) => (
              <div key={notif.id} className="flex gap-3 p-3 rounded-2xl bg-[#FFFDF7] border border-[#FFE26F]/20">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: notif.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1A1A1A] font-medium leading-snug">{notif.text}</p>
                  <p className="text-[10px] text-[#4A4A4A] mt-0.5">{notif.time} WIB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {quickAccess.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`${item.bg} rounded-2xl p-4 md:p-5 flex flex-col items-start gap-2.5 md:gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-sm`}
          >
            {item.icon}
            <p className={`text-[12px] md:text-[13px] font-bold ${item.textColor}`}>
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
 
export default function OrangTuaDashboard() {
  return MOCK_STATUS === "approved" ? <ApprovedDashboard /> : <PreApprovedDashboard />;
}
 