"use client";

import { useState } from "react";

export default function PenjemputanOrangTuaPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [penjemput, setPenjemput] = useState("Ayah");

  const penjemputOptions = ["Ayah", "Ibu", "Kakek", "Nenek", "Lainnya"];

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h1 className="text-[18px] font-bold text-stone-800">Penjemputan</h1>
        <p className="text-[11px] text-stone-400 mt-0.5">Konfirmasi penjemputan Anak 1 hari ini</p>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3">Status Hari Ini</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500">
            A1
          </div>
          <div>
            <p className="text-[13px] font-bold text-stone-700">Anak 1</p>
            <p className="text-[10px] text-stone-400">Rainbow Room · Masuk 07:10</p>
          </div>
          <div className="ml-auto">
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full
              ${confirmed
                ? "bg-pastel-blue/30 text-blue-600"
                : "bg-warm-beige text-stone-500"}`}>
              {confirmed ? "Dijemput ✓" : "Menunggu"}
            </span>
          </div>
        </div>
      </div>

      {/* Konfirmasi form */}
      {!confirmed ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400">Konfirmasi Penjemput</p>

          <div>
            <p className="text-[11px] font-semibold text-stone-600 mb-2">Siapa yang akan menjemput?</p>
            <div className="flex flex-wrap gap-2">
              {penjemputOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setPenjemput(p)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-semibold transition-all duration-150 hover:scale-[1.02]
                    ${penjemput === p
                      ? "bg-sage-green text-white shadow-sm"
                      : "bg-warm-beige text-stone-500 hover:bg-sage-green/20"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-stone-600 mb-2">Perkiraan jam jemput</p>
            <input
              type="time"
              defaultValue="15:30"
              className="text-[12px] border border-stone-200 rounded-xl px-4 py-2 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-green/30"
            />
          </div>

          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-3 bg-sage-green text-white rounded-xl text-[12px] font-bold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
          >
            Konfirmasi Penjemputan
          </button>
        </div>
      ) : (
        <div className="bg-sage-green/10 border border-sage-green/20 rounded-2xl p-5 text-center space-y-2">
          <p className="text-3xl">✓</p>
          <p className="text-[13px] font-bold text-sage-green">Penjemputan Terkonfirmasi</p>
          <p className="text-[11px] text-stone-500">
            <span className="font-semibold">{penjemput}</span> akan menjemput Anak 1 sekitar pukul 15:30
          </p>
          <button
            onClick={() => setConfirmed(false)}
            className="text-[10px] text-stone-400 hover:text-stone-600 underline transition-colors mt-2"
          >
            Ubah konfirmasi
          </button>
        </div>
      )}
    </div>
  );
}