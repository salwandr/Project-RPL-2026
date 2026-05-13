"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  namaAnak: string;
  tanggalLahir: string;
  jenisKelamin: string;
  beratLahir: string;
  tinggiBadan: string;
  beratBadan: string;
  golonganDarah: string;
  alergi: string;
  kondisiKhusus: string;
  namaAyah: string;
  namaIbu: string;
  noHpAyah: string;
  noHpIbu: string;
  alamat: string;
  namaKontak: string;
  hubunganKontak: string;
  noHpKontak: string;
  fotoAnak: File | null;
};

const initialForm: FormData = {
  namaAnak: "",
  tanggalLahir: "",
  jenisKelamin: "",
  beratLahir: "",
  tinggiBadan: "",
  beratBadan: "",
  golonganDarah: "",
  alergi: "",
  kondisiKhusus: "",
  namaAyah: "",
  namaIbu: "",
  noHpAyah: "",
  noHpIbu: "",
  alamat: "",
  namaKontak: "",
  hubunganKontak: "",
  noHpKontak: "",
  fotoAnak: null,
};

type Section = "identitas" | "kesehatan" | "orang-tua" | "darurat";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "identitas", label: "Identitas Anak", icon: "👶" },
  { id: "kesehatan", label: "Info Kesehatan", icon: "🏥" },
  { id: "orang-tua", label: "Data Orang Tua", icon: "👨‍👩‍👧" },
  { id: "darurat", label: "Kontak Darurat", icon: "🚨" },
];

