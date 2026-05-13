"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Car,
  Search, Bell, HelpCircle, Plus, ChevronRight, LogOut, X, Menu
} from "lucide-react";

const menuItems = [
  { key: "dashboard",  label: "Dashboard",   href: "/dashboard/pengasuh",              icon: LayoutDashboard },
  { key: "daily-log",  label: "Log Harian",  href: "/dashboard/pengasuh/daily-log",    icon: BookOpen        },
  { key: "kedatangan", label: "Kehadiran",   href: "/dashboard/pengasuh/kedatangan",   icon: Users           },
  { key: "pesan",      label: "Pesan",       href: "/dashboard/pengasuh/pesan",        icon: MessageSquare   },
  { key: "penjemputan",label: "Penjemputan", href: "/dashboard/pengasuh/penjemputan",  icon: Car             },
];

export default function PengasuhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);

  const isDashboard = pathname === "/dashboard/pengasuh";
  const pageTitle   = isDashboard
    ? "Portal Manajemen"
    : menuItems.find((m) => pathname.startsWith(m.href) && m.href !== "/dashboard/pengasuh")?.label ?? "Portal Manajemen";

  return (
    <div className="flex h-screen bg-[#F4F6FA] font-montserrat overflow-hidden">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-[220px] flex-shrink-0
        bg-white flex flex-col shadow-lg border-r border-[#F0F0F0]
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F0F0F0] flex items-center justify-between">
          <div>
            <p className="text-[15px] font-bold text-[#1A1A1A] leading-tight">Tanika Daycare</p>
            <p className="text-[10px] text-[#4A4A4A] font-medium">Penyusun yang Empati</p>
          </div>
          <button className="lg:hidden text-[#4A4A4A]" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {menuItems.map(({ key, label, href, icon: Icon }) => {
            const active = key === "dashboard"
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <button
                key={key}
                onClick={() => { router.push(href); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all duration-150
                  ${active
                    ? "bg-[#1883FF] text-white shadow-md shadow-[#1883FF]/30"
                    : "text-[#4A4A4A] hover:bg-[#F4F6FA] hover:text-[#1A1A1A]"}`}
              >
                <Icon size={17} />
                {label}
                {key === "pesan" && (
                  <span className="ml-auto w-5 h-5 bg-[#FFA9DD] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Entri Cepat */}
        <div className="px-3 pb-3">
          <button
            onClick={() => router.push("/dashboard/pengasuh/daily-log")}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1883FF]/10 hover:bg-[#1883FF]/20 text-[#1883FF] rounded-xl text-[12px] font-bold transition-all duration-150 hover:scale-[1.02] border border-[#1883FF]/20"
          >
            <Plus size={15} />
            Entri Cepat
          </button>
        </div>

        {/* User info */}
        <div className="px-3 pb-4 border-t border-[#F0F0F0] pt-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#1883FF]/20 border-2 border-[#1883FF]/30 flex items-center justify-center text-[10px] font-bold text-[#1883FF] flex-shrink-0">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#1A1A1A] truncate">Siti Aminah</p>
              <p className="text-[10px] text-[#4A4A4A] truncate">Kepala Pengasuh</p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="text-[#4A4A4A] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Header ── */}
        <header className="bg-white border-b border-[#F0F0F0] px-6 h-[60px] flex items-center gap-4 flex-shrink-0">
          {/* Mobile menu button */}
          <button className="lg:hidden text-[#4A4A4A]" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Page title */}
          <h1 className="text-[16px] font-bold text-[#1883FF] flex-shrink-0">{pageTitle}</h1>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-4 hidden sm:block">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40" />
              <input
                type="text"
                placeholder="Cari anak..."
                className="w-full pl-9 pr-4 py-2 bg-[#F4F6FA] border border-[#F0F0F0] rounded-xl text-[12px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1883FF]/20 focus:border-[#1883FF]/30 placeholder:text-[#4A4A4A]/40"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notif */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#4A4A4A] hover:bg-[#1883FF]/10 hover:text-[#1883FF] transition-all relative"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFA9DD] rounded-full" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-[#F0F0F0] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F0F0F0]">
                    <p className="text-[12px] font-bold text-[#1A1A1A]">Notifikasi</p>
                  </div>
                  {[
                    { text: "Anak 2 belum check-in", time: "08:30", dot: "#FFA9DD" },
                    { text: "Pesan baru dari Budi Wali", time: "08:15", dot: "#1883FF" },
                    { text: "3 daily log belum diisi", time: "07:00", dot: "#FFE26F" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F4F6FA] transition-colors border-b border-[#F0F0F0]/50 last:border-0">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                      <div className="flex-1">
                        <p className="text-[11px] text-[#1A1A1A] font-medium">{n.text}</p>
                        <p className="text-[10px] text-[#4A4A4A]">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="w-9 h-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-[#4A4A4A] hover:bg-[#1883FF]/10 hover:text-[#1883FF] transition-all">
              <HelpCircle size={17} />
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}