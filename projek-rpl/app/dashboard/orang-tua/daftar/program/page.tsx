"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateChild, getChildren } from "@/lib/services/children";

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

function ProgramContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const isPerpanjangan = mode === "perpanjangan";

  const [qty, setQty] = useState(1);
  const [selectedProgram, setSelectedProgram] =
    useState<"Harian" | "Mingguan" | "Bulanan" | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedProgram) {
      alert("Pilih program dulu");
      return;
    }

    let childId = sessionStorage.getItem("selected_child_id");

      if (!childId) {
        const children = await getChildren();
        const existingChild = children?.[0];

        if (!existingChild) {
          alert("Data anak tidak ditemukan");
          router.push("/dashboard/orang-tua/daftar/data-anak");
          return;
        }

        childId = existingChild.id;
        sessionStorage.setItem("selected_child_id", childId);
      }

    try {
      setLoading(true);

      await updateChild(childId, {
        program: selectedProgram,
        interview_date: interviewDate || null,
        payment_status: "pending",
      });

sessionStorage.setItem("selected_program", selectedProgram);
sessionStorage.setItem("program_qty", String(isPerpanjangan ? qty : 1));
sessionStorage.setItem(
  "payment_mode",
  isPerpanjangan ? "perpanjangan" : "pendaftaran"
);

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

{isPerpanjangan && selectedProgram && (
  <div className="mt-6 rounded-[2rem] border border-sage-green/20 bg-sage-green/5 p-6">
    <p className="text-sm font-bold text-foreground">
      Lama Perpanjangan
    </p>

    <div className="mt-3 flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="w-24 rounded-xl border border-warm-beige/40 px-3 py-2"
      />

      <span className="text-sm text-gray-500">
        {selectedProgram === "Harian"
          ? "hari"
          : selectedProgram === "Mingguan"
          ? "minggu"
          : "bulan"}
      </span>
    </div>
  </div>
)}
    {!isPerpanjangan && (
      <div className="mt-6">
        <label className="block text-sm font-semibold mb-2">
          Tanggal Interview
        </label>

        <input
          type="date"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>
    )}
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

export default function ProgramPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProgramContent />
    </Suspense>
  );
}