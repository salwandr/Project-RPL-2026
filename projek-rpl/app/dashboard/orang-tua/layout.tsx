"use client";

import { useRouter, usePathname } from "next/navigation";
import { logout, getCurrentProfile } from "@/lib/services/auth";
import { useEffect, useState } from "react";
import { getChildren } from "@/lib/services/children";

export default function OrangTuaLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const [fullName, setFullName] = useState("Loading...");
const router = useRouter();
const pathname = usePathname();

const handleLogout = async () => {
  await logout();
  router.replace("/login");
};

useEffect(() => {
  async function loadProfile() {
    try {
      const profile = await getCurrentProfile();

      if (profile) {
        setFullName(profile.full_name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadProfile();
}, []);

useEffect(() => {
  async function checkEnrollmentAccess() {
    try {
      const children = await getChildren();
      const child = children?.[0];

      const allowedBeforePaid = [
        "/dashboard/orang-tua",
        "/dashboard/orang-tua/daftar/data-anak",
        "/dashboard/orang-tua/daftar/program",
        "/dashboard/orang-tua/daftar/pembayaran",
        "/dashboard/orang-tua/profile",
      ];

      const allowedNoChild = [
        "/dashboard/orang-tua",
        "/dashboard/orang-tua/profile",
        "/dashboard/orang-tua/daftar/data-anak",
      ];

      if (!child && !allowedNoChild.includes(pathname)) {
        router.replace("/dashboard/orang-tua/daftar/data-anak");
        return;
      }

      if (
        child &&
        !child.program &&
        !allowedBeforePaid.includes(pathname)
      ) {
        router.replace("/dashboard/orang-tua/daftar/program");
        return;
      }

      if (
        child &&
        child.program &&
        child.payment_status !== "approved" &&
        !allowedBeforePaid.includes(pathname)
      ) {
        router.replace("/dashboard/orang-tua/daftar/pembayaran");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  checkEnrollmentAccess();
}, [pathname, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-montserrat">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col border-r border-warm-beige/40 bg-white/80 backdrop-blur-xl p-6">
        
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">
            Tanika
          </h1>

          <p className="text-sm text-[#4A4A4A] font-light">
            Daycare Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0">
          {[
            {
              label: "Dashboard",
              href: "/dashboard/orang-tua",
            },
            {
              label: "Pendaftaran",
              href: "/dashboard/orang-tua/daftar/data-anak",
            },
            {
              label: "Daily Log",
              href: "/dashboard/orang-tua/daily-log",
            },
            {
              label: "Rapor",
              href: "/dashboard/orang-tua/rapor",
            },
            {
              label: "Penjemputan",
              href: "/dashboard/orang-tua/penjemputan",
            },
            {
              label: "Profile",
              href: "/dashboard/orang-tua/profile",
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
            Tanika Daycare
          </p>

          <p className="mt-1 text-xs text-[#4A4A4A] leading-relaxed">
            Pantau aktivitas anak dengan mudah dan realtime.
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
                Orang Tua Panel
              </p>

              <h2 className="text-lg font-bold">
                Dashboard
              </h2>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm border border-warm-beige/40">
              <div className="h-10 w-10 rounded-full bg-bubblegum/40" />

              <div>
                <p className="text-sm font-bold">
                  {fullName}
                </p>

                <p className="text-xs text-[#4A4A4A]">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}