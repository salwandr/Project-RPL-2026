"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Clock, CheckCircle2, Car, Camera, X, Image as ImageIcon, Send, UserX, Lock, Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckInStatus = "belum" | "hadir" | "izin" | "sakit";
type PickupStatus  = "menunggu" | "dijemput";

interface Child {
  id: string;
  name: string;
  kelas: string;
  avatar: string;
  avatarColor: string;
  jamMasuk: string | null;
  checkInStatus: CheckInStatus;
  pickupRequestId: string | null;
  penjemput: string | null;
  relationship: string | null;
  pickupRequestStatus: string | null; 
  status: PickupStatus;              
  jamJemput: string | null;
  hasOrangTuaRequest: boolean;       
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#1883FF", "#FEB700", "#FFA9DD", "#99ADFF", "#C4E02F"];

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatTime(t: string | null) {
  if (!t) return null;
  return t.slice(0, 5);
}

const RELATIONSHIP_LABEL: Record<string, string> = {
  grandparents:  "Kakek/Nenek",
  family_member: "Anggota Keluarga",
  acquaintance:  "Kenalan",
};

// ── Upload Foto Modal ─────────────────────────────────────────────────────────

function UploadFotoModal({
  child,
  onClose,
  onConfirm,
}: {
  child: Child;
  onClose: () => void;
  onConfirm: (childId: string, fotoFile: File | null) => Promise<void>;
}) {
  const [preview, setPreview]   = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [skipFoto, setSkipFoto] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
    setSkipFoto(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(child.id, skipFoto ? null : fotoFile);
      setDone(true);
      setTimeout(() => onClose(), 900);
    } catch {
      setLoading(false);
    }
  };

