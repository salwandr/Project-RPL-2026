"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const REKENING = [
  { bank: "BCA", noRek: "1234 5678 90", atasNama: "Tanika Daycare", warna: "#1883FF", icon: "🏦" },
  { bank: "Mandiri", noRek: "0987 6543 210", atasNama: "Tanika Daycare", warna: "#FEB700", icon: "🏛️" },
  { bank: "BRI", noRek: "0011 2233 4455", atasNama: "Tanika Daycare", warna: "#C4E02F", icon: "🏪" },
];

type StatusUpload = "idle" | "uploading" | "success" | "error";

export default function PembayaranPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBank, setSelectedBank] = useState(0);
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
  const [namaPengirim, setNamaPengirim] = useState("");
  const [jumlahTransfer, setJumlahTransfer] = useState("");
  const [tanggalTransfer, setTanggalTransfer] = useState("");
  const [catatan, setCatatan] = useState("");
  const [statusUpload, setStatusUpload] = useState<StatusUpload>("idle");
  const [copied, setCopied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ambil dari sessionStorage (idealnya dari state management)
  const programId = typeof window !== "undefined"
    ? sessionStorage.getItem("selected_program") ?? "full-day"
    : "full-day";

  const programMap: Record<string, { name: string; harga: number }> = {
    "full-day": { name: "Full Day Care", harga: 2500000 },
    "half-day-pagi": { name: "Half Day Pagi", harga: 1500000 },
    "half-day-siang": { name: "Half Day Siang", harga: 1500000 },
    "playgroup": { name: "Playgroup", harga: 900000 },
  };

  const program = programMap[programId] ?? programMap["full-day"];
  const rekening = REKENING[selectedBank];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBuktiFile(file);
    const url = URL.createObjectURL(file);
    setBuktiPreview(url);
    setErrors((prev) => ({ ...prev, bukti: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!buktiFile) errs.bukti = "Bukti transfer wajib diupload";
    if (!namaPengirim.trim()) errs.namaPengirim = "Nama pengirim wajib diisi";
    if (!jumlahTransfer.trim()) errs.jumlahTransfer = "Jumlah transfer wajib diisi";
    if (!tanggalTransfer) errs.tanggalTransfer = "Tanggal transfer wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setStatusUpload("uploading");

    // Simulate upload
    await new Promise((r) => setTimeout(r, 2000));

    setStatusUpload("success");
  };

  if (statusUpload === "success") {
    return (
      <div
        style={{
          minHeight: "100vh", background: "#FFFDF7", fontFamily: "'Montserrat', sans-serif",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px 24px", textAlign: "center",
        }}
      >
        {/* Success illustration */}
        <div
          style={{
            width: "96px", height: "96px", borderRadius: "50%", background: "#C4E02F",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "44px", marginBottom: "24px",
            boxShadow: "0 0 0 12px #C4E02F33, 0 0 0 24px #C4E02F11",
          }}
        >
          ✓
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          Pembayaran Dikirim!
        </h1>
        <p style={{ fontSize: "14px", color: "#4A4A4A", margin: "0 0 32px", lineHeight: "1.6", fontWeight: 500 }}>
          Bukti transfer Anda sedang diverifikasi oleh tim Tanika Daycare.
          Proses verifikasi memakan waktu{" "}
          <strong style={{ color: "#1A1A1A" }}>1–2 hari kerja</strong>.
        </p>

        {/* Info card */}
        <div
          style={{
            width: "100%", maxWidth: "360px", background: "#fff",
            border: "1.5px solid #FFE26F", borderRadius: "16px", padding: "20px", marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Program", value: program.name },
              { label: "Bank Tujuan", value: rekening.bank },
              { label: "Jumlah Transfer", value: `Rp ${Number(jumlahTransfer.replace(/\D/g, "")).toLocaleString("id-ID")}` },
              { label: "Status", value: "⏳ Menunggu Verifikasi" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "360px" }}>
          <button
            onClick={() => router.push("/dashboard/orang-tua")}
            style={{
              width: "100%", padding: "16px", background: "#1A1A1A", color: "#FFE26F",
              border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 800,
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Lihat Status Pendaftaran
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%", padding: "16px", background: "transparent", color: "#4A4A4A",
              border: "1.5px solid #E8E4DB", borderRadius: "14px", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF7", fontFamily: "'Montserrat', sans-serif", paddingBottom: "120px" }}>
      {/* Header */}
      <div style={{ background: "#1A1A1A", padding: "20px 24px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none", border: "none", color: "#FFE26F", fontSize: "14px",
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", padding: 0,
          }}
        >
          ← Kembali
        </button>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
          Upload Pembayaran
        </h1>
        <p style={{ color: "#999", fontSize: "13px", margin: "4px 0 0", fontWeight: 500 }}>
          Transfer dan upload bukti bayar
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
          {["Pilih Program", "Data Anak", "Pembayaran"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: i < 2 ? "#C4E02F" : "#1883FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700, color: "#1A1A1A",
                }}>
                  {i < 2 ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: i === 2 ? 700 : 500,
                  color: i < 2 ? "#C4E02F" : "#FFE26F",
                }}>
                  {step}
                </span>
              </div>
              {i < 2 && <div style={{ width: "20px", height: "1px", background: "#444" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Ringkasan Program */}
        <div
          style={{
            background: "#1A1A1A", borderRadius: "16px", padding: "18px",
            marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: "#999", fontSize: "11px", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>
              Program Dipilih
            </p>
            <p style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "4px 0 0" }}>
              {program.name}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#999", fontSize: "11px", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>
              Total Bayar
            </p>
            <p style={{ color: "#FFE26F", fontSize: "22px", fontWeight: 800, margin: "4px 0 0", letterSpacing: "-0.5px" }}>
              Rp {program.harga.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Pilih Bank */}
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
          Transfer ke Rekening
        </p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          {REKENING.map((r, i) => (
            <button
              key={r.bank}
              onClick={() => setSelectedBank(i)}
              style={{
                flex: 1, padding: "10px 6px",
                border: `2px solid ${selectedBank === i ? r.warna : "#E8E4DB"}`,
                borderRadius: "10px", background: selectedBank === i ? r.warna + "18" : "#fff",
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800, fontSize: "13px",
                color: selectedBank === i ? r.warna : "#999",
                transition: "all 0.2s ease",
              }}
            >
              {r.bank}
            </button>
          ))}
        </div>

        {/* Rekening Detail */}
        <div
          style={{
            background: "#fff", border: "1.5px solid #FFE26F", borderRadius: "14px",
            padding: "18px", marginBottom: "20px",
          }}
        >
          {[
            { label: "Bank", value: rekening.bank },
            { label: "No. Rekening", value: rekening.noRek, copyKey: "noRek", copyValue: rekening.noRek },
            { label: "Atas Nama", value: rekening.atasNama },
            { label: "Nominal", value: `Rp ${program.harga.toLocaleString("id-ID")}`, copyKey: "nominal", copyValue: program.harga.toString() },
          ].map(({ label, value, copyKey, copyValue }) => (
            <div
              key={label}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid #F7F5F0",
              }}
            >
              <span style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 700 }}>{value}</span>
                {copyKey && copyValue && (
                  <button
                    onClick={() => handleCopy(copyValue, copyKey)}
                    style={{
                      padding: "3px 10px", borderRadius: "6px", border: "none",
                      background: copied === copyKey ? "#C4E02F" : "#F7F5F0",
                      color: copied === copyKey ? "#1A1A1A" : "#4A4A4A",
                      fontSize: "11px", fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease",
                    }}
                  >
                    {copied === copyKey ? "✓ Disalin" : "Salin"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Bukti */}
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
          Upload Bukti Transfer *
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${errors.bukti ? "#FF4D4F" : buktiFile ? "#C4E02F" : "#FFE26F"}`,
            borderRadius: "14px", padding: "20px", cursor: "pointer",
            background: buktiFile ? "#F5FBDC" : "#FFF8E8",
            marginBottom: "16px", transition: "all 0.2s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          }}
        >
          {buktiPreview ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                src={buktiPreview} alt="Bukti transfer"
                style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "10px", objectFit: "contain" }}
              />
              <p style={{ fontSize: "12px", color: "#4A4A4A", fontWeight: 600, margin: "10px 0 0" }}>
                ✓ {buktiFile?.name} · Tap untuk ganti
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "36px" }}>📎</div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
                  Tap untuk upload bukti
                </p>
                <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0", fontWeight: 500 }}>
                  JPG, PNG, atau PDF · Maks 5MB
                </p>
              </div>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFilePick} style={{ display: "none" }} />
        {errors.bukti && (
          <p style={{ fontSize: "11px", color: "#FF4D4F", margin: "-10px 0 16px", fontWeight: 600 }}>
            ⚠ {errors.bukti}
          </p>
        )}

        {/* Form Konfirmasi */}
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
          Konfirmasi Transfer
        </p>

        {[
          {
            label: "Nama Pengirim *", key: "namaPengirim", value: namaPengirim,
            set: setNamaPengirim, placeholder: "Sesuai nama di rekening bank",
          },
        ].map(({ label, key, value, set: setter, placeholder }) => (
          <div key={key} style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {label}
            </label>
            <input
              style={{
                width: "100%", padding: "13px 14px",
                border: `1.5px solid ${errors[key] ? "#FF4D4F" : "#E8E4DB"}`,
                borderRadius: "10px", fontSize: "14px", fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500, color: "#1A1A1A", background: "#fff", outline: "none",
                boxSizing: "border-box",
              }}
              placeholder={placeholder}
              value={value}
              onChange={(e) => { setter(e.target.value); setErrors((p) => ({ ...p, [key]: "" })); }}
            />
            {errors[key] && <p style={{ fontSize: "11px", color: "#FF4D4F", margin: "4px 0 0", fontWeight: 600 }}>⚠ {errors[key]}</p>}
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Jumlah Transfer *
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                fontSize: "13px", fontWeight: 700, color: "#999",
              }}>Rp</span>
              <input
                style={{
                  width: "100%", padding: "13px 14px 13px 36px",
                  border: `1.5px solid ${errors.jumlahTransfer ? "#FF4D4F" : "#E8E4DB"}`,
                  borderRadius: "10px", fontSize: "14px", fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600, color: "#1A1A1A", background: "#fff", outline: "none",
                  boxSizing: "border-box",
                }}
                placeholder="2.500.000"
                type="number"
                value={jumlahTransfer}
                onChange={(e) => { setJumlahTransfer(e.target.value); setErrors((p) => ({ ...p, jumlahTransfer: "" })); }}
              />
            </div>
            {errors.jumlahTransfer && <p style={{ fontSize: "11px", color: "#FF4D4F", margin: "4px 0 0", fontWeight: 600 }}>⚠ {errors.jumlahTransfer}</p>}
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Tanggal Transfer *
            </label>
            <input
              type="date"
              style={{
                width: "100%", padding: "13px 14px",
                border: `1.5px solid ${errors.tanggalTransfer ? "#FF4D4F" : "#E8E4DB"}`,
                borderRadius: "10px", fontSize: "13px", fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500, color: "#1A1A1A", background: "#fff", outline: "none",
                boxSizing: "border-box",
              }}
              max={new Date().toISOString().split("T")[0]}
              value={tanggalTransfer}
              onChange={(e) => { setTanggalTransfer(e.target.value); setErrors((p) => ({ ...p, tanggalTransfer: "" })); }}
            />
            {errors.tanggalTransfer && <p style={{ fontSize: "11px", color: "#FF4D4F", margin: "4px 0 0", fontWeight: 600 }}>⚠ {errors.tanggalTransfer}</p>}
          </div>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "12px", fontWeight: 700, color: "#4A4A4A", marginBottom: "6px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Catatan (opsional)
          </label>
          <textarea
            style={{
              width: "100%", padding: "13px 14px", border: "1.5px solid #E8E4DB", borderRadius: "10px",
              fontSize: "14px", fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
              color: "#1A1A1A", background: "#fff", outline: "none", boxSizing: "border-box",
              minHeight: "80px", resize: "vertical",
            }}
            placeholder="Contoh: Transfer dari rekening bersama"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "16px 20px 28px",
          background: "linear-gradient(to top, #FFFDF7 80%, transparent)",
          zIndex: 40,
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={statusUpload === "uploading"}
          style={{
            width: "100%", padding: "16px",
            background: statusUpload === "uploading" ? "#4A4A4A" : "#1A1A1A",
            color: "#FFE26F", border: "none", borderRadius: "14px",
            fontSize: "15px", fontWeight: 800, cursor: statusUpload === "uploading" ? "not-allowed" : "pointer",
            fontFamily: "'Montserrat', sans-serif", letterSpacing: "-0.3px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          {statusUpload === "uploading" ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
              Mengirim Pembayaran...
            </>
          ) : (
            "✓ Kirim Bukti Pembayaran"
          )}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}