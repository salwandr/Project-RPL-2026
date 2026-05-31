"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getChildrenByParent, type Child } from "@/lib/services/dailyLogs";

// ── Types ─────────────────────────────────────────────────────────────────────
type StatusPenjemputan = "menunggu" | "dalam-perjalanan" | "tiba" | "sudah-dijemput";

interface PickupRequest {
  id: string;
  child_id: string;
  requested_by: string;
  pickup_person_name: string;
  relationship: string;
  status: string;
  pickup_time: string | null;
  pickup_date: string;
  notes: string | null;
  created_at: string;
}

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  label: string; color: string; bg: string; border: string; icon: React.ReactNode;
}> = {
  // Status dari orang tua (pending = menunggu konfirmasi pengasuh)
  "menunggu": {
    label: "Menunggu Konfirmasi Pengasuh",
    color: "#FEB700", bg: "bg-[#FFE26F]/20", border: "border-[#FFE26F]",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  // Status setelah pengasuh approve (approved = sudah dijemput)
  "approved": {
    label: "Anak Sudah Dijemput ✓",
    color: "#5a8a00", bg: "bg-[#C4E02F]/15", border: "border-[#C4E02F]/50",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  },
  // Status legacy untuk backward compat
  "dalam-perjalanan": {
    label: "Penjemput Dalam Perjalanan",
    color: "#1883FF", bg: "bg-[#1883FF]/10", border: "border-[#1883FF]/30",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  },
  "tiba": {
    label: "Penjemput Sudah Tiba",
    color: "#C4E02F", bg: "bg-[#C4E02F]/15", border: "border-[#C4E02F]/40",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4E02F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  },
  "sudah-dijemput": {
    label: "Anak Sudah Dijemput",
    color: "#99ADFF", bg: "bg-[#99ADFF]/15", border: "border-[#99ADFF]/30",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#99ADFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
};

// Progress steps: menunggu (pending) → approved
const STEPS = ["menunggu", "approved"] as const;
const STEP_LABELS = ["Request Terkirim", "Dikonfirmasi Pengasuh"];

function formatTanggal(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatJam(t: string) {
  return t.slice(0, 5).replace(":", ".");
}

const RELATIONSHIP_LABEL: Record<string, string> = {
  grandparents:  "Kakek/Nenek",
  family_member: "Anggota Keluarga",
  acquaintance:  "Kenalan",
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PenjemputanOrangTua() {
  const [parentId, setParentId]       = useState<string | null>(null);
  const [children, setChildren]       = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [todayRequest, setTodayRequest]   = useState<PickupRequest | null>(null);
  const [history, setHistory]         = useState<PickupRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [confirmed, setConfirmed]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [justApproved, setJustApproved] = useState(false); // animasi saat baru di-approve

  // Form state
  const [namaPenjemput, setNamaPenjemput] = useState("");
  const [hubungan, setHubungan]           = useState("");
  const [jamJemput, setJamJemput]         = useState("16:30");

  const today         = new Date().toISOString().split("T")[0];
  const realtimeRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setParentId(data.user.id);
    });
  }, []);

  // ── Ambil anak ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!parentId) return;
    getChildrenByParent(parentId)
      .then((data) => {
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]);
      })
      .catch(() => setError("Gagal memuat data anak."));
  }, [parentId]);

  // ── Fetch request hari ini + riwayat ──────────────────────────────────────
  const fetchRequests = async (childId: string) => {
    setLoading(true);
    setTodayRequest(null);
    setHistory([]);
    setConfirmed(false);
    setJustApproved(false);
    try {
      const { data, error } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("child_id", childId)
        .order("pickup_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      const all      = data ?? [];
      const todayReq = all.find((r) => r.pickup_date === today) ?? null;
      setTodayRequest(todayReq);
      if (todayReq) setConfirmed(true);
      setHistory(all.filter((r) => r.pickup_date !== today));
    } catch {
      setError("Gagal memuat data penjemputan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChild) return;
    fetchRequests(selectedChild.id);
  }, [selectedChild]);

  // ── Realtime subscription: dengarkan perubahan status pickup_requests ─────
  useEffect(() => {
    if (!selectedChild) return;

    // Hapus channel lama
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
    }

    const channel = supabase
      .channel(`pickup-ortu-${selectedChild.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pickup_requests",
          filter: `child_id=eq.${selectedChild.id}`,
        },
        (payload) => {
          const updated = payload.new as PickupRequest;
          // Hanya update kalau ini untuk hari ini
          if (updated.pickup_date === today) {
            const wasNotApproved = todayRequest?.status !== "approved";
            setTodayRequest(updated);
            // Animasi kalau baru saja di-approve pengasuh
            if (updated.status === "approved" && wasNotApproved) {
              setJustApproved(true);
              setTimeout(() => setJustApproved(false), 3000);
            }
          }
        }
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChild, today, todayRequest?.status]);

  // ── Submit konfirmasi penjemputan ─────────────────────────────────────────
  const handleKonfirmasi = async () => {
    if (!selectedChild || !parentId || !namaPenjemput || !hubungan) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("pickup_requests")
        .insert({
          child_id: selectedChild.id,
          requested_by: parentId,
          pickup_person_name: namaPenjemput,
          relationship: hubungan,
          pickup_time: jamJemput,
          pickup_date: today,
          status: "menunggu", // pending, menunggu pengasuh approve
          notes: null,
        })
        .select()
        .single();

      if (error) throw error;
      setTodayRequest(data);
      setConfirmed(true);
    } catch (e: any) {
      setError(e?.message ?? "Gagal mengirim konfirmasi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentStatus  = todayRequest?.status ?? "menunggu";
  const cfg            = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG["menunggu"];
  const isApproved     = currentStatus === "approved";
  const currentStepIdx = isApproved ? 1 : 0;

  // ── Render ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-red-100 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-[15px] font-bold text-[#1A1A1A]">{error}</p>
        <button onClick={() => setError(null)} className="mt-4 text-sm text-[#1883FF] underline">Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* PAGE HEADER */}
      <div className="relative bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#99ADFF]/20 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFA9DD]/10 rounded-full translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#99ADFF]/20 border border-[#99ADFF]/30 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1883FF] animate-pulse" />
              <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">Penjemputan Hari Ini</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Penjemputan {selectedChild?.full_name ?? "—"}
            </h1>
            <p className="text-[#4A4A4A] text-sm font-light mt-1">
              {formatTanggal(today)} · Jam operasional sampai 18.00
            </p>
          </div>
        </div>
      </div>

      {/* CHILD SELECTOR */}
      {children.length > 1 && (
        <div>
          <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-3 ml-1">Pilih Anak</p>
          <div className="flex gap-2 flex-wrap">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-2xl border-2 font-semibold text-sm transition-all
                  ${child.id === selectedChild?.id
                    ? "bg-[#1883FF] border-[#1883FF] text-white shadow-lg shadow-[#1883FF]/25"
                    : "bg-white border-[#FFE26F] text-[#4A4A4A] hover:border-[#1883FF]/40"}`}
              >
                {child.full_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-36 rounded-[2rem] bg-[#F0EDE6]" />
          <div className="h-64 rounded-[2rem] bg-[#F0EDE6]" />
        </div>
      ) : (
        <>
          {/* ── STATUS CARD — tampil setelah submit ── */}
          {confirmed && todayRequest && (
            <div
              className={`${cfg.bg} border-2 ${cfg.border} rounded-[2rem] p-6 transition-all duration-500
                ${justApproved ? "ring-4 ring-[#C4E02F]/50 scale-[1.01]" : ""}`}
            >
              {/* Notif banner kalau baru di-approve */}
              {justApproved && (
                <div className="mb-4 flex items-center gap-2 bg-[#C4E02F] text-[#1A1A1A] rounded-2xl px-4 py-3 font-bold text-sm animate-bounce">
                  🎉 Pengasuh baru saja mengkonfirmasi penjemputan!
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {cfg.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] mb-1">Status Saat Ini</p>
                  <p className="text-xl font-black" style={{ color: cfg.color }}>{cfg.label}</p>
                  <p className="text-sm text-[#4A4A4A] mt-1 font-light">
                    Penjemput: <strong>{todayRequest.pickup_person_name}</strong>
                    {" · "}
                    {RELATIONSHIP_LABEL[todayRequest.relationship] ?? todayRequest.relationship}
                    {todayRequest.pickup_time && (
                      <> · Estimasi <strong>{formatJam(todayRequest.pickup_time)}</strong></>
                    )}
                  </p>
                </div>
              </div>

              {/* Step progress: Request Terkirim → Dikonfirmasi Pengasuh */}
              <div className="mt-6 flex items-center gap-1">
                {STEPS.map((s, i) => {
                  const done = i <= currentStepIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all
                        ${done ? "bg-[#1883FF] text-white shadow-sm shadow-[#1883FF]/30" : "bg-white border-2 border-[#D1D5DB] text-[#9CA3AF]"}`}>
                        {done ? "✓" : i + 1}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-1.5 rounded-full mx-2 transition-all duration-700 ${i < currentStepIdx ? "bg-[#1883FF]" : "bg-[#E5E7EB]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {STEP_LABELS.map((l) => (
                  <span key={l} className="text-[10px] font-semibold text-[#4A4A4A]">{l}</span>
                ))}
              </div>

              {/* Info menunggu (kalau belum approved) */}
              {!isApproved && (
                <div className="mt-4 flex items-start gap-2 bg-white/60 rounded-2xl px-4 py-3 border border-[#FFE26F]/30">
                  <span className="text-sm">⏳</span>
                  <p className="text-xs text-[#4A4A4A] font-medium">
                    Request sudah terkirim ke pengasuh. Halaman ini akan otomatis update saat pengasuh mengkonfirmasi penjemputan.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">

            {/* ── FORM KONFIRMASI ── */}
            <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1883FF]/10 rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1883FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h2 className="font-bold text-[#1A1A1A]">Konfirmasi Penjemput</h2>
              </div>

              {confirmed ? (
                /* State setelah submit: tampilkan ringkasan + status dinamis */
                <div className="space-y-3">
                  <div className="bg-[#C4E02F]/15 border border-[#C4E02F]/40 rounded-2xl p-5 text-center space-y-2">
                    <div className="w-12 h-12 bg-[#C4E02F] rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-bold text-[#1A1A1A]">Konfirmasi Terkirim ke Pengasuh!</p>
                    <p className="text-sm text-[#4A4A4A] font-light">
                      <strong>{todayRequest?.pickup_person_name}</strong>{" "}
                      ({RELATIONSHIP_LABEL[todayRequest?.relationship ?? ""] ?? todayRequest?.relationship}){" "}
                      akan menjemput pukul{" "}
                      <strong>{todayRequest?.pickup_time ? formatJam(todayRequest.pickup_time) : "—"}</strong>.
                    </p>
                  </div>

                  {/* Status badge dinamis */}
                  <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 border
                    ${isApproved
                      ? "bg-[#C4E02F]/10 border-[#C4E02F]/30"
                      : "bg-[#FFE26F]/10 border-[#FFE26F]/40"}`}>
                    <div className={`w-2 h-2 rounded-full ${isApproved ? "bg-[#5a8a00]" : "bg-[#FEB700] animate-pulse"}`} />
                    <p className="text-xs font-semibold" style={{ color: isApproved ? "#5a8a00" : "#a07000" }}>
                      {isApproved
                        ? "✓ Pengasuh sudah mengkonfirmasi — anak dijemput"
                        : "Menunggu konfirmasi dari pengasuh..."}
                    </p>
                  </div>
                </div>
              ) : (
                /* State form belum submit */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Nama penjemput</label>
                    <input
                      type="text"
                      value={namaPenjemput}
                      onChange={(e) => setNamaPenjemput(e.target.value)}
                      placeholder="Contoh: Bapak Andi"
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all text-[#1A1A1A] placeholder:text-[#ccc]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Hubungan dengan anak</label>
                    <select
                      value={hubungan}
                      onChange={(e) => setHubungan(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all text-[#1A1A1A]"
                    >
                      <option value="">Pilih hubungan...</option>
                      <option value="grandparents">Kakek / Nenek</option>
                      <option value="family_member">Anggota Keluarga</option>
                      <option value="acquaintance">Kenalan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 ml-1">Estimasi jam jemput</label>
                    <input
                      type="time"
                      value={jamJemput}
                      onChange={(e) => setJamJemput(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white border-2 border-[#FFE26F] rounded-2xl focus:outline-none focus:border-[#1883FF] focus:ring-4 focus:ring-[#1883FF]/10 transition-all text-[#1A1A1A] font-semibold"
                    />
                  </div>

                  <button
                    onClick={handleKonfirmasi}
                    disabled={submitting || !namaPenjemput || !hubungan}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg
                      ${submitting || !namaPenjemput || !hubungan
                        ? "bg-[#1883FF]/40 text-white cursor-not-allowed"
                        : "bg-[#1883FF] text-white hover:bg-[#1570e0] shadow-[#1883FF]/25 hover:scale-[1.01]"}`}
                  >
                    {submitting ? "Mengirim..." : "Konfirmasi Penjemputan"}
                  </button>
                </div>
              )}
            </div>

            {/* ── RIWAYAT ── */}
            <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE26F]/40 rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h2 className="font-bold text-[#1A1A1A]">Riwayat Penjemputan</h2>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-[13px] text-[#4A4A4A]">Belum ada riwayat penjemputan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF7] border border-[#FFE26F]/30">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                        ${h.status === "approved" ? "bg-[#C4E02F]/20" : "bg-[#FFE26F]/20"}`}>
                        {h.status === "approved" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a8a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FEB700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1A1A1A] truncate">{h.pickup_person_name}</p>
                        <p className="text-xs text-[#4A4A4A] font-light">
                          {RELATIONSHIP_LABEL[h.relationship] ?? h.relationship} · {formatTanggal(h.pickup_date)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {h.pickup_time && (
                          <span className="text-sm font-black text-[#1883FF]">{formatJam(h.pickup_time)}</span>
                        )}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full
                          ${h.status === "approved" ? "bg-[#C4E02F]/20 text-[#5a8a00]" : "bg-[#FFE26F]/30 text-[#a07000]"}`}>
                          {h.status === "approved" ? "Dikonfirmasi" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}