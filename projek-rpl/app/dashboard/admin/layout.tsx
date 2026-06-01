"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/services/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-montserrat">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col border-r border-warm-beige/40 bg-white/80 backdrop-blur-xl p-6">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">Tanika</h1>

          <p className="text-sm text-[#4A4A4A] font-light">
            Owner Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0">
          {[
            {
              label: "Dashboard",
              href: "/dashboard/admin",
            },
            {
              label: "pembayaran",
              href: "/dashboard/admin/pembayaran",
            },
            {
              label: "Children",
              href: "/dashboard/admin/data-anak",
            },
            {
              label: "Daily Logs",
              href: "/dashboard/admin/daily-log",
            },
            {
              label: "Reports",
              href: "/dashboard/admin/rapor",
            },
            {
              label: "Parents",
              href: "/dashboard/admin/orang-tua",
            },
            {
              label: "Teachers",
              href: "/dashboard/admin/pengasuh",
            },
            {
              label: "Profile",
              href: "/dashboard/admin/profile",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="
                rounded-2xl
                px-2
                py-3
                text-sm
                font-semibold
                transition-all
                hover:bg-sky-blue/40
                hover:translate-x-1
              "
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="mt-auto rounded-3xl bg-sage-green/10 p-3 border border-sage-green/10">
          <p className="text-sm font-bold text-sage-green">
            Tanika Admin
          </p>

          <p className="mt-1 text-xs text-[#4A4A4A] leading-relaxed">
            Manage daycare data, payments, reports, and daily activities.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 rounded-2xl bg-foreground px-4 py-3 text-sm font-bold text-warm-beige transition hover:opacity-90"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 border-b border-warm-beige/30 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#4A4A4A]">
                Admin Panel
              </p>

              <h2 className="text-lg font-bold">Owner Dashboard</h2>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm border border-warm-beige/40">
              <div className="h-10 w-10 rounded-full bg-sage-green/40" />

              <div>
                <p className="text-sm font-bold">Admin</p>

                <p className="text-xs text-[#4A4A4A]">Owner</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE */}
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}