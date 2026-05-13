// app/dashboard/orang-tua/layout.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const navTabs = [
  {
    href: "/dashboard/orang-tua",
    label: "Beranda",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/orang-tua/daily-log",
    label: "Daily Log",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/orang-tua/rapor",
    label: "Rapor",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/orang-tua/penjemputan",
    label: "Jemput",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    href: "/dashboard/orang-tua/profile",
    label: "Profil",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const MOCK_MESSAGES = [
  { id: 1, from: "pengasuh", text: "Selamat pagi! Almira hari ini sangat aktif dan semangat.", time: "08:10" },
  { id: 2, from: "ortu",     text: "Alhamdulillah, terima kasih bu Siti!",                    time: "08:15" },
  { id: 3, from: "pengasuh", text: "Besok ada kegiatan mewarnai, bawa baju ganti ya kak.",    time: "08:17" },
  { id: 4, from: "ortu",     text: "Siap bu, terima kasih infonya!",                          time: "08:20" },
];

// ── Floating Chat ─────────────────────────────────────────────────────────────
function FloatingChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput]       = useState("");
  const [unread, setUnread]     = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const router                  = useRouter();
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleOpen = () => {
    if (isMobile) {
      router.push("/dashboard/orang-tua/chat");
    } else {
      setOpen(true);
      setUnread(0);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), from: "ortu", text: input.trim(), time: now }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* Chat popup — desktop only */}
      {open && !isMobile && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-3xl shadow-2xl border border-[#FFE26F]/30 flex flex-col overflow-hidden z-50" style={{ height: "440px" }}>
          {/* Header */}
          <div className="bg-[#1883FF] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                SP
              </div>
              <div>
                <p className="text-[12px] font-bold text-white leading-tight">Siti Pengasuh</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4E02F]" />
                  <p className="text-[9px] text-white/70">Rainbow Room · Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#FFFDF7]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === "ortu" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-snug shadow-sm
                  ${msg.from === "ortu"
                    ? "bg-[#1883FF] text-white rounded-br-sm"
                    : "bg-white text-[#1A1A1A] rounded-bl-sm border border-[#FFE26F]/40"}`}
                >
                  {msg.text}
                </div>
                <p className="text-[9px] text-[#4A4A4A] mt-0.5 px-1">{msg.time}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-[#FFE26F]/30 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1 text-[11px] bg-[#FFFDF7] border border-[#FFE26F] rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 placeholder:text-[#4A4A4A]/30 text-[#1A1A1A]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-[#1883FF] flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button — desktop only (mobile pakai bottom nav chat) */}
      <button
        onClick={handleOpen}
        className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-[#1883FF] rounded-full shadow-lg shadow-[#1883FF]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all items-center justify-center z-50 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFA9DD] rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm animate-pulse">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function OrangTuaLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu saat navigasi
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Halaman daftar/* punya header sendiri, jangan tampilkan navbar layout
  const isDaftarPage = pathname.startsWith("/dashboard/orang-tua/daftar");

  if (isDaftarPage) {
    return (
      <div className="min-h-screen bg-[#FFFDF7]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-[#FFE26F]/40 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#1883FF] rounded-xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A] leading-none">Tanika Daycare</p>
              <p className="hidden sm:block text-[9px] text-[#4A4A4A] font-medium">Parent Portal</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {navTabs.map(({ href, label, icon }) => {
              const active = href === "/dashboard/orang-tua"
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`relative h-16 px-4 flex items-center gap-2 text-[12px] font-semibold transition-all duration-150
                    ${active ? "text-[#1883FF]" : "text-[#4A4A4A] hover:text-[#1883FF]"}`}
                >
                  <span className={active ? "text-[#1883FF]" : "text-[#4A4A4A]"}>{icon}</span>
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1883FF] rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Right: status + user + hamburger */}
          <div className="flex items-center gap-2">
            {/* Status anak — mobile versi compact */}
            <div className="flex items-center gap-1.5 bg-[#C4E02F]/15 border border-[#C4E02F]/40 rounded-full px-2.5 md:px-3 py-1 md:py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4E02F] animate-pulse shrink-0" />
              <span className="text-[10px] md:text-[11px] font-semibold text-[#1A1A1A]">
                <span className="hidden sm:inline">Almira · </span>Hadir
              </span>
            </div>

            {/* User chip — desktop only */}
            <div className="hidden md:flex items-center gap-2 bg-[#FFFDF7] border border-[#FFE26F] rounded-full pl-2 pr-4 py-1.5">
              <div className="w-7 h-7 rounded-full bg-[#1883FF]/15 border-2 border-[#1883FF] flex items-center justify-center text-[9px] font-bold text-[#1883FF]">
                BW
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1A1A1A] leading-none">Budi Wali</p>
                <p className="text-[9px] text-[#4A4A4A]">Orang Tua</p>
              </div>
            </div>

            {/* Logout — desktop only */}
            <button
              onClick={() => router.push("/login")}
              className="hidden md:flex w-8 h-8 rounded-full bg-red-50 items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#FFE26F]/30 px-4 py-3 space-y-1 shadow-lg">
            {/* User info */}
            <div className="flex items-center justify-between py-3 mb-1 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1883FF]/15 border-2 border-[#1883FF] flex items-center justify-center text-[11px] font-bold text-[#1883FF]">BW</div>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">Budi Wali</p>
                  <p className="text-[11px] text-[#4A4A4A]">Orang Tua · Almira Zahra</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/login")}
                className="text-[12px] text-red-400 font-semibold px-3 py-1.5 bg-red-50 rounded-xl"
              >
                Keluar
              </button>
            </div>

            {/* Nav items */}
            {navTabs.map(({ href, label, icon }) => {
              const active = href === "/dashboard/orang-tua"
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all
                    ${active
                      ? "bg-[#1883FF] text-white"
                      : "text-[#4A4A4A] hover:bg-[#FFE26F]/20"}`}
                >
                  {icon} {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      {/* pb-20 supaya konten tidak tertutup bottom nav di mobile */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-4 md:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* ── Bottom nav — mobile only ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#FFE26F]/40 z-20 flex safe-bottom">
        {navTabs.map(({ href, label, icon }) => {
          const active = href === "/dashboard/orang-tua"
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors relative
                ${active ? "text-[#1883FF]" : "text-[#4A4A4A]"}`}
            >
              {/* Active pill background */}
              {active && (
                <span className="absolute top-1.5 w-10 h-8 bg-[#1883FF]/10 rounded-xl" />
              )}
              <span className={`relative z-10 ${active ? "text-[#1883FF]" : "text-[#4A4A4A]"}`}>
                {icon}
              </span>
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Floating Chat — desktop only ── */}
      <FloatingChat />
    </div>
  );
}