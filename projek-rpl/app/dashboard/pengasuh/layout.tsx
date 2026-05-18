"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard/pengasuh",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: "daily-log",
    label: "Log Harian",
    href: "/dashboard/pengasuh/daily-log",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    key: "kedatangan",
    label: "Kedatangan",
    href: "/dashboard/pengasuh/kedatangan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "penjemputan",
    label: "Penjemputan",
    href: "/dashboard/pengasuh/penjemputan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

// ── Chat data ──────────────────────────────────────────────
type Message = { from: "me" | "ortu"; text: string; time: string };

interface Contact {
  id: number;
  nama: string;
  namaAnak: string;
  avatar: string;
  unread: number;
  lastMsg: string;
  lastTime: string;
  messages: Message[];
}

const initialContacts: Contact[] = [
  {
    id: 1, nama: "Budi Santoso", namaAnak: "Almira Zahra", avatar: "BS", unread: 2, lastMsg: "Almira sudah makan siang?", lastTime: "10.32",
    messages: [
      { from: "ortu", text: "Selamat pagi kak, Almira sudah check-in ya?", time: "07.20" },
      { from: "me",   text: "Sudah pak, Almira masuk jam 07.15 dan sehat.", time: "07.22" },
      { from: "ortu", text: "Almira sudah makan siang?", time: "10.32" },
    ],
  },
  {
    id: 2, nama: "Rina Wijaya", namaAnak: "Bintang Putra", avatar: "RW", unread: 1, lastMsg: "Nanti saya jemput jam 4 ya", lastTime: "09.15",
    messages: [
      { from: "ortu", text: "Kak, Bintang hari ini bawa bekal sendiri ya", time: "07.00" },
      { from: "me",   text: "Siap bu, sudah kami catat 👍", time: "07.05" },
      { from: "ortu", text: "Nanti saya jemput jam 4 ya", time: "09.15" },
    ],
  },
  {
    id: 3, nama: "Dewi Maharani", namaAnak: "Farhan Akbar", avatar: "DM", unread: 0, lastMsg: "Terima kasih kak 🙏", lastTime: "08.50",
    messages: [
      { from: "ortu", text: "Farhan alergi telur ya kak, tolong dicatat", time: "07.30" },
      { from: "me",   text: "Baik bu Dewi, sudah kami catat di data Farhan.", time: "07.35" },
      { from: "ortu", text: "Terima kasih kak 🙏", time: "08.50" },
    ],
  },
  {
    id: 4, nama: "Sari Lestari", namaAnak: "Dafa Ramadhan", avatar: "SL", unread: 0, lastMsg: "Oke siap", lastTime: "Kemarin",
    messages: [
      { from: "me",   text: "Bu Sari, Dafa hari ini aktif sekali di kegiatan belajar 😊", time: "11.00" },
      { from: "ortu", text: "Oke siap", time: "11.10" },
    ],
  },
];

