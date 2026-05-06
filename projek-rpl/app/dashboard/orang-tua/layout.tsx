"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const headerTabs = [
  { href: "/dashboard/orang-tua/daily-log",   label: "Daily Log"   },
  { href: "/dashboard/orang-tua/penjemputan", label: "Penjemputan" },
  { href: "/dashboard/orang-tua/rapor",       label: "Rapor"       },
  { href: "/dashboard/orang-tua/profile",     label: "Profil"      },
];

const MOCK_MESSAGES = [
  { id: 1, from: "pengasuh", text: "Selamat pagi! Anak 1 hari ini sangat aktif.", time: "08:10" },
  { id: 2, from: "ortu",     text: "Alhamdulillah, terima kasih bu Siti!",        time: "08:15" },
  { id: 3, from: "pengasuh", text: "Besok ada kegiatan mewarnai, bawa baju ganti ya.", time: "08:17" },
  { id: 4, from: "ortu",     text: "Siap bu, terima kasih infonya!",              time: "08:20" },
];

function FloatingChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput]       = useState("");
  const [unread, setUnread]     = useState(1);

  const handleOpen = () => { setOpen(true); setUnread(0); };

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
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden z-50" style={{ height: "420px" }}>
          <div className="bg-sage-green px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">SP</div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Siti Pengasuh</p>
                <p className="text-[9px] text-white/70">Rainbow Room</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#F5F0EB]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === "ortu" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-snug shadow-sm
                  ${msg.from === "ortu"
                    ? "bg-sage-green text-white rounded-br-sm"
                    : "bg-white text-stone-700 rounded-bl-sm border border-stone-100"}`}>
                  {msg.text}
                </div>
                <p className="text-[9px] text-stone-400 mt-0.5 px-1">{msg.time}</p>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 bg-white border-t border-stone-100 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1 text-[11px] bg-stone-50 border border-stone-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-green/30 placeholder:text-stone-300"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-sage-green flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sage-green rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

export default function OrangTuaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F0EB] font-montserrat flex flex-col">
      <header className="bg-white shadow-sm px-6 flex-shrink-0 flex items-center justify-between h-16 sticky top-0 z-20">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[2px] text-stone-400 leading-none">Portal</p>
          <p className="text-[15px] font-bold leading-tight">
            <span className="text-stone-800">Tanika </span>
            <span className="text-sage-green">Daycare</span>
          </p>
        </div>

        <nav className="flex items-center gap-1 h-full">
          {headerTabs.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`relative h-full px-4 text-[12px] font-semibold transition-all duration-150
                  ${active ? "text-sage-green" : "text-stone-400 hover:text-stone-600"}`}
              >
                {label}
                {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-green rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-stone-700 leading-tight">Budi Wali</p>
            <p className="text-[9px] text-stone-400">Orang Tua · Anak 1</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-sage-green/20 border-2 border-sage-green flex items-center justify-center text-[9px] font-bold text-sage-green shadow-sm">
            BW
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-[10px] text-stone-400 hover:text-red-400 transition-colors ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 px-8 py-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      <FloatingChat />
    </div>
  );
}