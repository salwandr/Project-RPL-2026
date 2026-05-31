"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Child, getChildren, createChild } from "@/lib/services/children";

export default function DataAnakPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
  });

  const [children, setChildren] = useState<Child[]>([]);
  const [pendingChild, setPendingChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function loadChildren() {
    try {
      const data = await getChildren();

      setChildren(data);

      const pending = data.find(
        (child) => child.payment_status === "pending"
      );

      setPendingChild(pending ?? null);
    } catch (error) {
      console.error(error);
    }
  }

  loadChildren();
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      const user = userData.user;

      if (!user) {
        alert("Kamu belum login");
        router.push("/login");
        return;
      }

     const createdChild = await createChild({
        full_name: form.full_name,
        birth_date: form.birth_date,
        parent_id: user.id,
        payment_status: "pending",
        
      });

      sessionStorage.setItem("selected_child_id", createdChild.id);

      router.push("/dashboard/orang-tua/daftar/program");
    } catch (error: any) {
      console.error("Gagal menyimpan data anak:", error);
      alert(error.message || "Gagal menyimpan data anak");
    } finally {
      setLoading(false);
    }
  };

  if (pendingChild) {
  return (
    <div className="mx-auto max-w-2xl font-montserrat">
      <div className="rounded-[2rem] bg-foreground p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-warm-beige">
          Pendaftaran
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Pendaftaran Belum Selesai
        </h1>

        <p className="mt-2 text-sm text-white/60">
          {pendingChild.full_name} masih dalam proses pendaftaran.
        </p>
      </div>

      <button
        onClick={() => {
          sessionStorage.setItem("selected_child_id", pendingChild.id);

          if (!pendingChild.program || !pendingChild.interview_date) {
            router.push("/dashboard/orang-tua/daftar/program");
          } else {
            router.push("/dashboard/orang-tua/daftar/pembayaran");
          }
        }}
        className="mt-6 w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-warm-beige"
      >
        Lanjutkan Pendaftaran
      </button>
    </div>
  );
}

  return (
    <div className="mx-auto max-w-2xl font-montserrat">
      <div className="rounded-[2rem] bg-foreground p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-warm-beige">
          Pendaftaran
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Data Anak
        </h1>

        <p className="mt-2 text-sm text-white/60">
          Isi data anak untuk melanjutkan proses pendaftaran.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-[2rem] border border-warm-beige/40 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Nama Lengkap Anak
          </label>

          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-warm-beige/40 px-4 py-3 outline-none focus:border-sage-green"
            placeholder="Contoh: Almira Zahra"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Tanggal Lahir
          </label>

          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-warm-beige/40 px-4 py-3 outline-none focus:border-sage-green"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-foreground px-5 py-4 font-bold text-warm-beige transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Lanjut ke Program"}
        </button>
      </form>
    </div>
  );
}