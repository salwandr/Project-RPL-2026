"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getChildById, getChildren } from "@/lib/services/children";

export default function PembayaranPage() {
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadPaymentData() {
      try {
    const childId = sessionStorage.getItem("selected_child_id");

    let data = null;

    if (childId) {
      data = await getChildById(childId);
    } else {
      const children = await getChildren();
      data = children?.[0] ?? null;
    }

    if (!data) {
      router.push("/dashboard/orang-tua/daftar/data-anak");
      return;
    }
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

  if (!child) {
    return <p className="p-6">Loading payment data...</p>;
  }

  const handleUploadProof = async () => {
  if (!child) return;

  if (!proofFile) {
    alert("Pilih file bukti pembayaran dulu");
    return;
  }

  try {
    setUploading(true);

    const fileExt = proofFile.name.split(".").pop();
    const filePath = `${child.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, proofFile);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("children")
      .update({
        payment_proof_url: publicUrlData.publicUrl,
      })
      .eq("id", child.id);

    if (updateError) throw updateError;

    alert("Bukti pembayaran berhasil diupload. Tunggu konfirmasi admin.");
    setChild({
      ...child,
      payment_proof_url: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Gagal upload bukti pembayaran");
  } finally {
    setUploading(false);
  }
};

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
        <p className="text-xl font-black">{child?.full_name || "loading..."}</p>

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

            <div className="mt-6 rounded-2xl border border-warm-beige/40 bg-white p-5">
  <p className="font-bold">Upload Bukti Pembayaran</p>

  <input
    type="file"
    accept="image/*,.pdf"
    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
    className="mt-4 w-full rounded-xl border border-warm-beige/40 p-3"
  />

  <button
    onClick={handleUploadProof}
    disabled={uploading}
    className="mt-4 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-warm-beige disabled:opacity-50"
  >
    {uploading ? "Mengupload..." : "Upload Bukti Pembayaran"}
  </button>

  {child.payment_proof_url && (
    <a
      href={child.payment_proof_url}
      target="_blank"
      className="mt-3 block text-sm font-bold text-blue-500"
    >
      Lihat bukti yang sudah diupload
    </a>
  )}
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