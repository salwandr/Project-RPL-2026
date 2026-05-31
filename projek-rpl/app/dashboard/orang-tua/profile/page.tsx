"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Child {
  id: string;
  full_name: string;
  birth_date: string | null;
  program: string | null;
  payment_status: string | null;
  end_date: string | null;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `${months} bulan`;
  return `${years} tahun ${months > 0 ? `${months} bulan` : ""}`.trim();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function ProfileOrangTuaPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Tidak ada sesi login");

        setEmail(user.email ?? "");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, role, created_at")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("id, full_name, birth_date, program, payment_status, end_date")
          .eq("parent_id", user.id)
          .order("full_name");

        if (childrenError) throw childrenError;
        setChildren(childrenData ?? []);
      } catch (e) {
        setError("Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);
  
  async function handleUpdateName() {
  if (!profile || !newName.trim()) return;

  try {
    setSavingName(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: newName.trim(),
      })
      .eq("id", profile.id);

    if (error) throw error;

    setProfile({
      ...profile,
      full_name: newName.trim(),
    });

    setIsEditingName(false);
  } catch (err) {
    alert("Gagal mengubah nama.");
  } finally {
    setSavingName(false);
  }
}



  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="bg-white rounded-[2rem] p-6 border border-stone-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-stone-100" />
          <div className="space-y-2">
            <div className="h-4 w-36 rounded-lg bg-stone-100" />
            <div className="h-3 w-24 rounded-lg bg-stone-100" />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-stone-100 space-y-3">
          <div className="h-3 w-20 rounded bg-stone-100" />
          <div className="h-4 w-full rounded bg-stone-100" />
          <div className="h-4 w-3/4 rounded bg-stone-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-red-100 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-[15px] font-bold text-stone-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── HEADER PROFIL ── */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-sage-green/10 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-sage-green/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-sage-green">
              {profile ? getInitials(profile.full_name) : "?"}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Orang Tua</p>
            <h1 className="text-[18px] font-bold text-stone-800 leading-tight">
              {profile?.full_name ?? "—"}
            </h1>
            <p className="text-[12px] text-stone-400 mt-0.5">{email}</p>
          </div>
        </div>
      </div>

      {/* ── INFO AKUN ── */}
      <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-4">Informasi Akun</p>
        <div className="space-y-3">
<div className="space-y-3">

  {/* Nama Lengkap */}
  <div className="flex items-center justify-between py-3 border-b border-stone-50">
    <p className="text-[12px] text-stone-400 font-medium">
      Nama Lengkap
    </p>

    {!isEditingName ? (
      <div className="flex items-center gap-3">
        <p className="text-[13px] font-semibold text-stone-700">
          {profile?.full_name ?? "—"}
        </p>

      <button
        onClick={() => {
          setNewName(profile?.full_name ?? "");
          setIsEditingName(true);
        }}
        className="p-1.5 rounded-lg hover:bg-stone-100 transition"
      >
        <Pencil size={14} className="text-sage-green" />
      </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-1 text-[12px]"
        />

        <button
          onClick={handleUpdateName}
          disabled={savingName}
          className="px-3 py-1 rounded-lg bg-sage-green text-white text-[11px] font-bold"
        >
          {savingName ? "..." : "Simpan"}
        </button>

        <button
          onClick={() => setIsEditingName(false)}
          className="px-3 py-1 rounded-lg bg-stone-100 text-[11px] font-bold"
        >
          Batal
        </button>
      </div>
    )}
  </div>

  {/* Email */}
  <div className="flex items-center justify-between py-3 border-b border-stone-50">
    <p className="text-[12px] text-stone-400 font-medium">Email</p>
    <p className="text-[13px] font-semibold text-stone-700">{email}</p>
  </div>

  {/* Bergabung */}
  <div className="flex items-center justify-between py-3">
    <p className="text-[12px] text-stone-400 font-medium">Bergabung</p>
    <p className="text-[13px] font-semibold text-stone-700">
      {profile?.created_at ? formatDate(profile.created_at) : "—"}
    </p>
  </div>

</div>
        </div>
      </div>

      {/* ── DATA ANAK ── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-stone-400 mb-3 ml-1">
          Data Anak {children.length > 0 && `(${children.length})`}
        </p>

        {children.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 border border-stone-100 text-center">
            <p className="text-3xl mb-3">👶</p>
            <p className="text-[13px] font-bold text-stone-700">Belum ada data anak</p>
            <p className="text-[11px] text-stone-400 mt-1">Hubungi pengasuh untuk menambahkan data anak</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-[2rem] p-5 border border-stone-100 shadow-sm">
                <div className="flex items-center gap-4">
                  {/* Avatar anak */}
                  <div className="w-12 h-12 rounded-xl bg-pastel-blue/30 flex items-center justify-center shrink-0">
                    <span className="text-base font-black text-blue-400">
                      {getInitials(child.full_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[14px] font-bold text-stone-800 truncate">{child.full_name}</h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {child.birth_date ? calculateAge(child.birth_date) : "Usia tidak diketahui"}
                    </p>
                  </div>
                  {/* Payment status badge */}
                  {child.payment_status && (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const endDate = child.end_date ? new Date(child.end_date) : null;
                    const isExpired = endDate ? endDate < today : false;

                    return (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          isExpired
                            ? "bg-red-50 text-red-500"
                            : child.payment_status === "approved"
                            ? "bg-green-100 text-green-500"
                            : child.payment_status === "waiting_payment"
                            ? "bg-yellow-50 text-yellow-600"
                            : child.payment_status === "waiting_admin"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {isExpired
                          ? "Expired"
                          : child.payment_status === "approved"
                          ? "Aktif"
                          : child.payment_status === "waiting_payment"
                          ? "Menunggu Pembayaran"
                          : child.payment_status === "waiting_admin"
                          ? "Menunggu Admin"
                          : "Belum bayar"}
                      </span>
                    );
                  })()}
                <button
                  onClick={() => {
                    sessionStorage.setItem("selected_child_id", child.id);
                    router.push("/dashboard/orang-tua/daftar/program?mode=perpanjangan");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sage-green text-white text-sm font-bold"
                  >
                  Perpanjangan
                </button>
                </div>

                {/* Detail */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: "Tanggal Lahir", value: child.birth_date ? formatDate(child.birth_date) : "—" },
                    { label: "Program",       value: child.program ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-stone-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{label}</p>
                      <p className="text-[12px] font-semibold text-stone-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}