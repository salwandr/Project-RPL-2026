"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, MoreVertical, ImageIcon, Paperclip, Smile, ChevronLeft, Sparkles } from "lucide-react";

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
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    ortuName: "Budi Santoso",
    childName: "Andra Pratama",
    avatar: "BS",
    avatarColor: "#1883FF",
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
    avatarColor: "#FFA9DD",
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
    avatarColor: "#C4E02F",
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
    avatarColor: "#99ADFF",
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
    avatarColor: "#FEB700",
    lastMessage: "Dani demam bu, mungkin tidak masuk besok",
    lastTime: "Kemarin",
    unread: 1,
    online: false,
    messages: [
      { id: 1, from: "ortu", text: "Bu, Dani demam bu, mungkin tidak masuk besok. Mohon maklum ya.", time: "18:30", read: false },
    ],
  },
];

function MessageBubble({ msg, prevFrom }: { msg: Message; prevFrom?: string }) {
  const isMe = msg.from === "pengasuh";
  const isFirst = prevFrom !== msg.from;

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${isFirst ? "mt-4" : "mt-1"}`}
      style={{ animation: "bubbleIn 0.2s ease-out" }}
    >
      <div className={`max-w-[68%] space-y-1`}>
        <div
          className={`px-4 py-2.5 text-[13px] leading-relaxed font-medium
            ${isMe
              ? "text-white rounded-2xl rounded-br-md"
              : "text-[#1A1A1A] rounded-2xl rounded-bl-md bg-white border border-[#F0EDE6]"
            }`}
          style={isMe ? {
            background: "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)",
            boxShadow: "0 2px 12px rgba(24,131,255,0.25)",
          } : {
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {msg.text}
        </div>
        <p className={`text-[10px] text-[#4A4A4A]/50 font-medium px-1 ${isMe ? "text-right" : "text-left"}`}>
          {msg.time}{isMe && " · "}{isMe && msg.read && <span className="text-[#1883FF]">✓✓</span>}
        </p>
      </div>
    </div>
  );
}

