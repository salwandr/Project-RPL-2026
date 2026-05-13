"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const programs = [
  {
    id: "Mingguan",
    name: "Mingguan",
    jam: "07:00 – 18:00",
    harga: 300000,
    warna: "#1883FF",
    warnaLight: "#EBF4FF",
    badge: "Terpopuler",
    icon: "☀️",
    deskripsi:
      "Program penitipan penuh hari untuk orang tua yang bekerja. Termasuk 3x makan, tidur siang, dan seluruh aktivitas harian.",
    fasilitas: [
      "3x makan bergizi",
      "Tidur siang terjadwal",
      "Aktivitas edukatif",
      "Laporan harian digital",
    ],
  },
  {
    id: "Bulanan",
    name: "Bulanan",
    jam: "07:00 – 18:00",
    harga: 1500000,
    warna: "#C4E02F",
    warnaLight: "#F5FBDC",
    badge: null,
    icon: "🌤️",
    deskripsi:
      "Sesi pagi yang fokus pada stimulasi kognitif dan motorik. Cocok untuk anak yang sudah sekolah siang.",
    fasilitas: [
      "1x sarapan",
      "1x snack",
      "Aktivitas seni & motorik",
      "Laporan harian digital",
      
    ],
  },
    
];

export default function DaftarProgramPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovering, setHovering] = useState<string | null>(null);

  const selectedProgram = programs.find((p) => p.id === selected);

  const handleLanjut = () => {
    if (!selected) return;
    // Simpan ke sessionStorage / state management
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selected_program", selected);
    }
    router.push("/dashboard/orang-tua/daftar/data-anak");
  };

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
      <div
        style={{
          background: "#1A1A1A",
          padding: "20px 24px 28px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "#FFE26F",
            fontSize: "14px",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "12px",
            padding: 0,
          }}
        >
          ← Kembali
        </button>
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "22px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Pilih Program
        </h1>
        <p style={{ color: "#999", fontSize: "13px", margin: "4px 0 0", fontWeight: 500 }}>
          Pilih program yang sesuai kebutuhan anak Anda
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
          {["Pilih Program", "Data Anak", "Pembayaran"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: i === 0 ? "#1883FF" : "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: i === 0 ? "#fff" : "#666",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: i === 0 ? 700 : 500,
                    color: i === 0 ? "#FFE26F" : "#666",
                  }}
                >
                  {step}
                </span>
              </div>
              {i < 2 && (
                <div style={{ width: "20px", height: "1px", background: "#333" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Program Cards */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {programs.map((program) => {
            const isSelected = selected === program.id;
            const isHovering = hovering === program.id;

            return (
              <div
                key={program.id}
                onClick={() => setSelected(program.id)}
                onMouseEnter={() => setHovering(program.id)}
                onMouseLeave={() => setHovering(null)}
                style={{
                  background: "#fff",
                  border: `2px solid ${isSelected ? program.warna : isHovering ? program.warna + "66" : "#F0EDE6"}`,
                  borderRadius: "16px",
                  padding: "18px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.005)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 4px 20px ${program.warna}22`
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Selected indicator strip */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      background: program.warna,
                      borderRadius: "16px 0 0 16px",
                    }}
                  />
                )}

                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: isSelected ? program.warna : program.warnaLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {program.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#1A1A1A",
                          margin: 0,
                          letterSpacing: "-0.3px",
                        }}
                      >
                        {program.name}
                      </h3>
                      {program.badge && (
                        <span
                          style={{
                            background: program.warna,
                            color: program.id === "half-day-pagi" ? "#1A1A1A" : "#fff",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "20px",
                          }}
                        >
                          {program.badge}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#4A4A4A", fontWeight: 500 }}>
                        🕐 {program.jam}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "12px",
                        color: "#4A4A4A",
                        margin: "8px 0 10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {program.deskripsi}
                    </p>

                    {/* Fasilitas chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {program.fasilitas.map((f) => (
                        <span
                          key={f}
                          style={{
                            background: isSelected ? program.warnaLight : "#F7F5F0",
                            border: `1px solid ${isSelected ? program.warna + "44" : "transparent"}`,
                            color: isSelected ? program.warna : "#4A4A4A",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + radio */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? program.warna : "#DDD"}`,
                        background: isSelected ? program.warna : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "auto",
                        marginBottom: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#fff",
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: isSelected ? program.warna : "#1A1A1A",
                        margin: 0,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {(program.harga / 1000000).toFixed(1)}
                      <span style={{ fontSize: "11px", fontWeight: 600 }}>jt</span>
                    </p>
                    <p style={{ fontSize: "10px", color: "#999", margin: "2px 0 0", fontWeight: 500 }}>
                      /bulan
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px 28px",
          background: "linear-gradient(to top, #FFFDF7 80%, transparent)",
          zIndex: 40,
        }}
      >
        {selectedProgram && (
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #FFE26F",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: "11px", color: "#4A4A4A", margin: 0, fontWeight: 500 }}>
                Program dipilih
              </p>
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#1A1A1A", margin: "2px 0 0" }}>
                {selectedProgram.name} • {selectedProgram.jam}
              </p>
            </div>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: selectedProgram.warna,
                margin: 0,
              }}
            >
              Rp {selectedProgram.harga.toLocaleString("id-ID")}
            </p>
          </div>
        )}

        <button
          onClick={handleLanjut}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "16px",
            background: selected ? "#1A1A1A" : "#E0DDD6",
            color: selected ? "#FFE26F" : "#999",
            border: "none",
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: 800,
            fontFamily: "'Montserrat', sans-serif",
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            letterSpacing: "-0.3px",
          }}
        >
          {selected ? "Lanjut → Isi Data Anak" : "Pilih program terlebih dahulu"}
        </button>
      </div>
    </div>
  );
}