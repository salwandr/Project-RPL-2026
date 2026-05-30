"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getCurrentProfile, registerParent, verifyRegisterOtp, } from "@/lib/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("LOGIN CLICKED");

  setLoginError("");
  setLoginLoading(true);  

  try {
    console.log("BEFORE LOGIN");

    await login(email, password);

    console.log("LOGIN SUCCESS");

    const profile = await getCurrentProfile();

    console.log("PROFILE:", profile);

    if (profile?.role === "admin") {
      router.push("/dashboard/admin");
    } else if (profile?.role === "pengasuh") {
      router.push("/dashboard/pengasuh");
    } else if (profile?.role === "parent") {
      router.push("/dashboard/orang-tua");
    }
    else {
      setLoginError("Role akun tidak ditemukan.");
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    setLoginError("Email atau password salah.");
  } finally {
    setLoginLoading(false);
  }
};

  const handleSendOtp = async () => {
  setRegisterError("");

  if (!fullName || !email || !password || !confirmPassword) {
    setRegisterError("Isi nama, email, password, dan ulangi password dulu.");
    return;
  }

  if (password !== confirmPassword) {
    setRegisterError("Password dan ulangi password tidak sama.");
    return;
  }

  try {
    setSendingOtp(true);

    await registerParent({
      fullName,
      email,
      password,
    });

    setOtpSent(true);
  } catch (error) {
    console.error(error);
    setRegisterError("Gagal mengirim kode OTP.");
  } finally {
    setSendingOtp(false);
  }
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  setRegisterError("");

  if (!otpSent) {
    setRegisterError("Kirim kode OTP dulu.");
    return;
  }

  if (!otp) {
    setRegisterError("Masukkan kode OTP.");
    return;
  }

  try {
    setRegisterLoading(true);

    await verifyRegisterOtp({
      email,
      otp,
      fullName,
    });

    setMode("login");
  } catch (error) {
    console.error(error);
    setRegisterError("Kode OTP salah atau expired.");
  } finally {
    setRegisterLoading(false);
  }
};

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#FAFAF7] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/daycare-login.jpg"
          alt="Daycare"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-12 top-12">
          <div className="rounded-full bg-blue-500 px-6 py-3 text-sm font-bold tracking-wider text-white">
            PARENT PORTAL
          </div>
        </div>

        <div className="absolute bottom-16 left-12 max-w-xl">
          <h1 className="text-6xl font-extrabold leading-tight text-white">
            Pantau Si Kecil
            <br />
            <span className="text-yellow-300">dari Mana Saja</span>
          </h1>

          <p className="mt-6 text-lg text-white/80">
            Daily log, rapor perkembangan, dan status penjemputan — semua ada
            di satu tempat.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px]">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
              ✦
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Tanika Daycare
            </h2>
          </div>

          <div className="mb-8 grid grid-cols-2 rounded-2xl border border-yellow-300 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-xl py-3 font-bold transition ${
                mode === "login"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-xl py-3 font-bold transition ${
                mode === "register"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Daftar
            </button>
          </div>

          {mode === "login" ? (
            <>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Selamat Datang
              </h1>

              <p className="mt-2 text-gray-500">
                Masuk untuk melanjutkan ke portal
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Email
                  </label>

                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="email@contoh.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>  
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                {loginError && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full rounded-2xl bg-blue-500 py-4 text-lg font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginLoading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <div className="mt-6 text-center text-gray-500">
                Belum punya akun?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-bold text-blue-500 hover:underline"
                >
                  Daftar sekarang
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Buat Akun
              </h1>

              <p className="mt-2 text-gray-500">
                Daftarkan diri sebagai orang tua
              </p>

              <form onSubmit={handleRegister} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Email
                  </label>

                  <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                   <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className="rounded-2xl bg-blue-500 px-5 font-bold text-white transition hover:bg-blue-600 disabled:opacity-60"
                    >
                      {sendingOtp ? "..." : otpSent ? "Kirim Ulang" : "Kirim"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Ulangi Password
                  </label>

                  <input
                    type="password"
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                {otpSent && (
                <div>
                  <label className="mb-2 block font-semibold text-gray-800">
                    Kode OTP
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan 6 digit kode"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-300 bg-white px-6 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
                )}

                {registerError && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full rounded-2xl bg-blue-500 py-4 text-lg font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registerLoading ? "Memproses..." : "Daftar"}
                </button>
              </form>

              <div className="mt-6 text-center text-gray-500">
                Sudah punya akun?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="font-bold text-blue-500 hover:underline"
                >
                  Masuk sekarang
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => router.push("/")}
            className="mt-8 block w-full text-center font-medium text-gray-600 hover:text-blue-500"
          >
            Kembali ke Homepage
          </button>
        </div>
      </div>
    </div>
  );
}