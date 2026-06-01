"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getChildrenByParent, type Child } from "@/lib/services/dailyLogs";

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

export default function RaporOrangTua() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChildren() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const kids = await getChildrenByParent(user.id);
      setChildren(kids);

      if (kids.length > 0) {
        setSelectedChild(kids[0].id);
      }

      setLoading(false);
    }

    loadChildren();
  }, []);

  useEffect(() => {
    if (!selectedChild) return;

    async function loadReports() {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("child_id", selectedChild)
        .order("report_date", { ascending: false });

      if (error) {
        console.error(error);
        setReports([]);
        setSelectedReport(null);
      } else {
        setReports(data || []);
        setSelectedReport(data?.[0] || null);
      }

      setLoading(false);
    }

    loadReports();
  }, [selectedChild]);

  const currentChild = children.find((c) => c.id === selectedChild);

  if (loading && children.length === 0) {
    return <div className="p-8">Memuat rapor...</div>;
  }

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
            Rapor Perkembangan {currentChild?.full_name ?? "Anak"}
          </h1>
        </div>
      </div>

      {children.length > 1 && (
        <div>
          <p className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
            Pilih Anak
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`shrink-0 rounded-2xl border-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                  selectedChild === child.id
                    ? "border-[#1883FF] bg-[#1883FF] text-white"
                    : "border-[#FFE26F] bg-white text-[#4A4A4A]"
                }`}
              >
                {child.full_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {reports.length > 0 && (
        <div>
          <p className="mb-3 ml-1 text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
            Pilih Rapor
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`shrink-0 rounded-2xl border-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                  selectedReport?.id === report.id
                    ? "border-[#1883FF] bg-[#1883FF] text-white"
                    : "border-[#FFE26F] bg-white text-[#4A4A4A]"
                }`}
              >
                {report.report_type === "weekly" ? "Mingguan" : "Bulanan"} •{" "}
                {report.report_date}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !selectedReport && (
        <div className="rounded-[2rem] border border-[#FFE26F]/40 bg-white p-10 text-center shadow-sm">
          <p className="mb-3 text-4xl">📋</p>
          <p className="font-semibold text-[#1A1A1A]">Belum ada rapor</p>
          <p className="mt-1 text-sm font-light text-[#4A4A4A]">
            Rapor untuk anak ini belum tersedia.
          </p>
        </div>
      )}

      {!loading && selectedReport && (
        <div className="rounded-[2rem] border border-[#FFE26F]/40 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
              {selectedReport.report_type === "weekly"
                ? "Rapor Mingguan"
                : "Rapor Bulanan"}
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#1A1A1A]">
              Catatan Perkembangan Anak
            </h2>

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
                        <span className="font-semibold text-[#4A4A4A]">
                          {area}
                        </span>

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

                <div className="whitespace-pre-line rounded-2xl border border-[#FFE26F]/40 bg-[#FFFDF7] p-6 text-sm leading-relaxed text[#000000]">
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