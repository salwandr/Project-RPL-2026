"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DUMMY_USERS = [
  { username: "admin",    password: "admin123",    role: "admin"     },
  { username: "pengasuh", password: "pengasuh123", role: "pengasuh"  },
  { username: "ortu",     password: "ortu123",     role: "orang-tua" },
];

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName]           = useState("");
  const [regEmail, setRegEmail]         = useState("");
  const [regPassword, setRegPassword]   = useState("");
  const [regConfirm, setRegConfirm]     = useState("");
  const [regError, setRegError]         = useState("");
  const [regSuccess, setRegSuccess]     = useState(false);
  const [regLoading, setRegLoading]     = useState(false);

  // ── Login handler ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const user = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );
    setTimeout(() => {
      if (!user) { setLoginError("Username atau password salah."); setLoginLoading(false); return; }
      if (user.role === "admin")     router.push("/dashboard/admin/kedatangan");
      if (user.role === "pengasuh")  router.push("/dashboard/pengasuh/kedatangan");
      if (user.role === "orang-tua") router.push("/dashboard/orang-tua");
    }, 600);
  };

  // ── Register handler ──
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regPassword.length < 8) {
      setRegError("Password minimal 8 karakter."); return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Password dan konfirmasi tidak cocok."); return;
    }

    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      setRegSuccess(true);
      // Reset form
      setRegName(""); setRegEmail(""); setRegPassword(""); setRegConfirm("");
      // Balik ke tab login setelah 2 detik
      setTimeout(() => { setRegSuccess(false); setTab("login"); }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen flex font-montserrat">

      {/* SISI KIRI — Foto */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/masuk.jpg"
          alt="Tanika Daycare"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/40" />

        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div>
            <span className="bg-[#1883FF] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              Parent Portal
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Pantau Si Kecil<br />
              <span className="text-[#FFE26F]">dari Mana Saja</span>
            </h2>
            <p className="text-white/70 text-base font-light max-w-sm">
              Daily log, rapor perkembangan, dan status penjemputan — semua ada di satu tempat.
            </p>

            {/* Hint credentials */}
            <div className="space-y-2 pt-4">
              <p className="text-white/40 text-xs uppercase tracking-widest">Login sebagai:</p>
              {DUMMY_USERS.map((u) => (
                <div key={u.username} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex items-center justify-between">
                  <p className="text-white font-semibold text-sm">{u.username} / {u.password}</p>
                  <span className="text-[#FFE26F] text-xs font-bold capitalize">{u.role}</span>
                </div>
              ))}
              <p className="text-white/30 text-xs">*Hapus hint ini saat production</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN — Form */}
      <div className="w-full lg:w-1/2 bg-[#FFFDF7] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#1883FF] rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">Tanika Daycare</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white border-2 border-[#FFE26F] rounded-2xl p-1">
            <button
              onClick={() => { setTab("login"); setLoginError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${tab === "login"
                  ? "bg-[#1883FF] text-white shadow-md"
                  : "text-[#4A4A4A] hover:text-[#1883FF]"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setTab("register"); setRegError(""); setRegSuccess(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${tab === "register"
                  ? "bg-[#1883FF] text-white shadow-md"
                  : "text-[#4A4A4A] hover:text-[#1883FF]"}`}
            >
              Daftar
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Selamat Datang</h1>
                <p className="text-[#4A4A4A] font-light text-sm mt-1">Masuk untuk melanjutkan ke portal</p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">Username</label>
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">Password</label>
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                  />
                </div>

                {loginError && (
                  <div className="bg-[#FFA9DD]/20 border border-[#FFA9DD] rounded-2xl px-4 py-3">
                    <p className="text-[#1A1A1A] text-sm font-medium text-center">{loginError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg
                    ${loginLoading
                      ? "bg-[#1883FF]/50 text-white cursor-not-allowed"
                      : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"}`}
                >
                  {loginLoading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <p className="text-center text-sm text-[#4A4A4A]">
                Belum punya akun?{" "}
                <button
                  onClick={() => setTab("register")}
                  className="text-[#1883FF] font-bold hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Buat Akun</h1>
                <p className="text-[#4A4A4A] font-light text-sm mt-1">Daftarkan diri sebagai orang tua</p>
              </div>

              {/* Success state */}
              {regSuccess ? (
                <div className="bg-[#C4E02F]/20 border border-[#C4E02F] rounded-2xl px-5 py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-[#C4E02F] rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#1A1A1A] font-bold">Pendaftaran Berhasil!</p>
                  <p className="text-[#4A4A4A] text-sm font-light">Mengalihkan ke halaman login...</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@contoh.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">
                      Password
                      <span className="text-[#4A4A4A] font-normal ml-1">(min. 8 karakter)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">Konfirmasi Password</label>
                    <input
                      type="password"
                      placeholder="Ulangi password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                    />
                  </div>

                  {regError && (
                    <div className="bg-[#FFA9DD]/20 border border-[#FFA9DD] rounded-2xl px-4 py-3">
                      <p className="text-[#1A1A1A] text-sm font-medium text-center">{regError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg
                      ${regLoading
                        ? "bg-[#1883FF]/50 text-white cursor-not-allowed"
                        : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"}`}
                  >
                    {regLoading ? "Memproses..." : "Daftar"}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#FFE26F]" />
                    <span className="text-xs text-[#4A4A4A] font-medium">atau</span>
                    <div className="flex-1 h-px bg-[#FFE26F]" />
                  </div>

                  {/* Google button */}
                  <button
                    type="button"
                    className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-[#FFE26F] bg-white text-[#1A1A1A] hover:bg-[#FFE26F]/20 transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Daftar dengan Google
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-[#4A4A4A]">
                Sudah punya akun?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="text-[#1883FF] font-bold hover:underline"
                >
                  Masuk sekarang
                </button>
              </p>
            </div>
          )}

          <div className="text-center">
            <Link href="/" className="text-sm text-[#4A4A4A] hover:text-[#1883FF] transition-colors font-medium">
              Kembali ke Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}