// ── Main layout ────────────────────────────────────────────
export default function PengasuhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen]       = useState(false);
  const [contacts, setContacts]       = useState<Contact[]>(initialContacts);
  const [activeId, setActiveId]       = useState<number | null>(null);
  const [inputText, setInputText]     = useState("");
  const messagesEndRef                = useRef<HTMLDivElement>(null);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (activeId) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, contacts]);

  const isActive = (key: string, href: string) =>
    key === "dashboard" ? pathname === href : pathname.startsWith(href);

  const currentPage = menuItems.find((m) => isActive(m.key, m.href))?.label ?? "Dashboard";
  const totalUnread = contacts.reduce((s, c) => s + c.unread, 0);
  const activeContact = contacts.find((c) => c.id === activeId) ?? null;

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || !activeId) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ".");
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { from: "me", text, time: now }], lastMsg: text, lastTime: now }
          : c
      )
    );
    setInputText("");
  };

  const openContact = (id: number) => {
    setActiveId(id);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div className="flex h-screen bg-[#F7F5F0] overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0
        bg-white flex flex-col border-r border-[#F0EDE6]
        transition-transform duration-300 shadow-lg lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#C4E02F] rounded-xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#1A1A1A] leading-none">Tanika Daycare</p>
              <p className="text-[10px] text-[#4A4A4A] font-medium mt-0.5">Portal Pengasuh</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ key, label, href, icon }) => {
            const active = isActive(key, href);
            return (
              <button
                key={key}
                onClick={() => router.push(href)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all duration-150
                  ${active
                    ? "bg-[#C4E02F] text-[#1A1A1A]"
                    : "text-[#4A4A4A] hover:bg-[#F7F5F0] hover:text-[#1A1A1A]"}`}
              >
                <span className={active ? "text-[#1A1A1A]" : "text-[#4A4A4A]"}>{icon}</span>
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Quick action */}
        <div className="px-3 pb-3">
          <button
            onClick={() => router.push("/dashboard/pengasuh/daily-log")}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4E02F]/20 hover:bg-[#C4E02F]/40 text-[#5a7a00] rounded-xl text-[12px] font-bold transition-all border border-[#C4E02F]/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Isi Log Harian
          </button>
        </div>

        {/* User */}
        <div className="px-3 py-4 border-t border-[#F0EDE6]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#F7F5F0] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#C4E02F]/20 border-2 border-[#C4E02F]/40 flex items-center justify-center text-[10px] font-black text-[#5a7a00] shrink-0">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#1A1A1A] truncate">Siti Aminah</p>
              <p className="text-[10px] text-[#4A4A4A] truncate">Kepala Pengasuh</p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#4A4A4A] hover:text-red-400 transition-colors shrink-0"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-[#F0EDE6] px-4 md:px-6 h-14 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F7F5F0] text-[#4A4A4A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-[#1A1A1A]">{currentPage}</p>
            <p className="text-[10px] text-[#4A4A4A]">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-[#C4E02F]/15 border border-[#C4E02F]/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4E02F] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#1A1A1A]">18 Anak Hadir</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* ── FLOATING CHAT ───────────────────────────────────── */}

      {/* Chat popup */}
      {chatOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#FFE26F]/40 overflow-hidden flex flex-col"
          style={{ height: "480px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#1A1A1A] shrink-0">
            {activeContact ? (
              <>
                <button
                  onClick={() => setActiveId(null)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-8 h-8 rounded-xl bg-[#FFE26F] flex items-center justify-center text-[10px] font-black text-[#1A1A1A] shrink-0">
                  {activeContact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13px] font-bold truncate">{activeContact.nama}</p>
                  <p className="text-white/40 text-[10px] truncate">Wali {activeContact.namaAnak}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-xl bg-[#C4E02F] flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14l4-4h16a2 2 0 002-2V5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-[13px] font-bold">Pesan</p>
                  <p className="text-white/40 text-[10px]">Chat dengan orang tua</p>
                </div>
              </>
            )}
            <button
              onClick={() => { setChatOpen(false); setActiveId(null); }}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contact list */}
          {!activeContact && (
            <div className="flex-1 overflow-y-auto divide-y divide-[#F7F5F0]">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openContact(c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#FFFDF7] transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE26F]/40 flex items-center justify-center text-[11px] font-black text-[#a07000]">
                      {c.avatar}
                    </div>
                    {c.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] bg-[#FFA9DD] text-[#1A1A1A] text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{c.nama}</p>
                      <span className="text-[10px] text-[#4A4A4A] shrink-0">{c.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-[#4A4A4A] truncate mt-0.5">
                      <span className="text-[#4A4A4A]/50">Wali {c.namaAnak} · </span>
                      {c.lastMsg}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Thread view */}
          {activeContact && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[#FFFDF7]">
                {activeContact.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                      msg.from === "me"
                        ? "bg-[#1A1A1A] text-white rounded-br-sm"
                        : "bg-white border border-[#FFE26F]/40 text-[#1A1A1A] rounded-bl-sm shadow-sm"
                    }`}>
                      <p className="text-[12px] font-medium leading-snug">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-white/40" : "text-[#4A4A4A]/50"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-[#F0EDE6] bg-white flex items-end gap-2 shrink-0">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ketik pesan..."
                  rows={1}
                  className="flex-1 text-[12px] border border-[#FFE26F]/60 rounded-xl px-3.5 py-2.5 bg-[#FFFDF7] focus:outline-none focus:border-[#C4E02F] resize-none transition-colors font-medium placeholder:text-[#4A4A4A]/30"
                  style={{ fontFamily: "'Montserrat', sans-serif", maxHeight: "80px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all
                    ${inputText.trim()
                      ? "bg-[#C4E02F] text-[#1A1A1A] hover:opacity-90 active:scale-95"
                      : "bg-[#F0EDE6] text-[#4A4A4A]/40 cursor-not-allowed"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => { setChatOpen((o) => !o); if (chatOpen) setActiveId(null); }}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95
          ${chatOpen ? "bg-[#1A1A1A] rotate-0" : "bg-[#C4E02F] hover:scale-105"}`}
      >
        {chatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14l4-4h16a2 2 0 002-2V5a2 2 0 00-2-2z" />
          </svg>
        )}
        {/* Unread badge */}
        {!chatOpen && totalUnread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-[#FFA9DD] text-[#1A1A1A] text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
}