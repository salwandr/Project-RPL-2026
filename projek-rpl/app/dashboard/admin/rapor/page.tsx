"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getChildren, type Child } from "@/lib/services/children";

interface Report {
  id: string;
  child_id: string;
  report_type: "weekly" | "monthly";
  content: string;
  report_date: string;
  created_at: string;
}

function renderStars(value: number) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= value ? "text-[#FEB700]" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function splitReportContent(content: string) {
  const lines = content.split("\n");

  const assessmentLines = lines.filter(
    (line) => line.includes("/5") && line.includes(":")
  );

  const descriptionLines = lines.filter(
    (line) =>
      !line.includes("/5") &&
      line.trim() !== "" &&
      line !== "ASSESSMENT" &&
      line !== "DESCRIPTION"
  );

  return { assessmentLines, descriptionLines };
}

function formatTanggal(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatJam(t: string) {
  return t.slice(0, 5).replace(":", ".");
}

export default function RaporAdminPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [reportsByChild, setReportsByChild] = useState<Record<string, Report[]>>({});
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [openChildId, setOpenChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChildren() {
      setLoading(true);
      try {
        const kids = await getChildren();
        setChildren(kids);
        if (kids.length > 0) {
          setSelectedChild(kids[0].id);
          setOpenChildId(kids[0].id);
        }
      } catch (error) {
        console.error("Gagal memuat data anak:", error);
      } finally {
        setLoading(false);
      }
    }

    loadChildren();
  }, []);

  useEffect(() => {
    if (children.length === 0) return;

    async function loadAllReports() {
      setLoading(true);
      try {
        const childIds = children.map((child) => child.id);
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .in("child_id", childIds)
          .order("report_date", { ascending: false });

        if (error) {
          throw error;
        }

        const grouped: Record<string, Report[]> = {};
        (data || []).forEach((report) => {
          grouped[report.child_id] = grouped[report.child_id] || [];
          grouped[report.child_id].push(report);
        });

        setReportsByChild(grouped);
        const currentId = selectedChild || children[0].id;
        setSelectedReport(grouped[currentId]?.[0] ?? null);
      } catch (error) {
        console.error("Gagal memuat rapor:", error);
        setReportsByChild({});
        setSelectedReport(null);
      } finally {
        setLoading(false);
      }
    }

    loadAllReports();
  }, [children, selectedChild]);

  const currentChild = children.find((child) => child.id === selectedChild);
  const childReports = reportsByChild[selectedChild] || [];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#FFE26F]/40 bg-white p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-56 w-56 translate-x-20 -translate-y-20 rounded-full bg-[#C4E02F]/15" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-12 translate-y-12 rounded-full bg-[#1883FF]/10" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C4E02F]/40 bg-[#C4E02F]/20 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#C4E02F]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]">
              Rapor Perkembangan
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Rapor Semua Anak
          </h1>

          <p className="mt-1 text-sm text-[#4A4A4A]">
            Buka folder anak untuk melihat daftar rapor mereka.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {children.map((child) => {
          const childReportList = reportsByChild[child.id] || [];
          const isOpen = openChildId === child.id;

          return (
            <div key={child.id} className="overflow-hidden rounded-[1.5rem] border border-[#F0F0F0] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setOpenChildId(isOpen ? null : child.id);
                  setSelectedChild(child.id);
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <div className="text-base font-bold text-[#1A1A1A]">{child.full_name}</div>
                  <div className="mt-1 text-sm text-[#4A4A4A]">
                    {child.program ?? "Program belum diatur"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#F7F9FC] px-3 py-1 text-[11px] font-semibold text-[#4A4A4A]">
                    {childReportList.length} rapor
                  </span>
                  <span className={`text-2xl text-[#4A4A4A] transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}>
                    ›
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[#F0F0F0] bg-[#F7F9FC] px-5 py-4">
                  {childReportList.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">Belum ada rapor untuk anak ini.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {childReportList.map((report) => (
                        <button
                          key={report.id}
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                            selectedReport?.id === report.id
                              ? "border-[#1883FF] bg-[#1883FF] text-white"
                              : "border-[#E5E7EB] bg-white text-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span>{report.report_type === "weekly" ? "Mingguan" : "Bulanan"}</span>
                            <span className="text-[12px] text-[#6B7280]">{report.report_date}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && !selectedReport && (
        <div className="rounded-[2rem] border border-[#FFE26F]/40 bg-white p-10 text-center shadow-sm">
          <p className="mb-3 text-4xl">📋</p>
          <p className="font-semibold text-[#1A1A1A]">Belum ada rapor</p>
          <p className="mt-1 text-sm font-light text-[#4A4A4A]">
            Pilih anak dan rapor untuk melihat detailnya.
          </p>
        </div>
      )}

      {!loading && selectedReport && (
        <div className="rounded-[2rem] border border-[#FFE26F]/40 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
              {selectedReport.report_type === "weekly" ? "Rapor Mingguan" : "Rapor Bulanan"}
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#1A1A1A]">
              Catatan Perkembangan Anak
            </h2>

            <p className="mt-1 text-sm text-[#4A4A4A]">
              Anak: <strong>{currentChild?.full_name ?? "—"}</strong>
            </p>

            <p className="mt-1 text-sm text-[#4A4A4A]">
              Tanggal rapor: {selectedReport.report_date}
            </p>
          </div>

          {(() => {
            const { assessmentLines, descriptionLines } = splitReportContent(
              selectedReport.content
            );

            return (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-black text-[#1A1A1A]">
                    Penilaian Perkembangan
                  </h3>

                  <div className="space-y-3">
                    {assessmentLines.map((line) => {
                      const [area, valuePart] = line.split(":");
                      const rating = Number(valuePart.trim().charAt(0));

                      return (
                        <div
                          key={area}
                          className="flex items-center justify-between rounded-2xl border border-[#FFD400]/100 bg-[#FFFFFF] p-2"
                        >
                          <span className="font-semibold text-[#4A4A4A]">{area}</span>
                          {renderStars(rating)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-black text-[#1A1A1A]">
                    Catatan Pengasuh
                  </h3>

                  <div className="whitespace-pre-line rounded-2xl border border-[#FFE26F]/40 bg-[#FFFDF7] p-6 text-sm leading-relaxed text-[#000000]">
                    {descriptionLines.join("\n")}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