export default function DataAnakPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [activeSection, setActiveSection] = useState<Section>("identitas");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, fotoAnak: file }));
    const url = URL.createObjectURL(file);
    setFotoPreview(url);
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.namaAnak.trim()) newErrors.namaAnak = "Nama anak wajib diisi";
    if (!form.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!form.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!form.namaAyah.trim() && !form.namaIbu.trim())
      newErrors.namaAyah = "Minimal satu nama orang tua wajib diisi";
    if (!form.noHpAyah.trim() && !form.noHpIbu.trim())
      newErrors.noHpAyah = "Minimal satu nomor HP wajib diisi";
    if (!form.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanjut = () => {
    if (!validate()) {
      // Jump to first section with error
      if (errors.namaAnak || errors.tanggalLahir || errors.jenisKelamin) {
        setActiveSection("identitas");
      } else if (errors.namaAyah || errors.noHpAyah || errors.alamat) {
        setActiveSection("orang-tua");
      }
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("data_anak", JSON.stringify({ ...form, fotoAnak: null }));
    }
    router.push("/dashboard/orang-tua/daftar/pembayaran");
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px 14px",
    border: `1.5px solid ${hasError ? "#FF4D4F" : "#E8E4DB"}`,
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    color: "#1A1A1A",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#4A4A4A",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const fieldGroup = (children: React.ReactNode, style?: React.CSSProperties) => (
    <div style={{ marginBottom: "16px", ...style }}>{children}</div>
  );

  const errorText = (msg?: string) =>
    msg ? (
      <p style={{ fontSize: "11px", color: "#FF4D4F", margin: "4px 0 0", fontWeight: 600 }}>
        ⚠ {msg}
      </p>
    ) : null;

  const sectionIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFDF7",
        fontFamily: "'Montserrat', sans-serif",
        paddingBottom: "120px",
      }}
    >
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
          Data Anak
        </h1>
        <p style={{ color: "#999", fontSize: "13px", margin: "4px 0 0", fontWeight: 500 }}>
          Lengkapi informasi anak Anda
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
          {["Pilih Program", "Data Anak", "Pembayaran"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: i === 0 ? "#C4E02F" : i === 1 ? "#1883FF" : "#333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700,
                  color: i === 2 ? "#666" : "#1A1A1A",
                }}>
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: i === 1 ? 700 : 500,
                  color: i === 0 ? "#C4E02F" : i === 1 ? "#FFE26F" : "#666",
                }}>
                  {step}
                </span>
              </div>
              {i < 2 && <div style={{ width: "20px", height: "1px", background: "#333" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div
        style={{
          display: "flex", gap: "8px", padding: "16px 20px",
          overflowX: "auto", background: "#fff",
          borderBottom: "1.5px solid #F0EDE6",
          scrollbarWidth: "none",
        }}
      >
        {sections.map((s) => {
          const isActive = s.id === activeSection;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: "8px 14px", borderRadius: "20px", border: "none", cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 700,
                whiteSpace: "nowrap", transition: "all 0.2s ease",
                background: isActive ? "#1A1A1A" : "#F7F5F0",
                color: isActive ? "#FFE26F" : "#4A4A4A",
              }}
            >
              {s.icon} {s.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div style={{ padding: "24px 20px 0" }}>

        {/* ── IDENTITAS ── */}
        {activeSection === "identitas" && (
          <div>
            {/* Foto Upload */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "96px", height: "96px", borderRadius: "50%",
                  border: "2.5px dashed #FFE26F", background: "#FFF8E8",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", overflow: "hidden", position: "relative",
                  transition: "border-color 0.2s ease",
                }}
              >
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto anak" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "28px" }}>📷</div>
                    <p style={{ fontSize: "10px", color: "#4A4A4A", margin: "4px 0 0", fontWeight: 600 }}>
                      Foto Anak
                    </p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
            </div>

            {fieldGroup(
              <>
                <label style={labelStyle}>Nama Lengkap Anak *</label>
                <input
                  style={inputStyle(!!errors.namaAnak)}
                  placeholder="Contoh: Bintang Cahaya Pertiwi"
                  value={form.namaAnak}
                  onChange={(e) => set("namaAnak", e.target.value)}
                />
                {errorText(errors.namaAnak)}
              </>
            )}

            {fieldGroup(
              <>
                <label style={labelStyle}>Tanggal Lahir *</label>
                <input
                  type="date" style={inputStyle(!!errors.tanggalLahir)}
                  value={form.tanggalLahir} onChange={(e) => set("tanggalLahir", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errorText(errors.tanggalLahir)}
              </>
            )}

            {fieldGroup(
              <>
                <label style={labelStyle}>Jenis Kelamin *</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["Laki-laki", "Perempuan"].map((jk) => (
                    <button
                      key={jk}
                      onClick={() => set("jenisKelamin", jk)}
                      style={{
                        flex: 1, padding: "13px", border: `1.5px solid ${form.jenisKelamin === jk ? "#1883FF" : "#E8E4DB"}`,
                        borderRadius: "10px", background: form.jenisKelamin === jk ? "#EBF4FF" : "#fff",
                        color: form.jenisKelamin === jk ? "#1883FF" : "#4A4A4A",
                        fontSize: "13px", fontWeight: 700, cursor: "pointer",
                        fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s ease",
                      }}
                    >
                      {jk === "Laki-laki" ? "👦 " : "👧 "}{jk}
                    </button>
                  ))}
                </div>
                {errorText(errors.jenisKelamin)}
              </>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {fieldGroup(
                <>
                  <label style={labelStyle}>Berat Lahir (kg)</label>
                  <input style={inputStyle()} placeholder="3.5" value={form.beratLahir}
                    onChange={(e) => set("beratLahir", e.target.value)} type="number" step="0.1" />
                </>,
                { marginBottom: 0 }
              )}
              {fieldGroup(
                <>
                  <label style={labelStyle}>Gol. Darah</label>
                  <select
                    style={{ ...inputStyle(), color: form.golonganDarah ? "#1A1A1A" : "#999" }}
                    value={form.golonganDarah} onChange={(e) => set("golonganDarah", e.target.value)}
                  >
                    <option value="">Pilih</option>
                    {["A", "B", "AB", "O", "Belum tahu"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </>,
                { marginBottom: 0 }
              )}
            </div>
          </div>
        )}

        {/* ── KESEHATAN ── */}
        {activeSection === "kesehatan" && (
          <div>
            <div
              style={{
                background: "#EBF4FF", border: "1px solid #99ADFF", borderRadius: "12px",
                padding: "14px", marginBottom: "20px", display: "flex", gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>ℹ️</span>
              <p style={{ fontSize: "12px", color: "#1883FF", fontWeight: 600, margin: 0, lineHeight: "1.5" }}>
                Informasi kesehatan membantu pengasuh memberikan perawatan terbaik untuk anak Anda.
                Semua data bersifat rahasia.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {fieldGroup(
                <>
                  <label style={labelStyle}>Tinggi Badan (cm)</label>
                  <input style={inputStyle()} placeholder="90" value={form.tinggiBadan}
                    onChange={(e) => set("tinggiBadan", e.target.value)} type="number" />
                </>,
                { marginBottom: 0 }
              )}
              {fieldGroup(
                <>
                  <label style={labelStyle}>Berat Badan (kg)</label>
                  <input style={inputStyle()} placeholder="12.5" value={form.beratBadan}
                    onChange={(e) => set("beratBadan", e.target.value)} type="number" step="0.1" />
                </>,
                { marginBottom: 0 }
              )}
            </div>

            {fieldGroup(
              <>
                <label style={labelStyle}>Alergi</label>
                <textarea
                  style={{ ...inputStyle(), minHeight: "90px", resize: "vertical" }}
                  placeholder="Contoh: Alergi kacang tanah, susu sapi, debu..."
                  value={form.alergi} onChange={(e) => set("alergi", e.target.value)}
                />
                <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0", fontWeight: 500 }}>
                  Kosongkan jika tidak ada alergi
                </p>
              </>
            )}

            {fieldGroup(
              <>
                <label style={labelStyle}>Kondisi / Kebutuhan Khusus</label>
                <textarea
                  style={{ ...inputStyle(), minHeight: "90px", resize: "vertical" }}
                  placeholder="Contoh: Asma ringan, sedang dalam terapi wicara, membutuhkan perhatian ekstra saat makan..."
                  value={form.kondisiKhusus} onChange={(e) => set("kondisiKhusus", e.target.value)}
                />
                <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0", fontWeight: 500 }}>
                  Kosongkan jika tidak ada kondisi khusus
                </p>
              </>
            )}
          </div>
        )}

        {/* ── ORANG TUA ── */}
        {activeSection === "orang-tua" && (
          <div>
            <div style={{ background: "#FFF8E8", border: "1px solid #FFE26F", borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#4A4A4A", fontWeight: 600, margin: 0 }}>
                👨‍👩‍👧 Isi minimal satu data orang tua (Ayah atau Ibu)
              </p>
            </div>

            <p style={{ fontSize: "13px", fontWeight: 800, color: "#1A1A1A", marginBottom: "12px" }}>Data Ayah</p>

            {fieldGroup(
              <>
                <label style={labelStyle}>Nama Ayah</label>
                <input style={inputStyle(!!errors.namaAyah)} placeholder="Nama lengkap ayah"
                  value={form.namaAyah} onChange={(e) => set("namaAyah", e.target.value)} />
                {errorText(errors.namaAyah)}
              </>
            )}
            {fieldGroup(
              <>
                <label style={labelStyle}>No. HP Ayah</label>
                <input style={inputStyle(!!errors.noHpAyah)} placeholder="08xxxxxxxxxx" type="tel"
                  value={form.noHpAyah} onChange={(e) => set("noHpAyah", e.target.value)} />
                {errorText(errors.noHpAyah)}
              </>
            )}

            <div style={{ height: "1px", background: "#F0EDE6", margin: "20px 0" }} />
            <p style={{ fontSize: "13px", fontWeight: 800, color: "#1A1A1A", marginBottom: "12px" }}>Data Ibu</p>

            {fieldGroup(
              <>
                <label style={labelStyle}>Nama Ibu</label>
                <input style={inputStyle()} placeholder="Nama lengkap ibu"
                  value={form.namaIbu} onChange={(e) => set("namaIbu", e.target.value)} />
              </>
            )}
            {fieldGroup(
              <>
                <label style={labelStyle}>No. HP Ibu</label>
                <input style={inputStyle()} placeholder="08xxxxxxxxxx" type="tel"
                  value={form.noHpIbu} onChange={(e) => set("noHpIbu", e.target.value)} />
              </>
            )}

            <div style={{ height: "1px", background: "#F0EDE6", margin: "20px 0" }} />
            {fieldGroup(
              <>
                <label style={labelStyle}>Alamat Rumah *</label>
                <textarea
                  style={{ ...inputStyle(!!errors.alamat), minHeight: "90px", resize: "vertical" }}
                  placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota"
                  value={form.alamat} onChange={(e) => set("alamat", e.target.value)}
                />
                {errorText(errors.alamat)}
              </>
            )}
          </div>
        )}

        {/* ── DARURAT ── */}
        {activeSection === "darurat" && (
          <div>
            <div style={{ background: "#FFF0F0", border: "1px solid #FFA9A9", borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#CC3333", fontWeight: 600, margin: 0, lineHeight: "1.5" }}>
                🚨 Kontak darurat adalah orang yang akan dihubungi jika orang tua tidak dapat dihubungi.
                Pastikan nomor selalu aktif.
              </p>
            </div>

            {fieldGroup(
              <>
                <label style={labelStyle}>Nama Kontak Darurat</label>
                <input style={inputStyle()} placeholder="Nama lengkap"
                  value={form.namaKontak} onChange={(e) => set("namaKontak", e.target.value)} />
              </>
            )}
            {fieldGroup(
              <>
                <label style={labelStyle}>Hubungan dengan Anak</label>
                <select style={inputStyle()} value={form.hubunganKontak}
                  onChange={(e) => set("hubunganKontak", e.target.value)}>
                  <option value="">Pilih hubungan</option>
                  {["Kakek/Nenek", "Paman/Bibi", "Saudara Kandung", "Tetangga", "Pengasuh", "Lainnya"].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </>
            )}
            {fieldGroup(
              <>
                <label style={labelStyle}>No. HP Kontak Darurat</label>
                <input style={inputStyle()} placeholder="08xxxxxxxxxx" type="tel"
                  value={form.noHpKontak} onChange={(e) => set("noHpKontak", e.target.value)} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "16px 20px 28px",
          background: "linear-gradient(to top, #FFFDF7 80%, transparent)",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {sectionIndex > 0 && (
            <button
              onClick={() => setActiveSection(sections[sectionIndex - 1].id)}
              style={{
                padding: "16px 20px", border: "1.5px solid #E8E4DB", borderRadius: "14px",
                background: "#fff", color: "#1A1A1A", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
              }}
            >
              ←
            </button>
          )}

          <button
            onClick={() => {
              if (sectionIndex < sections.length - 1) {
                setActiveSection(sections[sectionIndex + 1].id);
              } else {
                handleLanjut();
              }
            }}
            style={{
              flex: 1, padding: "16px", background: "#1A1A1A", color: "#FFE26F",
              border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 800,
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif", letterSpacing: "-0.3px",
            }}
          >
            {sectionIndex < sections.length - 1
              ? `Lanjut → ${sections[sectionIndex + 1].label}`
              : "Lanjut → Upload Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
}