"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, MoreVertical, Circle, ImageIcon, Paperclip, Smile } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  from: "pengasuh" | "ortu";
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  ortuName: string;
  childName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    ortuName: "Budi Santoso",
    childName: "Andra Pratama",
    avatar: "BS",
    lastMessage: "Siap bu, terima kasih infonya!",
    lastTime: "08:20",
    unread: 0,
    online: true,
    messages: [
      { id: 1, from: "pengasuh", text: "Selamat pagi pak Budi! Andra hari ini sangat semangat dan aktif 😊", time: "07:45", read: true },
      { id: 2, from: "ortu",     text: "Alhamdulillah, senang sekali dengarnya bu!", time: "07:50", read: true },
      { id: 3, from: "pengasuh", text: "Tadi waktu kegiatan mewarnai Andra berhasil menyelesaikan gambarnya sendiri, hebat sekali!", time: "08:10", read: true },
      { id: 4, from: "ortu",     text: "Wah bagus sekali! Besok ada kegiatan apa bu?", time: "08:15", read: true },
      { id: 5, from: "pengasuh", text: "Besok ada kegiatan menyanyi dan bermain musik. Kalau bisa bawa baju yang nyaman ya pak 🎵", time: "08:18", read: true },
      { id: 6, from: "ortu",     text: "Siap bu, terima kasih infonya!", time: "08:20", read: true },
    ],
  },
  {
    id: 2,
    ortuName: "Rina Wulandari",
    childName: "Lana Safira",
    avatar: "RW",
    lastMessage: "Tadi makannya bagaimana bu?",
    lastTime: "09:05",
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: "ortu",     text: "Selamat pagi bu, Lana tadi sempat rewel di rumah.", time: "07:30", read: true },
      { id: 2, from: "pengasuh", text: "Tenang bu, Lana sudah ceria sekarang! Sudah main sama teman-temannya 😊", time: "07:45", read: true },
      { id: 3, from: "ortu",     text: "Syukurlah, terima kasih bu!", time: "07:50", read: true },
      { id: 4, from: "ortu",     text: "Tadi makannya bagaimana bu?", time: "09:05", read: false },
    ],
  },
  {
    id: 3,
    ortuName: "Doni Prakoso",
    childName: "Budi Wijaya",
    avatar: "DP",
    lastMessage: "Baik bu, nanti saya jemput jam 4",
    lastTime: "Kemarin",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "pengasuh", text: "Selamat pagi pak Doni, Budi sudah tiba dengan selamat.", time: "07:20", read: true },
      { id: 2, from: "ortu",     text: "Terima kasih bu! Nanti saya jemput agak telat ya sekitar jam 4.", time: "07:25", read: true },
      { id: 3, from: "pengasuh", text: "Baik pak, noted ya 👍", time: "07:26", read: true },
      { id: 4, from: "ortu",     text: "Baik bu, nanti saya jemput jam 4", time: "07:30", read: true },
    ],
  },
  {
    id: 4,
    ortuName: "Sari Lestari",
    childName: "Rina Putri",
    avatar: "SL",
    lastMessage: "Oke bu terima kasih banyak 🙏",
    lastTime: "Kemarin",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "pengasuh", text: "Bu Sari, Rina hari ini menunjukkan perkembangan yang sangat baik dalam membaca!", time: "14:00", read: true },
      { id: 2, from: "ortu",     text: "Benarkah? Senang sekali bu! Memang di rumah dia sering latihan.", time: "14:05", read: true },
      { id: 3, from: "pengasuh", text: "Iya bu, terus dukung ya! Besok ada evaluasi membaca.", time: "14:07", read: true },
      { id: 4, from: "ortu",     text: "Oke bu terima kasih banyak 🙏", time: "14:10", read: true },
    ],
  },
  {
    id: 5,
    ortuName: "Hendra Kurnia",
    childName: "Dani Saputra",
    avatar: "HK",
    lastMessage: "Dani demam bu, mungkin tidak masuk besok",
    lastTime: "Kemarin",
    unread: 1,
    online: false,
    messages: [
      { id: 1, from: "ortu", text: "Bu, Dani demam bu, mungkin tidak masuk besok. Mohon maklum ya.", time: "18:30", read: false },
    ],
  },
];

