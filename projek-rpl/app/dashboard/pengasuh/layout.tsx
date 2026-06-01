"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const menuItems = [
  {
    key: "dashboard", label: "Dashboard", href: "/dashboard/pengasuh",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    key: "daily-log", label: "Log Harian", href: "/dashboard/pengasuh/daily-log",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    key: "kedatangan", label: "Kedatangan", href: "/dashboard/pengasuh/kedatangan",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
  {
    key: "penjemputan", label: "Penjemputan", href: "/dashboard/pengasuh/penjemputan",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>,
  },
  {
    key: "rapor", label: "rapor", href: "/dashboard/pengasuh/rapor",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round"d="M12 6.75h.008v.008H12V6.75zm0 3.75h.008v.008H12V10.5zm0 3.75h.008v.008H12V14.25zm3.75-7.5h.008v.008h-.008V6.75zm0 3.75h.008v.008h-.008V10.5zm0 3.75h.008v.008h-.008V14.25zM8.25 6.75h.008v.008H8.25V6.75zm0 3.75h.008v.008H8.25V10.5zm0 3.75h.008v.008H8.25V14.25z"/><path strokeLinecap="round"strokeLinejoin="round"d="M4.5 4.5h15v15h-15z"/></svg>,
  },
];

export default function PengasuhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("Pengasuh");
  const [teacherInitials, setTeacherInitials] = useState("P");
  const [totalAnak, setTotalAnak] = useState<number | null>(null);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, childrenRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
        supabase.from("children").select("id", { count: "exact", head: true }),
      ]);

      if (profileRes.data?.full_name) {
        const name = profileRes.data.full_name;
        setTeacherName(name);
        setTeacherInitials(name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase());
      }

      if (childrenRes.count !== null) setTotalAnak(childrenRes.count);
    }
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (key: string, href: string) =>
    key === "dashboard" ? pathname === href : pathname.startsWith(href);

  const currentPage = menuItems.find((m) => isActive(m.key, m.href))?.label ?? "Dashboard";

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
              <button key={key} onClick={() => router.push(href)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all duration-150
                  ${active ? "bg-[#C4E02F] text-[#1A1A1A]" : "text-[#4A4A4A] hover:bg-[#F7F5F0] hover:text-[#1A1A1A]"}`}>
                <span className={active ? "text-[#1A1A1A]" : "text-[#4A4A4A]"}>{icon}</span>
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Quick action */}
        <div className="px-3 pb-3">
          <button onClick={() => router.push("/dashboard/pengasuh/daily-log")}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4E02F]/20 hover:bg-[#C4E02F]/40 text-[#5a7a00] rounded-xl text-[12px] font-bold transition-all border border-[#C4E02F]/30">
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
              {teacherInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#1A1A1A] truncate">{teacherName}</p>
              <p className="text-[10px] text-[#4A4A4A] truncate">Pengasuh</p>
            </div>
            <button onClick={handleLogout}
              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#4A4A4A] hover:text-red-400 transition-colors shrink-0"
              title="Logout">
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
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F7F5F0] text-[#4A4A4A] transition-colors">
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
          {totalAnak !== null && (
            <div className="hidden sm:flex items-center gap-2 bg-[#C4E02F]/15 border border-[#C4E02F]/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4E02F] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#1A1A1A]">{totalAnak} Anak Terdaftar</span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
