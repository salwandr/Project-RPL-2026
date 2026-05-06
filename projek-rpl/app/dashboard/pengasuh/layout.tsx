"use client";

import { usePathname, useRouter } from "next/navigation";
import FloatingChatStaff from "@/components/floating-chat-staff";

const headerTabs = [
  { href: "/dashboard/pengasuh/kedatangan",  label: "Kedatangan"  },
  { href: "/dashboard/pengasuh/penjemputan", label: "Penjemputan" },
  { href: "/dashboard/pengasuh/daily-log",   label: "Daily Log"   },
];

export default function PengasuhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <div className="flex h-screen bg-[#F5F0EB] font-montserrat overflow-hidden">

      {/* ── Sidebar kiri ── */}
      <aside className="w-52 flex-shrink-0 bg-white shadow-lg flex flex-col py-8 px-3 z-10">
        <div className="mb-7 px-3">
          <p className="text-[9px] font-bold uppercase tracking-[2px] text-stone-400">Pengasuh Portal</p>
          <p className="text-[17px] font-bold text-stone-800 leading-tight">Tanika</p>
          <p className="text-[17px] font-bold text-sage-green leading-tight -mt-0.5">Daycare</p>
        </div>

        {/* Info pengasuh */}
        <div className="mx-3 mb-6 p-3 bg-sage-green/10 rounded-xl border border-sage-green/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sage-green/20 border border-sage-green flex items-center justify-center text-[9px] font-bold text-sage-green">
              SP
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-700 leading-tight">Siti Pengasuh</p>
              <p className="text-[9px] text-stone-400">Pengasuh</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-stone-300 px-3 mb-2">Info Hari Ini</p>

        {/* Quick info */}
        <div className="px-3 space-y-2 flex-1">
          <div className="bg-warm-beige rounded-xl p-3">
            <p className="text-[9px] text-stone-400 mb-0.5">Tanggal</p>
            <p className="text-[11px] font-bold text-stone-600">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="bg-sage-green/10 rounded-xl p-3">
            <p className="text-[9px] text-stone-400 mb-0.5">Jam Operasional</p>
            <p className="text-[11px] font-bold text-sage-green">06.00 – 18.00</p>
          </div>
          <div className="bg-pastel-blue/20 rounded-xl p-3">
            <p className="text-[9px] text-stone-400 mb-0.5">Kelas Anda</p>
            <p className="text-[11px] font-bold text-stone-600">Rainbow Room</p>
          </div>
        </div>

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
                  className={`relative h-full px-5 text-[12px] font-semibold transition-all duration-150
                    ${active ? "text-sage-green" : "text-stone-400 hover:text-stone-600"}`}
                >
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-green rounded-full" />}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <p className="text-[10px] text-stone-400 hidden sm:block">
              {new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div className="h-5 w-px bg-stone-100" />
            <div className="text-right">
              <p className="text-[11px] font-semibold text-stone-700 leading-tight">Siti Pengasuh</p>
              <p className="text-[9px] text-stone-400">Pengasuh</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-sage-green/20 border-2 border-sage-green flex items-center justify-center text-[9px] font-bold text-sage-green shadow-sm">
              SP
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