// ─── Bubble Component ─────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isMe = msg.from === "pengasuh";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] space-y-1`}>
        <div className={`px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed shadow-sm
          ${isMe
            ? "bg-[#1883FF] text-white rounded-br-sm"
            : "bg-white text-[#1A1A1A] rounded-bl-sm border border-[#F0F0F0]"}`}>
          {msg.text}
        </div>
        <p className={`text-[10px] text-[#4A4A4A] ${isMe ? "text-right" : "text-left"} px-1`}>
          {msg.time} {isMe && msg.read && <span className="text-[#1883FF]">✓✓</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PengasuhPesanPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId]           = useState<number | null>(null);
  const [input, setInput]                 = useState("");
  const [search, setSearch]               = useState("");
  const messagesEndRef                    = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const filteredConvs = conversations.filter(
    (c) => c.ortuName.toLowerCase().includes(search.toLowerCase()) ||
           c.childName.toLowerCase().includes(search.toLowerCase())
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const handleOpenConv = (id: number) => {
    setActiveId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => c.id === id
        ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
        : c
      )
    );
  };

  const handleSend = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), from: "pengasuh", text: input.trim(), time: now, read: false };
    setConversations((prev) =>
      prev.map((c) => c.id === activeId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTime: now }
        : c
      )
    );
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex h-[calc(100vh-60px-48px)] bg-[#F4F6FA] rounded-2xl overflow-hidden shadow-sm border border-[#F0F0F0]">

      {/* ── Sidebar percakapan ── */}
      <div className="w-[300px] flex-shrink-0 bg-white border-r border-[#F0F0F0] flex flex-col">
        {/* Header sidebar */}
        <div className="px-4 py-4 border-b border-[#F0F0F0]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[14px] font-bold text-[#1A1A1A]">Pesan</p>
              {totalUnread > 0 && (
                <p className="text-[10px] text-[#FFA9DD] font-semibold">{totalUnread} pesan belum dibaca</p>
              )}
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
            <input
              type="text"
              placeholder="Cari orang tua..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-[11px] bg-[#F4F6FA] border border-[#F0F0F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 placeholder:text-[#4A4A4A]/40 text-[#1A1A1A]"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleOpenConv(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-[#F0F0F0]/50
                ${activeId === conv.id
                  ? "bg-[#1883FF]/5 border-l-2 border-l-[#1883FF]"
                  : "hover:bg-[#F4F6FA]"}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#1883FF]/10 border-2 border-[#1883FF]/20 flex items-center justify-center text-[10px] font-bold text-[#1883FF]">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C4E02F] rounded-full border-2 border-white" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[12px] font-bold text-[#1A1A1A] truncate">{conv.ortuName}</p>
                  <p className="text-[10px] text-[#4A4A4A] flex-shrink-0 ml-1">{conv.lastTime}</p>
                </div>
                <p className="text-[10px] text-[#4A4A4A] truncate">{conv.childName}</p>
                <p className={`text-[10px] truncate mt-0.5 ${conv.unread > 0 ? "font-semibold text-[#1A1A1A]" : "text-[#4A4A4A]"}`}>
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-[#1883FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-white">{conv.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat area ── */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="bg-white border-b border-[#F0F0F0] px-5 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1883FF]/10 border-2 border-[#1883FF]/20 flex items-center justify-center text-[10px] font-bold text-[#1883FF]">
                  {active.avatar}
                </div>
                {active.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C4E02F] rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#1A1A1A]">{active.ortuName}</p>
                <p className="text-[10px] flex items-center gap-1">
                  {active.online
                    ? <><Circle size={7} fill="#C4E02F" stroke="none" /><span className="text-[#5a8a00] font-medium">Online</span></>
                    : <span className="text-[#4A4A4A]">Offline</span>
                  }
                  <span className="text-[#4A4A4A] ml-1">· Wali {active.childName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#4A4A4A] hover:bg-[#1883FF]/10 hover:text-[#1883FF] transition-all">
                <Phone size={15} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#4A4A4A] hover:bg-[#1883FF]/10 hover:text-[#1883FF] transition-all">
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          {/* Date separator */}
          <div className="flex items-center gap-3 px-6 py-3">
            <div className="flex-1 h-px bg-[#F0F0F0]" />
            <span className="text-[10px] text-[#4A4A4A] font-medium bg-[#F4F6FA] px-3 py-1 rounded-full">
              Hari ini
            </span>
            <div className="flex-1 h-px bg-[#F0F0F0]" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
            {active.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-white border-t border-[#F0F0F0] px-4 py-3 flex-shrink-0">
            <div className="flex items-end gap-3">
              {/* Action buttons */}
              <div className="flex gap-1 pb-1">
                <button className="w-8 h-8 rounded-xl text-[#4A4A4A] hover:bg-[#F4F6FA] hover:text-[#1883FF] flex items-center justify-center transition-all">
                  <Paperclip size={16} />
                </button>
                <button className="w-8 h-8 rounded-xl text-[#4A4A4A] hover:bg-[#F4F6FA] hover:text-[#1883FF] flex items-center justify-center transition-all">
                  <ImageIcon size={16} />
                </button>
                <button className="w-8 h-8 rounded-xl text-[#4A4A4A] hover:bg-[#F4F6FA] hover:text-[#FEB700] flex items-center justify-center transition-all">
                  <Smile size={16} />
                </button>
              </div>

              {/* Text input */}
              <div className="flex-1 bg-[#F4F6FA] border border-[#F0F0F0] rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#1883FF]/20 focus-within:border-[#1883FF]/30 transition-all">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan..."
                  className="w-full text-[12px] bg-transparent focus:outline-none text-[#1A1A1A] placeholder:text-[#4A4A4A]/40 resize-none leading-relaxed max-h-24"
                />
              </div>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0
                  ${input.trim()
                    ? "bg-[#1883FF] text-white shadow-md shadow-[#1883FF]/20 hover:bg-[#1570e0] hover:scale-105 active:scale-95"
                    : "bg-[#F4F6FA] text-[#4A4A4A]/40 cursor-not-allowed"}`}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[9px] text-[#4A4A4A]/40 mt-1.5 ml-2">Enter untuk kirim · Shift+Enter untuk baris baru</p>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F6FA]">
          <div className="w-20 h-20 rounded-3xl bg-[#1883FF]/10 flex items-center justify-center mb-4">
            <Send size={32} className="text-[#1883FF]" />
          </div>
          <p className="text-[15px] font-bold text-[#1A1A1A] mb-1">Pilih Percakapan</p>
          <p className="text-[12px] text-[#4A4A4A] text-center max-w-xs">
            Pilih percakapan dari daftar kiri untuk mulai berkomunikasi dengan orang tua
          </p>
          {totalUnread > 0 && (
            <div className="mt-4 bg-[#FFA9DD]/20 border border-[#FFA9DD]/30 rounded-2xl px-4 py-2">
              <p className="text-[11px] text-[#a0005a] font-semibold text-center">
                {totalUnread} pesan belum dibaca
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}