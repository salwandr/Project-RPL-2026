"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateChild } from "@/lib/services/children";

const programs = [
  {
    name: "Harian",
    price: 200000,
    desc: "Penitipan anak per hari.",
  },
  {
    name: "Mingguan",
    price: 1000000,
    desc: "Penitipan anak per minggu",
  },
  {
    name: "Bulanan",
    price: 5000000,
    desc: "Penitipan rutin setiap bulan.",
  },
] as const;

export default function ProgramPage() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] =
    useState<"Harian" | "Mingguan"| "Bulanan" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedProgram) {
      alert("Pilih program dulu");
      return;
    }

    const childId = sessionStorage.getItem("selected_child_id");

    if (!childId) {
      alert("Data anak tidak ditemukan");
      router.push("/dashboard/orang-tua/daftar/data-anak");
      return;
    }

    try {
      setLoading(true);

      await updateChild(childId, {
        program: selectedProgram,
        payment_status: "pending",
      });

      sessionStorage.setItem("selected_program", selectedProgram);

      router.push("/dashboard/orang-tua/daftar/pembayaran");
    } catch (error: any) {
      console.error("Gagal memilih program:", error);
      alert(error.message || "Gagal memilih program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl font-montserrat">
      <div className="rounded-[2rem] bg-foreground p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-warm-beige">
          Pendaftaran
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Pilih Program
        </h1>

        <p className="mt-2 text-sm text-white/60">
          Pilih program daycare untuk anak Anda.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {programs.map((program) => {
          const isSelected = selectedProgram === program.name;

          return (
            <button
              key={program.name}
              type="button"
              onClick={() => setSelectedProgram(program.name)}
              className={`rounded-[2rem] border p-6 text-left shadow-sm transition ${
                isSelected
                  ? "border-sage-green bg-sage-green/10"
                  : "border-warm-beige/40 bg-white hover:bg-warm-beige/20"
              }`}
            >
              <p className="text-xl font-black text-foreground">
                {program.name}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {program.desc}
              </p>

              <p className="mt-6 text-2xl font-black text-sage-green">
                Rp {program.price.toLocaleString("id-ID")}
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-warm-beige transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Lanjut ke Pembayaran"}
      </button>
    </div>
  );
}