  const canConfirm = (preview !== null || skipFoto) && !loading && !done;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full max-w-md overflow-hidden"
        style={{ borderRadius: "28px", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", fontFamily: "'Montserrat', sans-serif" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1.5px solid #F0EDE6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: child.avatarColor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: child.avatarColor }}>
              {child.avatar}
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Konfirmasi Checkout</p>
              <p style={{ fontSize: "11px", color: "#4A4A4A", margin: "2px 0 0", fontWeight: 500 }}>
                {child.name}
                {child.penjemput ? ` · Dijemput ${child.penjemput}` : ""}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#F7F5F0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A4A4A" }}>
            <X size={15} />
          </button>
        </div>

        {/* Info request ortu (kalau ada) */}
        {child.hasOrangTuaRequest && child.penjemput && (
          <div style={{ margin: "14px 24px 0", padding: "12px 14px", background: "#EBF4FF", borderRadius: "12px", border: "1px solid #1883FF22", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Bell size={13} color="#1883FF" style={{ marginTop: "1px", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#1883FF", margin: 0 }}>Request dari Orang Tua</p>
              <p style={{ fontSize: "11px", color: "#1883FF", margin: "3px 0 0", fontWeight: 500 }}>
                {child.penjemput} ({RELATIONSHIP_LABEL[child.relationship ?? ""] ?? child.relationship}) akan menjemput
                {child.jamJemput ? ` pukul ${child.jamJemput}` : ""}.
              </p>
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "16px 24px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "#4A4A4A", lineHeight: "1.6", margin: 0, fontWeight: 500 }}>
            Ambil atau upload foto sebagai bukti penjemputan. Foto akan otomatis dikirim ke orang tua.
          </p>

          {!preview ? (
            <div onClick={() => fileRef.current?.click()}
              style={{ height: "150px", border: "2px dashed #1883FF44", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", background: "#F7FBFF" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#1883FF15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={24} color="#1883FF" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1883FF", margin: 0 }}>Ambil / Upload Foto</p>
                <p style={{ fontSize: "11px", color: "#999", margin: "3px 0 0", fontWeight: 500 }}>JPG, PNG · Maks 5MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img src={preview} alt="Preview" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "16px", border: "1.5px solid #F0EDE6" }} />
              <button onClick={() => { setPreview(null); setFotoFile(null); setSkipFoto(false); }}
                style={{ position: "absolute", top: "8px", right: "8px", width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={13} />
              </button>
              <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                <ImageIcon size={10} color="white" />
                <p style={{ fontSize: "10px", color: "white", margin: 0, fontWeight: 600 }}>Foto siap dikirim</p>
              </div>
            </div>
          )}

          <button onClick={() => { setSkipFoto(!skipFoto); setPreview(null); setFotoFile(null); }}
            style={{ padding: "10px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 700, background: skipFoto ? "#FFF8E8" : "#F7F5F0", color: skipFoto ? "#a07000" : "#4A4A4A", outline: skipFoto ? "1.5px solid #FFE26F" : "1.5px solid transparent" }}>
            {skipFoto ? "✓ Lanjutkan tanpa foto" : "Lanjutkan tanpa foto"}
          </button>

          {(preview || skipFoto) && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "#EBF4FF", borderRadius: "12px", padding: "10px 14px", border: "1px solid #1883FF22" }}>
              <Send size={13} color="#1883FF" style={{ marginTop: "1px", flexShrink: 0 }} />
              <p style={{ fontSize: "11px", color: "#1883FF", margin: 0, lineHeight: "1.5", fontWeight: 600 }}>
                {preview ? "Foto penjemputan akan otomatis dikirim ke orang tua." : "Notifikasi penjemputan tanpa foto akan dikirim ke orang tua."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: "10px" }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "13px", border: "1.5px solid #E8E4DB", borderRadius: "14px", background: "#fff", color: "#4A4A4A", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}>
            Batal
          </button>
          <button onClick={handleConfirm} disabled={!canConfirm}
            style={{ flex: 2, padding: "13px", border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: 800, cursor: canConfirm ? "pointer" : "not-allowed", fontFamily: "'Montserrat', sans-serif", background: done ? "#C4E02F" : loading ? "#1883FF99" : !canConfirm ? "#F0EDE6" : "#1883FF", color: done ? "#1A1A1A" : !canConfirm ? "#999" : "#fff" }}>
            {done ? "✓ Berhasil!" : loading ? "Memproses..." : "Konfirmasi & Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PengasuhPenjemputanPage() {
  const [children, setChildren]     = useState<Child[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [modalChild, setModalChild] = useState<Child | null>(null);
  const [tooltipId, setTooltipId]   = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = todayStr();

      const { data: kidsData, error: kidsErr } = await supabase
        .from("children")
        .select("id, full_name, program")
        .order("full_name");
      if (kidsErr) throw kidsErr;

      const { data: attData, error: attErr } = await supabase
        .from("attendance")
        .select("child_id, status, jam_checkin")
        .eq("date", today);
      if (attErr) throw attErr;

      // Ambil semua pickup request hari ini (menunggu maupun approved)
      const { data: pickupData, error: pickupErr } = await supabase
        .from("pickup_requests")
        .select("id, child_id, pickup_person_name, relationship, status, pickup_time, notes")
        .eq("pickup_date", today);
      if (pickupErr) throw pickupErr;

      const attMap    = new Map(attData?.map((a) => [a.child_id, a]) ?? []);
      const pickupMap = new Map(pickupData?.map((p) => [p.child_id, p]) ?? []);

      const mapped: Child[] = (kidsData ?? []).map((k, i) => {
        const att    = attMap.get(k.id);
        const pickup = pickupMap.get(k.id);

        const nameParts = k.full_name.trim().split(" ");
        const avatar = nameParts.length >= 2
          ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
          : k.full_name.slice(0, 2);

        const checkInStatus: CheckInStatus = (att?.status as CheckInStatus) ?? "belum";
        const isApproved = pickup?.status === "approved";
        // hasOrangTuaRequest: ortu sudah kirim form, tapi belum di-checkout pengasuh
        const hasOrangTuaRequest = !!pickup && pickup.status === "menunggu";

        return {
          id: k.id,
          name: k.full_name,
          kelas: k.program ?? "-",
          avatar: avatar.toUpperCase(),
          avatarColor: getAvatarColor(i),
          jamMasuk: formatTime(att?.jam_checkin ?? null),
          checkInStatus,
          pickupRequestId: pickup?.id ?? null,
          penjemput: pickup?.pickup_person_name ?? null,
          relationship: pickup?.relationship ?? null,
          pickupRequestStatus: pickup?.status ?? null,
          status: isApproved ? "dijemput" : "menunggu",
          // kalau sudah approved, tampilkan jam jemput aktual
          jamJemput: isApproved
            ? formatTime(pickup?.pickup_time ?? null)
            : formatTime(pickup?.pickup_time ?? null), // jam estimasi dari ortu
          hasOrangTuaRequest,
          fotoPenjemputan: null,
        };
      });

      setChildren(mapped);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Realtime: update otomatis kalau ortu baru kirim request ───────────────
  useEffect(() => {
    const channel = supabase
      .channel("pengasuh-pickup-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pickup_requests" },
        () => {
          // Reload data supaya list langsung update saat ada request baru dari ortu
          loadData();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  // ── Checkout: approve request ortu atau buat baru (langsung checkout) ─────

  const handleConfirmCheckout = async (childId: string, fotoFile: File | null) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return;

    const now   = new Date().toTimeString().slice(0, 8);
    const today = todayStr();
    let fotoUrl: string | null = null;

    if (fotoFile) {
      const filePath = `pickup/${childId}/${today}_${Date.now()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from("pickup-photos")
        .upload(filePath, fotoFile, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = await supabase.storage
        .from("pickup-photos")
        .createSignedUrl(filePath, 60 * 60 * 24);
      fotoUrl = urlData?.signedUrl ?? null;
    }

    if (child.pickupRequestId) {
      // Ada request dari ortu → approve + update jam jemput aktual
      const { error } = await supabase
        .from("pickup_requests")
        .update({
          status: "approved",
          pickup_time: now, // overwrite dengan jam aktual saat checkout
          ...(fotoUrl ? { foto_url: fotoUrl } : {}),
        })
        .eq("id", child.pickupRequestId);
      if (error) throw error;
    } else {
      // Tidak ada request dari ortu → pengasuh langsung checkout
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("pickup_requests")
        .insert({
          child_id: childId,
          requested_by: user?.id,
          pickup_person_name: "Dijemput langsung",
          relationship: "family_member",
          status: "approved",
          pickup_date: today,
          pickup_time: now,
          ...(fotoUrl ? { foto_url: fotoUrl } : {}),
        });
      if (error) throw error;
    }

    await loadData();
    setModalChild(null);
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const dijemput        = children.filter((c) => c.status === "dijemput").length;
  const menunggu        = children.filter((c) => c.status === "menunggu").length;
  const belumHadir      = children.filter((c) => c.checkInStatus === "belum").length;
  const total           = children.length;
  // Anak yang sudah ada request ortu tapi belum di-checkout
  const pendingRequests = children.filter((c) => c.hasOrangTuaRequest && c.checkInStatus === "hadir");

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.penjemput ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const canCheckout     = (child: Child) => child.status === "menunggu" && child.checkInStatus === "hadir";
  const checkoutBlocked = (child: Child) => child.status === "menunggu" && child.checkInStatus !== "hadir";

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading && children.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-[#1883FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{error}</div>
        <button onClick={loadData} className="px-4 py-2 bg-[#1883FF] text-white rounded-xl text-sm font-bold">Coba Lagi</button>
      </div>
    );
  }

  return (
    <>
      {modalChild && (
        <UploadFotoModal
          child={modalChild}
          onClose={() => setModalChild(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      <div className="space-y-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── ALERT: Request pending dari orang tua ── */}
        {pendingRequests.length > 0 && (
          <div className="bg-[#EBF4FF] border-2 border-[#1883FF]/30 rounded-2xl px-5 py-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-[#1883FF] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Bell size={16} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#1883FF] mb-1">
                {pendingRequests.length} Request Penjemputan Masuk
              </p>
              <div className="flex flex-wrap gap-2">
                {pendingRequests.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setModalChild(c)}
                    className="flex items-center gap-1.5 bg-white border border-[#1883FF]/30 rounded-xl px-3 py-1.5 text-[11px] font-bold text-[#1883FF] hover:bg-[#1883FF] hover:text-white transition-all"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#1883FF]/10 flex items-center justify-center text-[9px]">{c.avatar}</span>
                    {c.name}
                    {c.jamJemput && <span className="text-[10px] opacity-70">· {c.jamJemput}</span>}
                    <span className="text-[10px] opacity-70">→ {c.penjemput}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Hadir",     value: total - belumHadir,  bg: "#1883FF", sub: "Sudah check-in",       icon: <Car size={15} color="#1883FF" /> },
            { label: "Sudah Dijemput",  value: dijemput,            bg: "#C4E02F", sub: `${total ? Math.round((dijemput/total)*100) : 0}% dari total`, icon: <CheckCircle2 size={15} color="#4a7500" /> },
            { label: "Menunggu Jemput", value: menunggu,            bg: "#FFE26F", sub: "Masih di daycare",     icon: <Clock size={15} color="#a07000" /> },
            { label: "Request Ortu",    value: pendingRequests.length, bg: "#99ADFF", sub: "Perlu dikonfirmasi", icon: <Bell size={15} color="#3344aa" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0] hover:shadow-md hover:scale-[1.02] transition-all cursor-default">
              <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg + "20" }}>{s.icon}</div>
              <p className="text-2xl font-bold text-[#1A1A1A] leading-none mb-1">{s.value}</p>
              <p className="text-[11px] font-semibold text-[#1A1A1A]">{s.label}</p>
              <p className="text-[10px] text-[#4A4A4A]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── PROGRESS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#1A1A1A]">Progress Penjemputan</p>
            <span className="text-[12px] font-bold text-[#1883FF]">{dijemput}/{total}</span>
          </div>
          <div className="w-full h-2.5 bg-[#F4F6FA] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${total ? (dijemput / total) * 100 : 0}%`, background: "#1883FF" }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-[#4A4A4A]">{menunggu} anak masih menunggu jemputan</p>
            {pendingRequests.length > 0 && (
              <div className="flex items-center gap-1">
                <Bell size={9} color="#1883FF" />
                <p className="text-[10px] text-[#1883FF] font-semibold">{pendingRequests.length} request ortu perlu dikonfirmasi</p>
              </div>
            )}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A]">Daftar Penjemputan</p>
              <p className="text-[10px] text-[#4A4A4A] mt-0.5 flex items-center gap-1">
                <Camera size={10} /> Foto penjemputan otomatis dikirim ke orang tua
              </p>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
              <input type="text" placeholder="Cari nama / penjemput..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-[11px] border border-[#F0F0F0] rounded-xl bg-[#F4F6FA] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 w-48 placeholder:text-[#4A4A4A]/40" />
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#F4F6FA] border-b border-[#F0F0F0]">
            {["Anak", "Program", "Jam Masuk", "Penjemput (Request Ortu)", "Status", "Aksi"].map((h, i) => (
              <p key={h} className={`${i === 3 ? "col-span-3" : "col-span-2"} text-[9px] font-bold uppercase tracking-wider text-[#4A4A4A]`}>{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#F0F0F0]">
            {filtered.length === 0 ? (
              <p className="text-center text-[12px] text-[#4A4A4A]/40 py-8">Tidak ada data</p>
            ) : filtered.map((child) => {
              const blocked = checkoutBlocked(child);
              const isAbsen = child.checkInStatus === "izin" || child.checkInStatus === "sakit";
              // Row highlight kalau ada request pending dari ortu
              const hasPending = child.hasOrangTuaRequest && child.checkInStatus === "hadir";

              return (
                <div key={child.id}
                  className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 transition-colors"
                  style={{
                    background: hasPending
                      ? "#EBF4FF"
                      : blocked
                      ? "#FFF8F8"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasPending && !blocked)
                      e.currentTarget.style.background = "#F4F6FA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = hasPending
                      ? "#EBF4FF"
                      : blocked
                      ? "#FFF8F8"
                      : "transparent";
                  }}>

                  {/* Anak */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                        style={{ background: child.avatarColor + "20", color: child.avatarColor }}>
                        {child.avatar}
                      </div>
                      {/* Dot notif kalau ada pending request */}
                      {hasPending && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1883FF] rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[#1A1A1A] truncate">{child.name}</p>
                  </div>

                  {/* Program */}
                  <p className="col-span-2 text-[11px] text-[#4A4A4A] truncate">{child.kelas}</p>

                  {/* Jam Masuk */}
                  <div className="col-span-2">
                    {child.jamMasuk ? (
                      <div className="flex items-center gap-1">
                        <Clock size={9} color="#4a7500" />
                        <p className="text-[11px] font-semibold text-[#1A1A1A]">{child.jamMasuk}</p>
                      </div>
                    ) : isAbsen ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: child.checkInStatus === "sakit" ? "#FFA9DD22" : "#99ADFF22", color: child.checkInStatus === "sakit" ? "#aa3366" : "#3344aa" }}>
                        {child.checkInStatus === "sakit" ? "🤒 Sakit" : "📋 Izin"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFE26F] animate-pulse" />
                        <p className="text-[10px] text-[#a07000] font-semibold">Belum hadir</p>
                      </div>
                    )}
                  </div>

                  {/* Penjemput + Request Ortu — KOLOM DIPERLEBAR */}
                  <div className="col-span-3">
                    {child.penjemput ? (
                      <div className="space-y-1">
                        {/* Badge "Request Ortu" kalau status masih menunggu */}
                        {child.hasOrangTuaRequest && (
                          <div className="flex items-center gap-1 mb-1">
                            <Bell size={9} color="#1883FF" />
                            <span className="text-[9px] font-bold text-[#1883FF] bg-[#1883FF]/10 px-1.5 py-0.5 rounded-full">
                              Request Ortu
                            </span>
                            {child.jamJemput && (
                              <span className="text-[9px] text-[#1883FF] font-semibold">· est. {child.jamJemput}</span>
                            )}
                          </div>
                        )}
                        <p className="text-[11px] text-[#1A1A1A] font-semibold">{child.penjemput}</p>
                        {child.relationship && (
                          <p className="text-[9px] text-[#4A4A4A]">{RELATIONSHIP_LABEL[child.relationship] ?? child.relationship}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#4A4A4A]/40 italic">Belum ada request ortu</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 space-y-1">
                    {child.status === "dijemput" ? (
                      <>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                          style={{ background: "#C4E02F25", color: "#5a8a00" }}>
                          <CheckCircle2 size={10} /> Dijemput
                        </span>
                        {child.jamJemput && <p className="text-[9px] text-[#4A4A4A] pl-1">{child.jamJemput}</p>}
                      </>
                    ) : blocked ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#FFA9DD22", color: "#aa3366" }}>
                        <Lock size={9} /> Terkunci
                      </span>
                    ) : isAbsen ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#99ADFF22", color: "#3344aa" }}>
                        <UserX size={9} /> Tidak hadir
                      </span>
                    ) : hasPending ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#1883FF15", color: "#1883FF" }}>
                        <Bell size={9} className="animate-pulse" /> Perlu konfirmasi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: "#FFE26F25", color: "#a07000" }}>
                        <Clock size={10} /> Menunggu
                      </span>
                    )}
                  </div>

                  {/* Aksi */}
                  <div className="col-span-1 relative">
                    {child.status === "dijemput" ? (
                      <div className="flex items-center gap-1 text-[#5a8a00]">
                        <CheckCircle2 size={13} />
                        <span className="text-[10px] font-semibold">Selesai</span>
                      </div>
                    ) : isAbsen ? (
                      <span className="text-[10px] text-[#999] font-medium flex items-center gap-1">
                        <UserX size={11} /> Tidak hadir
                      </span>
                    ) : blocked ? (
                      <div className="relative">
                        <button disabled
                          onMouseEnter={() => setTooltipId(child.id)}
                          onMouseLeave={() => setTooltipId(null)}
                          className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-not-allowed"
                          style={{ background: "#F0EDE6", color: "#ccc" }}>
                          <Lock size={10} /> Check-out
                        </button>
                        {tooltipId === child.id && (
                          <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", zIndex: 20, background: "#1A1A1A", color: "#fff", fontSize: "10px", fontWeight: 600, fontFamily: "'Montserrat', sans-serif", padding: "6px 10px", borderRadius: "8px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                            Anak belum check-in hari ini
                            <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1A1A1A" }} />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Tombol Check-out: biru biasa kalau tidak ada request ortu,
                         biru bold kalau ada request pending dari ortu */
                      <button
                        onClick={() => setModalChild(child)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-white px-3 py-1.5 rounded-lg hover:scale-105 transition-all shadow-sm"
                        style={{
                          background: hasPending
                            ? "linear-gradient(135deg, #1883FF 0%, #0052cc 100%)"
                            : "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)",
                          boxShadow: hasPending
                            ? "0 2px 10px rgba(24,131,255,0.4)"
                            : "0 2px 8px rgba(24,131,255,0.25)",
                        }}>
                        <Camera size={11} />
                        {hasPending ? "Approve" : "Check-out"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}