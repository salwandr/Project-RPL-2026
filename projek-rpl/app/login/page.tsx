"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/lib/services/auth";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      await login(email, password);

      router.refresh();
      router.push("/dashboard/admin/kedatangan");
    } catch (error) {
      console.error(error);
      setLoginError("Email atau password salah.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regPassword.length < 8) {
      setRegError("Password minimal 8 karakter.");
      return;
    }

    if (regPassword !== regConfirm) {
      setRegError("Password dan konfirmasi tidak cocok.");
      return;
    }

    setRegLoading(true);

    try {
      setRegSuccess(true);
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");

      setTimeout(() => {
        setRegSuccess(false);
        setTab("login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setRegError("Gagal membuat akun.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat">
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
              Pantau Si Kecil
              <br />
              <span className="text-[#FFE26F]">dari Mana Saja</span>
            </h2>

            <p className="text-white/70 text-base font-light max-w-sm">
              Daily log, rapor perkembangan, dan status penjemputan — semua ada
              di satu tempat.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-[#FFFDF7] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#1883FF] rounded-2xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2"
                />
              </svg>
            </div>

            <span className="text-xl font-bold text-[#1A1A1A]">
              Tanika Daycare
            </span>
          </div>

          <div className="flex bg-white border-2 border-[#FFE26F] rounded-2xl p-1">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setLoginError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === "login"
                  ? "bg-[#1883FF] text-white shadow-md"
                  : "text-[#4A4A4A] hover:text-[#1883FF]"
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("register");
                setRegError("");
                setRegSuccess(false);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                tab === "register"
                  ? "bg-[#1883FF] text-white shadow-md"
                  : "text-[#4A4A4A] hover:text-[#1883FF]"
              }`}
            >
              Daftar
            </button>
          </div>

          {tab === "login" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">
                  Selamat Datang
                </h1>

                <p className="text-[#4A4A4A] font-light text-sm mt-1">
                  Masuk untuk melanjutkan ke portal
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all placeholder:text-[#4A4A4A]/30 text-[#1A1A1A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold text-sm mb-2 ml-1">
                    Password
                  </label>

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
                    <p className="text-[#1A1A1A] text-sm font-medium text-center">
                      {loginError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg ${
                    loginLoading
                      ? "bg-[#1883FF]/50 text-white cursor-not-allowed"
                      : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"
                  }`}
                >
                  {loginLoading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <p className="text-center text-sm text-[#4A4A4A]">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-[#1883FF] font-bold hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          )}

          {tab === "register" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">
                  Buat Akun
                </h1>

                <p className="text-[#4A4A4A] font-light text-sm mt-1">
                  Daftarkan diri sebagai orang tua
                </p>
              </div>

              {regSuccess ? (
                <div className="bg-[#C4E02F]/20 border border-[#C4E02F] rounded-2xl px-5 py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-[#C4E02F] rounded-full flex items-center justify-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <p className="text-[#1A1A1A] font-bold">
                    Pendaftaran Berhasil!
                  </p>

                  <p className="text-[#4A4A4A] text-sm font-light">
                    Mengalihkan ke halaman login...
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl"
                  />

                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl"
                  />

                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl"
                  />

                  <input
                    type="password"
                    placeholder="Ulangi password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl"
                  />

                  {regError && (
                    <div className="bg-[#FFA9DD]/20 border border-[#FFA9DD] rounded-2xl px-4 py-3">
                      <p className="text-[#1A1A1A] text-sm font-medium text-center">
                        {regError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg ${
                      regLoading
                        ? "bg-[#1883FF]/50 text-white cursor-not-allowed"
                        : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"
                    }`}
                  >
                    {regLoading ? "Memproses..." : "Daftar"}
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-[#4A4A4A]">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-[#1883FF] font-bold hover:underline"
                >
                  Masuk sekarang
                </button>
              </p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-[#4A4A4A] hover:text-[#1883FF] transition-colors font-medium"
            >
              Kembali ke Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}