export default function PengasuhPesanPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId]           = useState<number | null>(null);
  const [input, setInput]                 = useState("");
  const [search, setSearch]               = useState("");
  const messagesEndRef                    = useRef<HTMLDivElement>(null);
  const textareaRef                       = useRef<HTMLTextAreaElement>(null);

  const active       = conversations.find((c) => c.id === activeId) ?? null;
  const totalUnread  = conversations.reduce((s, c) => s + c.unread, 0);
  const filteredConvs = conversations.filter(
    (c) =>
      c.ortuName.toLowerCase().includes(search.toLowerCase()) ||
      c.childName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + "px";
    }
  }, [input]);

  const handleOpenConv = (id: number) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
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
      prev.map((c) =>
        c.id === activeId
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
    <>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .conv-item { animation: fadeSlideIn 0.25s ease-out both; }
        .conv-item:nth-child(1) { animation-delay: 0ms; }
        .conv-item:nth-child(2) { animation-delay: 40ms; }
        .conv-item:nth-child(3) { animation-delay: 80ms; }
        .conv-item:nth-child(4) { animation-delay: 120ms; }
        .conv-item:nth-child(5) { animation-delay: 160ms; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E8E4DB; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #D0CCC4; }
      `}</style>

      <div
        className="flex overflow-hidden"
        style={{
          height: "calc(100vh - 130px)",
          borderRadius: "24px",
          border: "1.5px solid #F0EDE6",
          background: "#FFFDF7",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >

        {/* ──────────────────── SIDEBAR ──────────────────── */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{
            width: "300px",
            borderRight: "1.5px solid #F0EDE6",
            background: "#fff",
          }}
        >
          {/* Sidebar Header */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1.5px solid #F0EDE6" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.4px" }}>
                  Pesan
                </h2>
                {totalUnread > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFA9DD" }} className="animate-pulse" />
                    <span style={{ fontSize: "11px", color: "#aa3366", fontWeight: 700 }}>
                      {totalUnread} belum dibaca
                    </span>
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(24,131,255,0.3)",
                }}
              >
                <Sparkles size={16} color="white" />
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={13}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }}
              />
              <input
                type="text"
                placeholder="Cari percakapan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 32px",
                  border: "1.5px solid #F0EDE6",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  color: "#1A1A1A",
                  background: "#F7F5F0",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto" style={{ padding: "8px 0" }}>
            {filteredConvs.map((conv, i) => {
              const isActive = activeId === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleOpenConv(conv.id)}
                  className="conv-item w-full text-left"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 20px",
                    background: isActive ? "#EBF4FF" : "transparent",
                    borderLeft: isActive ? "3px solid #1883FF" : "3px solid transparent",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                    border: "none",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F7F5F0"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "44px", height: "44px", borderRadius: "14px",
                        background: conv.avatarColor + "22",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 800, color: conv.avatarColor,
                        border: isActive ? `2px solid ${conv.avatarColor}44` : "2px solid transparent",
                        transition: "border 0.15s ease",
                      }}
                    >
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div style={{
                        position: "absolute", bottom: "-1px", right: "-1px",
                        width: "12px", height: "12px", borderRadius: "50%",
                        background: "#C4E02F", border: "2px solid #fff",
                      }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <p style={{
                        fontSize: "13px", fontWeight: conv.unread > 0 ? 800 : 700,
                        color: "#1A1A1A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {conv.ortuName}
                      </p>
                      <span style={{ fontSize: "10px", color: "#999", fontWeight: 500, flexShrink: 0, marginLeft: "4px" }}>
                        {conv.lastTime}
                      </span>
                    </div>
                    <p style={{ fontSize: "10px", color: conv.avatarColor, fontWeight: 700, margin: "0 0 2px" }}>
                      {conv.childName}
                    </p>
                    <p style={{
                      fontSize: "11px",
                      color: conv.unread > 0 ? "#1A1A1A" : "#999",
                      fontWeight: conv.unread > 0 ? 600 : 400,
                      margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unread > 0 && (
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: "#FFA9DD", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#fff" }}>{conv.unread}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ──────────────────── CHAT AREA ──────────────────── */}
        {active ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat Header */}
            <div
              style={{
                padding: "14px 24px",
                borderBottom: "1.5px solid #F0EDE6",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Avatar */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "14px",
                      background: active.avatarColor + "22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 800, color: active.avatarColor,
                    }}
                  >
                    {active.avatar}
                  </div>
                  {active.online && (
                    <div style={{
                      position: "absolute", bottom: "-1px", right: "-1px",
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: "#C4E02F", border: "2px solid #fff",
                    }} />
                  )}
                </div>

                <div>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.3px" }}>
                    {active.ortuName}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    {active.online ? (
                      <>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C4E02F" }} />
                        <span style={{ fontSize: "11px", color: "#4a7500", fontWeight: 600 }}>Online</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#999", fontWeight: 500 }}>Offline</span>
                    )}
                    <span style={{ fontSize: "11px", color: "#ccc" }}>·</span>
                    <span style={{ fontSize: "11px", color: "#4A4A4A", fontWeight: 500 }}>
                      Wali {active.childName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { icon: <Phone size={15} />, title: "Telepon" },
                  { icon: <MoreVertical size={15} />, title: "Opsi" },
                ].map(({ icon, title }) => (
                  <button
                    key={title}
                    title={title}
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "#F7F5F0", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#4A4A4A", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#EBF4FF"; e.currentTarget.style.color = "#1883FF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#F7F5F0"; e.currentTarget.style.color = "#4A4A4A"; }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                padding: "20px 24px",
                background: "#FFFDF7",
                backgroundImage: "radial-gradient(circle at 20% 20%, #FFE26F08 0%, transparent 60%), radial-gradient(circle at 80% 80%, #1883FF06 0%, transparent 60%)",
              }}
            >
              {/* Date separator */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: "#F0EDE6" }} />
                <span style={{
                  fontSize: "10px", color: "#999", fontWeight: 700,
                  background: "#fff", padding: "4px 12px", borderRadius: "20px",
                  border: "1px solid #F0EDE6", letterSpacing: "0.3px", textTransform: "uppercase",
                }}>
                  Hari ini
                </span>
                <div style={{ flex: 1, height: "1px", background: "#F0EDE6" }} />
              </div>

              {active.messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  prevFrom={i > 0 ? active.messages[i - 1].from : undefined}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "12px 20px 16px",
                background: "#fff",
                borderTop: "1.5px solid #F0EDE6",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex", alignItems: "flex-end", gap: "10px",
                  background: "#F7F5F0",
                  border: "1.5px solid #F0EDE6",
                  borderRadius: "18px",
                  padding: "8px 8px 8px 16px",
                  transition: "border-color 0.2s ease",
                }}
                onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#1883FF44"; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#F0EDE6"; }}
              >
                {/* Attachment buttons */}
                <div style={{ display: "flex", gap: "2px", paddingBottom: "2px" }}>
                  {[
                    { icon: <Paperclip size={15} />, title: "Lampiran" },
                    { icon: <ImageIcon size={15} />, title: "Foto" },
                    { icon: <Smile size={15} />, title: "Emoji" },
                  ].map(({ icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        background: "transparent", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#999", transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1883FF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#999"; }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tulis pesan kepada orang tua..."
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    resize: "none", fontSize: "13px", fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500, color: "#1A1A1A", lineHeight: "1.5",
                    maxHeight: "96px", paddingTop: "6px",
                  }}
                />

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  style={{
                    width: "38px", height: "38px", borderRadius: "12px",
                    border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: input.trim()
                      ? "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)"
                      : "#E8E4DB",
                    color: input.trim() ? "#fff" : "#999",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    boxShadow: input.trim() ? "0 2px 8px rgba(24,131,255,0.3)" : "none",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = "scale(1.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <Send size={15} style={{ transform: "translateX(1px)" }} />
                </button>
              </div>

              <p style={{ fontSize: "10px", color: "#ccc", marginTop: "6px", marginLeft: "4px", fontWeight: 500 }}>
                Enter kirim · Shift+Enter baris baru
              </p>
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{
              background: "#FFFDF7",
              backgroundImage: "radial-gradient(circle at 50% 40%, #FFE26F0A 0%, transparent 70%)",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "relative", marginBottom: "32px" }}>
              <div style={{
                width: "88px", height: "88px", borderRadius: "28px",
                background: "linear-gradient(135deg, #1883FF 0%, #3B5BDB 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(24,131,255,0.25), 0 0 0 12px rgba(24,131,255,0.08)",
              }}>
                <Send size={36} color="white" style={{ transform: "translateX(2px)" }} />
              </div>
              {/* Floating badge */}
              {totalUnread > 0 && (
                <div style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "#FFA9DD", border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#fff" }}>{totalUnread}</span>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.4px" }}>
              Pilih Percakapan
            </h3>
            <p style={{ fontSize: "13px", color: "#999", textAlign: "center", maxWidth: "240px", lineHeight: "1.6", fontWeight: 500, margin: 0 }}>
              Pilih percakapan dari daftar untuk mulai berkomunikasi dengan orang tua
            </p>

            {totalUnread > 0 && (
              <div style={{
                marginTop: "20px",
                padding: "10px 18px",
                background: "#FFF0F9",
                border: "1.5px solid #FFA9DD44",
                borderRadius: "12px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFA9DD" }} className="animate-pulse" />
                <span style={{ fontSize: "12px", color: "#aa3366", fontWeight: 700 }}>
                  {totalUnread} pesan menunggu balasan
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}