"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dummy users untuk testing role-based redirect
// Nanti bisa diganti dengan API call ke backend
const DUMMY_USERS = [
  { username: "admin",    password: "admin123",    role: "admin"     },
  { username: "pengasuh", password: "pengasuh123", role: "pengasuh"  },
  { username: "ortu",     password: "ortu123",     role: "orang-tua" },
];

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Cek kredensial
    const user = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );

    setTimeout(() => {
      if (!user) {
        setError("Username atau password salah.");
        setLoading(false);
        return;
      }

      // Redirect berdasarkan role
      if (user.role === "admin")     router.push("/dashboard/admin/kedatangan");
      if (user.role === "pengasuh")  router.push("/dashboard/pengasuh/kedatangan");
      if (user.role === "orang-tua") router.push("/dashboard/orang-tua");
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      {/* SISI KIRI */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#CBD5E0] items-center justify-center p-12">
        <div className="max-w-md text-center space-y-4">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest">Login sebagai:</p>
          <div className="space-y-3 text-left">
            {DUMMY_USERS.map((u) => (
              <div key={u.username} className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3">
                <p className="text-white font-bold text-sm">{u.username} <span className="font-normal opacity-70">/ {u.password}</span></p>
                <p className="text-white/60 text-xs capitalize">Role: {u.role}</p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-4">*Hapus hint ini saat production</p>
        </div>
      </div>

      {/* SISI KANAN */}
      <div className="w-full lg:w-1/2 bg-[#EADDCD] flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl transition-all">

          {/* Header */}
          <div className="mb-10 text-left">
            <h1 className="text-4xl font-bold text-[#2D3748] mb-2">Tanika Daycare</h1>
            <p className="text-gray-500 text-lg">Silakan masuk untuk melanjutkan</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label className="block text-[#2D3748] font-semibold mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 bg-[#F8F9FA] border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A8C5A5]/50 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-[#2D3748] font-semibold mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="........"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-[#F8F9FA] border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A8C5A5]/50 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95
                  ${loading
                    ? "bg-[#ACC2A6]/60 cursor-not-allowed"
                    : "bg-[#ACC2A6] hover:bg-[#99ae93] shadow-[#ACC2A6]/20"}`}
              >
                {loading ? "Masuk..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-[#A8C5A5] transition-colors">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}