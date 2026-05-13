"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  from: "pengasuh" | "ortu";
  name: string;
  childName?: string;
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  childName: string;
  ortuName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    childName: "Anak 1",
    ortuName: "Budi Wali",
    avatar: "BW",
    lastMessage: "Siap bu, nanti saya siapkan!",
    lastTime: "08:20",
    unread: 0,
    messages: [
      { id: 1, from: "pengasuh", name: "Saya", text: "Selamat pagi! Anak 1 hari ini sangat aktif 😊", time: "08:10" },
      { id: 2, from: "ortu",     name: "Budi Wali", text: "Alhamdulillah, terima kasih bu!", time: "08:15" },
      { id: 3, from: "pengasuh", name: "Saya", text: "Besok ada kegiatan mewarnai, bawa baju ganti ya.", time: "08:17" },
      { id: 4, from: "ortu",     name: "Budi Wali", text: "Siap bu, nanti saya siapkan!", time: "08:20" },
    ],
  },
  {
    id: 2,
    childName: "Anak 2",
    ortuName: "Rina Wali",
    avatar: "RW",
    lastMessage: "Tadi makannya bagaimana bu?",
    lastTime: "09:05",
    unread: 2,
    messages: [
      { id: 1, from: "ortu", name: "Rina Wali", text: "Selamat pagi bu, tadi makannya bagaimana?", time: "09:05" },
    ],
  },
  {
    id: 3,
    childName: "Anak 3",
    ortuName: "Doni Wali",
    avatar: "DW",
    lastMessage: "Baik, terima kasih infonya.",
    lastTime: "07:55",
    unread: 0,
    messages: [
      { id: 1, from: "pengasuh", name: "Saya", text: "Selamat pagi pak Doni, Anak 3 sudah tiba dengan selamat.", time: "07:50" },
      { id: 2, from: "ortu",     name: "Doni Wali", text: "Baik, terima kasih infonya.", time: "07:55" },
    ],
  },
];

// ─── Floating Chat for Pengasuh / Admin ──────────────────────────────────────
export default function FloatingChatStaff() {
  const [open, setOpen]               = useState(false);
  const [activeConv, setActiveConv]   = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [input, setInput]             = useState("");

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const handleOpenConv = (conv: Conversation) => {
    setActiveConv(conv);
    // Reset unread
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: Date.now(), from: "pengasuh", name: "Saya", text: input.trim(), time: now,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTime: now }
          : c
      )
    );
    setActiveConv((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev
    );
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden z-50"
          style={{ height: "460px" }}
        >
          {/* Panel header */}
          <div className="bg-sage-green px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              {activeConv && (
                <button
                  onClick={() => setActiveConv(null)}
                  className="text-white/70 hover:text-white mr-1 transition-colors"
                >
                  ←
                </button>
              )}
              <p className="text-[12px] font-bold text-white">
                {activeConv ? `${activeConv.ortuName} · ${activeConv.childName}` : "Pesan Orang Tua"}
              </p>
            </div>
            <button onClick={() => { setOpen(false); setActiveConv(null); }}
              className="text-white/70 hover:text-white text-lg leading-none transition-colors">
              ×
            </button>
          </div>

          {/* Conversation list */}
          {!activeConv ? (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleOpenConv(conv)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 border-b border-stone-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-warm-beige border border-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-500 flex-shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[#1A1A1A] truncate">{conv.ortuName}</p>
                    <p className="text-[10px] text-[#4A4A4A] truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-[9px] text-[#4A4A4A]">{conv.lastTime}</p>
                    {conv.unread > 0 && (
                      <span className="w-4 h-4 bg-sage-green rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#FFFDF7]">
                {activeConv.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.from === "pengasuh" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-snug shadow-sm
                      ${msg.from === "pengasuh"
                        ? "bg-sage-green text-white rounded-br-sm"
                        : "bg-white text-[#1A1A1A] rounded-bl-sm border border-stone-100"}`}>
                      {msg.text}
                    </div>
                    <p className="text-[9px] text-[#4A4A4A] mt-0.5 px-1">{msg.time}</p>
                  </div>
                ))}
              </div>

              {/* Input */}
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
                  className="w-8 h-8 rounded-full bg-sage-green flex items-center justify-center text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); if (open) setActiveConv(null); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sage-green rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center z-50"
      >
        <span className="text-white text-xl">💬</span>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
            {totalUnread}
          </span>
        )}
      </button>
    </>
  );
}