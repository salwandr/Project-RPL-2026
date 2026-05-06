"use client";

import { usePathname, useRouter } from "next/navigation";
import FloatingChatStaff from "@/components/floating-chat-staff";

const headerTabs = [
  { href: "/dashboard/admin/kedatangan",  label: "Kedatangan"  },
  { href: "/dashboard/admin/penjemputan", label: "Penjemputan" },
];

const sidebarMenus = [
  { href: "/dashboard/admin/data-anak", label: "Data Anak", icon: "♡" },
  { href: "/dashboard/admin/laporan",   label: "Laporan",   icon: "≡" },
  { href: "/dashboard/admin/pengguna",  label: "Pengguna",  icon: "◯" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const allMenus  = [...headerTabs, ...sidebarMenus];
  const pageTitle = allMenus.find((m) => pathname.startsWith(m.href))?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-[#F5F0EB] font-montserrat overflow-hidden">

      {/* ── Sidebar kiri (menu sekunder) ── */}
      <aside className="w-52 flex-shrink-0 bg-white shadow-lg flex flex-col py-8 px-3 z-10">
        <div className="mb-7 px-3">
          <p className="text-[9px] font-bold uppercase tracking-[2px] text-stone-400">Admin Portal</p>
          <p className="text-[17px] font-bold text-stone-800 leading-tight">Tanika</p>
          <p className="text-[17px] font-bold text-sage-green leading-tight -mt-0.5">Daycare</p>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-300 px-3 mb-2">Menu</p>

        <nav className="flex flex-col gap-1 flex-1">
          {sidebarMenus.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium text-left transition-all duration-150 hover:scale-[1.02]
                  ${active
                    ? "bg-sage-green text-white shadow-md shadow-sage-green/30"
                    : "text-stone-500 hover:bg-warm-beige hover:text-stone-700 hover:shadow-sm"}`}
              >
                <span className="w-5 text-center text-[13px] leading-none">{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium text-stone-400 hover:text-red-400 hover:bg-red-50 hover:scale-[1.02] transition-all duration-150"
        >
          <span className="w-5 text-center text-[13px]">⏻</span>
          Logout
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Header dengan tabs ── */}
        <header className="bg-white shadow-sm px-6 flex-shrink-0 flex items-center justify-between gap-4 h-16">
          <nav className="flex items-center gap-1 h-full">
            {headerTabs.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`relative h-full px-5 text-[12px] font-semibold transition-all duration-150 hover:text-sage-green
                    ${active ? "text-sage-green" : "text-stone-400 hover:text-stone-600"}`}
                >
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-green rounded-full" />}
                </button>
              );
            })}
          </nav>

          {sidebarMenus.some((m) => pathname.startsWith(m.href)) && (
            <p className="text-[13px] font-bold text-stone-700 flex-1">{pageTitle}</p>
          )}

          <div className="flex items-center gap-3 flex-shrink-0">
            <p className="text-[10px] text-stone-400 hidden sm:block">
              {new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div className="h-5 w-px bg-stone-100" />
            <div className="text-right">
              <p className="text-[11px] font-semibold text-stone-700 leading-tight">Admin Name</p>
              <p className="text-[9px] text-stone-400">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-sage-green/20 border-2 border-sage-green flex items-center justify-center text-[9px] font-bold text-sage-green shadow-sm">
              AN
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>

      {/* ── Floating Chat ── */}
      <FloatingChatStaff />
    </div>
  );
}
