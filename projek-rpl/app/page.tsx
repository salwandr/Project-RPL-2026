// app/page.tsx (Landing Page)
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Star, Sun, Home, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-montserrat text-[#1A1A1A] scroll-smooth">

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1883FF] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2" />
              </svg>
            </div>
            <span className="text-[#1A1A1A] font-bold text-xl">Tanika Daycare</span>
          </div>

          <div className="hidden md:flex gap-8 font-semibold text-[#4A4A4A]">
            {["Home","About","Programs","Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="hover:text-[#1883FF] transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>

          <Link href="/login">
            <button className="bg-[#1883FF] text-white px-7 py-2.5 rounded-full font-bold shadow-md shadow-[#1883FF]/30 hover:bg-[#1570e0] hover:scale-105 active:scale-95 transition-all">
              Masuk / Daftar
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center px-8 md:px-16 pt-24 pb-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#FFE26F]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#99ADFF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#FFA9DD]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border border-[#FFE26F] rounded-full px-4 py-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C4E02F] animate-pulse" />
              <span className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider">Terdaftar & Berlisensi Resmi</span>
            </div>

            <h1 className="text-5xl md:text-[4.5rem] font-bold leading-[1.08] tracking-tight">
              <span className="text-[#1A1A1A]">Tempat Terbaik</span><br />
              <span className="text-[#1883FF]">Tumbuh &</span><br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FEB700, #FFA9DD)" }}>
                Berkembang
              </span>
            </h1>

            <p className="text-lg text-[#4A4A4A] max-w-md leading-relaxed font-light">
              Di Tanika Daycare, setiap anak mendapatkan perhatian penuh, lingkungan aman, dan stimulasi tumbuh kembang yang terstruktur.
            </p>

            {/* ── TOMBOL HERO ── */}
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-[#1883FF] text-white px-9 py-4 rounded-full font-bold shadow-lg shadow-[#1883FF]/25 hover:bg-[#1570e0] hover:scale-105 active:scale-95 transition-all">
                  Daftarkan Sekarang
                </button>
              </Link>

              {/* ← INI YANG DIPERBAIKI */}
              <a
                href="#programs"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-2 border-[#FFE26F] text-[#1A1A1A] px-9 py-4 rounded-full font-bold hover:bg-[#FFE26F] transition-all inline-block cursor-pointer"
              >
                Lihat Program
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "15+",  label: "Tahun Pengalaman", bg: "bg-[#FFE26F]/40" },
                { value: "200+", label: "Alumni Bahagia",   bg: "bg-[#1883FF]/20" },
                { value: "98%",  label: "Kepuasan Ortu",    bg: "bg-[#FFA9DD]/20" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl px-4 py-3 text-center border border-white`}>
                  <div className="text-2xl font-bold text-[#1A1A1A]">{s.value}</div>
                  <div className="text-[11px] text-[#4A4A4A] font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Foto Hero */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[105%] aspect-square rounded-full border-2 border-dashed border-[#FFE26F]/50 animate-[spin_30s_linear_infinite]" />
            <div className="relative w-[88%] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFE26F]/40 to-[#1883FF]/30 rounded-[3.5rem] rotate-3" />
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-[10px] border-white shadow-2xl">
                <Image
                  src="/hero.jpg"
                  alt="Tanika Daycare Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-10 top-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-[#FFE26F]">
                <div className="w-9 h-9 bg-[#C4E02F]/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#C4E02F]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#4A4A4A]">Pengasuh</p>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">Bersertifikat</p>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-[#FFA9DD]">
                <div className="w-9 h-9 bg-[#FFA9DD]/20 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#FEB700]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#4A4A4A]">Rating</p>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">5.0 / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 bg-white px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          {/* Foto grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                <Image src="/landingpage.jpg" alt="About 1" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="relative flex-1 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                  <Image src="/about.jpg" alt="About 2" fill className="object-cover" />
                </div>
                <div className="h-28 bg-[#FFE26F]/40 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="text-2xl font-black text-[#FEB700]">15+</span>
                  <span className="text-xs font-bold text-[#4A4A4A] ml-1">Tahun</span>
                </div>
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl whitespace-nowrap">
              <div className="w-8 h-8 bg-[#1883FF] rounded-xl flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-white/50 uppercase tracking-wider">Berdiri sejak</p>
                <p className="text-[15px] font-bold">2020 — Sekarang</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <span className="inline-block bg-[#FFE26F]/40 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Tentang Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
              Menciptakan Kenangan<br />
              <span className="text-[#1883FF]">Masa Kecil</span> yang<br />
              Menyenangkan
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed font-light">
              Kami percaya setiap anak berhak mendapatkan lingkungan yang hangat, aman, dan penuh inspirasi bersama pengasuh bersertifikat.
            </p>
            <div className="space-y-3">
              {[
                { text: "5+ Tahun Pengalaman di Bidang Pendidikan Anak", color: "#1883FF"  },
                { text: "Pengasuh Tersertifikasi & Terlatih Profesional",  color: "#FFA9DD" },
                { text: "Rasio Pengasuh : Anak = 1 : 4",                   color: "#C4E02F" },
                { text: "Laporan Perkembangan Anak Berbasis Digital",      color: "#99ADFF" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFDF7] border border-[#FFE26F]/50">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: item.color }} />
                  <span className="text-sm text-[#1A1A1A] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="py-28 bg-[#FFFDF7] px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block bg-[#99ADFF]/20 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#99ADFF]/40">
              Program Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
              Program untuk Setiap <span className="text-[#1883FF]">Tahapan</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ProgramCard
              icon={<Sun className="w-6 h-6" />}
              title="Program Harian"
              desc="Penitipan fleksibel harian dengan aktivitas bermain, belajar, makan, dan istirahat yang terjadwal."
              accent="#FEB700"
            />
            <ProgramCard
              icon={<Home className="w-6 h-6" />}
              title="Program Bulanan"
              desc="Program penitipan rutin bulanan dengan pemantauan tumbuh kembang dan laporan harian digital."
              accent="#1883FF"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 md:px-16 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE26F]/10 rounded-full translate-x-32 -translate-y-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1883FF]/10 rounded-full -translate-x-20 translate-y-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Siap Bergabung dengan<br />
            <span className="text-[#FFE26F]">Keluarga Tanika?</span>
          </h2>
          <p className="text-white/50 font-light mb-10 max-w-lg mx-auto">
            Daftarkan anak Anda sekarang dan rasakan pengalaman daycare terbaik yang transparan dan penuh kasih sayang.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <button className="bg-[#1883FF] text-white px-9 py-4 rounded-full font-bold shadow-lg shadow-[#1883FF]/25 hover:bg-[#1570e0] hover:scale-105 active:scale-95 transition-all">
                Daftar Sekarang
              </button>
            </Link>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-white/20 text-white/70 px-10 py-4 rounded-full font-bold hover:border-white/50 hover:text-white transition-all inline-block cursor-pointer"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="pt-24 pb-10 bg-white px-8 md:px-16 border-t border-[#FFE26F]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-4">
              <h4 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-widest">Kontak</h4>
              <div className="text-[#4A4A4A] leading-relaxed space-y-1 text-sm font-light">
                <p>Pakuan Regency ruko amparan jati A2 no 17, Dramaga, RT.03/RW.02, Kp. Parung Jambu, Margajaya, Bogor Barat, Bogor City, West Java 16116</p>
                <p className="pt-3">WhatsApp: 08119824606</p>
                <p>Instagram: @daycaretanika</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-widest">Jam Operasional</h4>
              <div className="text-[#4A4A4A] space-y-1 text-sm font-light">
                <p>Senin – Jumat: 07.00 – 18.00</p>
                <p>Sabtu: Perjanjian</p>
                <p>Minggu: Tutup</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-widest">Tautan</h4>
              <ul className="text-[#4A4A4A] space-y-2 text-sm font-light">
                {["Pendaftaran","Biaya Program","Kalender","Sumber Daya"].map((l) => (
                  <li key={l} className="hover:text-[#1883FF] cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="mb-12">
            <p className="text-center font-bold text-[#1A1A1A] text-sm uppercase tracking-widest mb-5">
              Lokasi Kami
            </p>
            <div className="w-full h-64 rounded-[2.5rem] overflow-hidden border border-[#FFE26F] shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.610113070772!2d106.7426419!3d-6.570792399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c4c11ee8c5d7%3A0xbec48874ac449d9e!2sTanika%20Daycare!5e0!3m2!1sid!2sid!4v1778602448304!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="text-center text-[#4A4A4A] text-sm font-light pt-8 border-t border-[#FFE26F]/30">
            © 2026 Tanika Daycare. All rights reserved. Made with love for little learners.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProgramCard({ icon, title, desc, accent }: { icon: React.ReactNode; title: string; desc: string; accent: string }) {
  return (
    <div className="group relative bg-white rounded-[2rem] p-7 border border-[#FFE26F]/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15 group-hover:opacity-25 transition-opacity" style={{ background: accent }} />
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0" style={{ background: `${accent}20`, color: accent }}>
        {icon}
      </div>
      <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-2">{title}</h3>
      <p className="text-[13px] text-[#4A4A4A] leading-relaxed font-light mb-5">{desc}</p>
      <a
        href="https://wa.me/628119824606?text=Halo%20Tanika%20Daycare,%20saya%20ingin%20bertanya%20tentang%20program%20daycare."
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] font-bold transition-all hover:underline"
        style={{ color: accent }}
      >
        Tanya Program →
      </a>
    </div>
  );
}