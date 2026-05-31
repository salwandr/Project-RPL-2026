"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChildById } from "@/lib/services/children";

export default function PembayaranPage() {
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaymentData() {
      try {
        const childId = sessionStorage.getItem("selected_child_id");

        if (!childId) {
          router.push("/dashboard/orang-tua/daftar/data-anak");
          return;
        }

        const data = await getChildById(childId);
        setChild(data);
      } catch (error) {
        console.error("Gagal load pembayaran:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPaymentData();
  }, [router]);

  if (loading) return <p>Loading pembayaran...</p>;

  const hasAmount = child?.total_amount !== null && child?.total_amount !== undefined;

  return (
    <div className="mx-auto max-w-3xl font-montserrat">
      <div className="rounded-[2rem] bg-foreground p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-warm-beige">
          Pembayaran
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Status Pembayaran
        </h1>

        <p className="mt-2 text-sm text-white/60">
          Biaya akan muncul setelah admin menyelesaikan proses interview.
        </p>
      </div>

      <div className="mt-6 rounded-[2rem] border border-warm-beige/40 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Nama Anak</p>
        <p className="text-xl font-black">{child.full_name}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-warm-beige/30 p-4">
            <p className="text-xs font-bold uppercase text-gray-500">Program</p>
            <p className="mt-1 text-lg font-black">{child.program || "-"}</p>
          </div>

          <div className="rounded-2xl bg-sage-green/10 p-4">
            <p className="text-xs font-bold uppercase text-gray-500">
              Tanggal Interview
            </p>
            <p className="mt-1 text-lg font-black">
              {child.interview_date || "-"}
            </p>
          </div>
        </div>

        {!hasAmount ? (
          <div className="mt-6 rounded-2xl bg-bubblegum/10 p-5">
            <p className="font-bold text-foreground">
              Menunggu admin menentukan biaya
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Setelah interview, admin akan mengisi tanggal mulai, tanggal selesai,
              dan total biaya.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl bg-sage-green/10 p-5">
              <p className="text-xs font-bold uppercase text-gray-500">
                Total yang harus dibayar
              </p>
              <p className="mt-2 text-3xl font-black text-sage-green">
                Rp {Number(child.total_amount).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-sage-green/40 bg-sage-green/5 p-5">
              <p className="font-bold">Transfer ke rekening:</p>
              <p className="mt-2 text-2xl font-black">BCA 1234567890</p>
              <p className="text-sm text-gray-500">a.n. Tanika Daycare</p>
            </div>
          </>
        )}

        <button
          onClick={() => router.push("/dashboard/orang-tua")}
          className="mt-6 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-warm-beige"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}