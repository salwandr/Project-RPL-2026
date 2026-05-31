"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getChildrenByParent,
  getDailyLogDates,
  getDailyLogByDate,
  type Child,
  type DailyLog,
} from "@/lib/services/dailyLogs";

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
      <h2 className="font-bold text-[#1A1A1A] mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function DailyLogOrangTua() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setParentId(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!parentId) return;

    async function loadChildren() {
      setLoading(true);

      const data = await getChildrenByParent(parentId!);
      setChildren(data);

      if (data.length > 0) {
        setSelectedChild(data[0]);
      }

      setLoading(false);
    }

    loadChildren();
  }, [parentId]);

  useEffect(() => {
    if (!selectedChild) return;

    async function loadDates() {
      setLoading(true);

      const newDates = await getDailyLogDates(selectedChild!.id);
      setDates(newDates);

      if (newDates.length > 0) {
        setSelectedDate(newDates[0]);
      } else {
        setSelectedDate("");
        setLog(null);
      }

      setLoading(false);
    }

    loadDates();
  }, [selectedChild]);

  useEffect(() => {
    if (!selectedChild || !selectedDate) return;

    async function loadLog() {
      const data = await getDailyLogByDate(selectedChild!.id, selectedDate);
      setLog(data);
    }

    loadLog();
  }, [selectedChild, selectedDate]);

  useEffect(() => {
    if (!selectedChild) return;

    const channel = supabase
      .channel(`daily-log-parent-${selectedChild.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_logs",
          filter: `child_id=eq.${selectedChild.id}`,
        },
        async () => {
          const newDates = await getDailyLogDates(selectedChild.id);
          setDates(newDates);

          const dateToOpen = selectedDate || newDates[0];

          if (dateToOpen) {
            setSelectedDate(dateToOpen);
            const newLog = await getDailyLogByDate(selectedChild.id, dateToOpen);
            setLog(newLog);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChild, selectedDate]);

  if (loading) {
    return <div className="p-8">Loading daily log...</div>;
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="bg-white rounded-[2rem] p-6 border border-[#FFE26F]/40 shadow-sm">
        <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-wider">
          Laporan Harian
        </p>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mt-2">
          Daily Log {selectedChild?.full_name ?? "Anak"}
        </h1>
        <p className="text-sm text-[#4A4A4A] mt-1">
          {selectedDate ? formatDate(selectedDate) : "Belum ada tanggal log"}
        </p>
      </div>

      {children.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`px-4 py-2 rounded-2xl border-2 font-semibold text-sm ${
                child.id === selectedChild?.id
                  ? "bg-[#1883FF] border-[#1883FF] text-white"
                  : "bg-white border-[#FFE26F] text-[#4A4A4A]"
              }`}
            >
              {child.full_name}
            </button>
          ))}
        </div>
      )}

      {dates.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-3 rounded-2xl border-2 font-semibold whitespace-nowrap ${
                date === selectedDate
                  ? "bg-[#1883FF] border-[#1883FF] text-white"
                  : "bg-white border-[#FFE26F] text-[#4A4A4A]"
              }`}
            >
              <span className="text-[10px]">
                {new Date(date).toLocaleDateString("id-ID", { weekday: "short" })}
              </span>
              <span className="text-lg font-bold">{new Date(date).getDate()}</span>
              <span className="text-[10px]">
                {new Date(date).toLocaleDateString("id-ID", { month: "short" })}
              </span>
            </button>
          ))}
        </div>
      )}

      {!log && (
        <div className="bg-white rounded-[2rem] p-12 border border-[#FFE26F]/40 shadow-sm text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="font-bold text-[#1A1A1A]">Belum ada laporan</p>
          <p className="text-sm text-[#4A4A4A] mt-1">
            Daily log belum diisi oleh pengasuh.
          </p>
        </div>
      )}

      {log && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Mood">
            <p className="text-3xl mb-2">
              {log.mood === "senang"
                ? "😊"
                : log.mood === "biasa"
                ? "😐"
                : log.mood === "rewel"
                ? "😢"
                : log.mood === "mengantuk"
                ? "😴"
                : "—"}
            </p>
            <p className="font-bold capitalize">{log.mood ?? "-"}</p>
            <p className="text-sm text-[#4A4A4A] mt-2">{log.mood_catatan ?? ""}</p>
          </Card>

          <Card title="Makan">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold">Makan Pagi: {log.makan_pagi_porsi ?? "-"}</p>
                <p>{log.makan_pagi_menu ?? "-"}</p>
                <p className="text-[#4A4A4A]">{log.makan_pagi_catatan ?? ""}</p>
              </div>
              <div>
                <p className="font-bold">Makan Siang: {log.makan_siang_porsi ?? "-"}</p>
                <p>{log.makan_siang_menu ?? "-"}</p>
                <p className="text-[#4A4A4A]">{log.makan_siang_catatan ?? ""}</p>
              </div>
              <p>Snack pagi: {log.snack_pagi ?? "-"}</p>
              <p>Snack sore: {log.snack_sore ?? "-"}</p>
            </div>
          </Card>

          <Card title="Tidur & Toilet">
            <div className="space-y-2 text-sm">
              <p>
                Tidur: {log.tidur_mulai ?? "-"} - {log.tidur_selesai ?? "-"}
              </p>
              <p>Kualitas: {log.tidur_kualitas ?? "-"}</p>
              <p>Toilet: {log.toilet ?? "-"}</p>
              <p>{log.toilet_frekuensi ?? ""}</p>
            </div>
          </Card>

          <Card title="Aktivitas">
            <div className="flex flex-wrap gap-2 mb-3">
              {(log.aktivitas_belajar ?? []).map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-xl bg-[#C4E02F]/20 text-xs font-bold"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-sm text-[#4A4A4A]">{log.bermain_catatan ?? ""}</p>
          </Card>

          <Card title="Catatan Pengasuh">
            <p className="text-sm text-[#4A4A4A] italic">
              &quot;{log.catatan_umum ?? "Tidak ada catatan."}&quot;
            </p>
          </Card>

          {(log.foto ?? []).length > 0 && (
            <Card title="Foto">
              <div className="grid grid-cols-2 gap-3">
                {(log.foto ?? []).map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Daily log"
                    className="rounded-2xl w-full h-40 object-cover"
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}