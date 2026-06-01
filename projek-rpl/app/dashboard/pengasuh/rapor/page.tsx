"use client";

import { useEffect, useState } from "react";
import { getChildren } from "@/lib/services/children";
import { createReport, getReports } from "@/lib/services/reports";

const assessmentAreas = [
  "Fungsi Kognitif",
  "Perkembangan Bahasa",
  "Kemampuan Sosial",
  "Perkembangan Emosional",
  "Hubungan dengan Teman",
  "Kemandirian",
  "Kemampuan Motorik",
];

const ratingLabels = [
  "Belum Berkembang",
  "Mulai Berkembang",
  "Cukup Berkembang",
  "Berkembang Baik",
  "Sangat Berkembang",
];

export default function PengasuhRaporPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [childId, setChildId] = useState("");
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const childrenData = await getChildren();
      setChildren(childrenData || []);

      const reportsData = await getReports();
      setReports(reportsData || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load rapor data.");
    } finally {
      setLoading(false);
    }
  }

  function setAreaRating(area: string, value: number) {
    setRatings((prev) => ({
      ...prev,
      [area]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!childId) {
      alert("Choose child first.");
      return;
    }

    if (assessmentAreas.some((area) => !ratings[area])) {
      alert("Please rate all assessment areas.");
      return;
    }

    if (!description.trim()) {
      alert("Write the report description first.");
      return;
    }

    const content = `
ASSESSMENT

${assessmentAreas
  .map((area) => {
    const rating = ratings[area];
    return `${area}: ${rating}/5 - ${ratingLabels[rating - 1]}`;
  })
  .join("\n")}

DESCRIPTION

${description}
`.trim();

    try {
      setSaving(true);

      await createReport({
        child_id: childId,
        report_type: reportType,
        content,
        report_date: new Date().toISOString().split("T")[0],
      });

      setChildId("");
      setReportType("weekly");
      setRatings({});
      setDescription("");

      await loadData();

      alert("Rapor saved successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save rapor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading rapor...</div>;
  }

  return (
    <div className="p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-warm-beige/40 bg-white p-8 shadow-sm"
        >
          <h1 className="text-3xl font-black">Buat Rapor</h1>

          <div className="mt-8">
            <label className="font-bold">Anak</label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-warm-beige/60 px-5 py-4 outline-none"
            >
              <option value="">Pilih Anak</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label className="font-bold">Jenis Rapor</label>
            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value as "weekly" | "monthly")
              }
              className="mt-3 w-full rounded-2xl border border-warm-beige/60 px-5 py-4 outline-none"
            >
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
            </select>
          </div>

          <div className="mt-7">
            <h2 className="font-black">Assessment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Berikan penilaian berdasarkan perkembangan anak.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-warm-beige/50">
                    <th className="py-3 font-black">Aspek</th>
                    {ratingLabels.map((label) => (
                      <th key={label} className="px-3 py-3 text-center font-black">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {assessmentAreas.map((area) => (
                    <tr key={area} className="border-b border-warm-beige/40">
                      <td className="py-3">{area}</td>

                      {[1, 2, 3, 4, 5].map((value) => (
                        <td key={value} className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setAreaRating(area, value)}
                            className={`text-2xl transition ${
                              ratings[area] === value
                                ? "text-[#FEB700] scale-110"
                                : "text-[#E9C766] hover:scale-110"
                            }`}
                          >
                            {ratings[area] >= value ? "★" : "☆"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-7">
            <label className="font-black">Catatan Perkembangan</label>
            <p className="mt-1 text-sm text-gray-500">
              Tuliskan ringkasan perkembangan anak secara lengkap.
            </p>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              placeholder="Tuliskan catatan perkembangan anak di sini..."
              className="mt-3 w-full resize-none rounded-2xl border border-warm-beige/60 px-5 py-4 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-7 rounded-full bg-sage-green px-8 py-4 font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Simpan Rapor"}
          </button>
        </form>

        <div className="rounded-[2rem] border border-warm-beige/40 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black">Rapor Terbaru</h1>

          {reports.length === 0 ? (
            <div className="mt-24 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-warm-beige/20 p-6 text-4xl">
                📄
              </div>
              <p className="mt-5 font-bold">Belum ada rapor.</p>
              <p className="mt-1 text-gray-500">
                Buat rapor terlebih dahulu untuk melihatnya di sini.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-warm-beige/40 p-5"
                >
                  <h3 className="text-lg font-black">
                    {report.children?.full_name || "Unknown Child"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {report.report_type === "weekly"
                      ? "Laporan Mingguan"
                      : "Laporan Bulanan"}{" "}
                    • {report.report_date}
                  </p>

                  <p className="mt-4 whitespace-pre-line text-sm text-gray-700">
                    {report.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}