"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type SkillStatus = "Completed" | "Not Completed" | "Developing";

interface Skill {
  label: string;
  status: SkillStatus;
}

interface Domain {
  title: string;
  skills: Skill[];
  icon: React.ReactNode;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<SkillStatus, { label: string; color: string; bg: string; bar: number }> = {
  Completed:     { label: "Excellent",   color: "#5A7A5E", bg: "#E8F3E9", bar: 95 },
  Developing:    { label: "Developing",  color: "#C8973A", bg: "#FFF8EC", bar: 50 },
  "Not Completed": { label: "Needs Work", color: "#E07B6A", bg: "#FAE8E5", bar: 25 },
};

const domainScore = (skills: Skill[]) => {
  const total = skills.reduce((acc, s) => {
    if (s.status === "Completed") return acc + 100;
    if (s.status === "Developing") return acc + 50;
    return acc;
  }, 0);
  return Math.round(total / skills.length);
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SkillStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function SkillItem({
  skill,
  showEdit,
  onEdit,
}: {
  skill: Skill;
  showEdit: boolean;
  onEdit: () => void;
}) {
  const cfg = statusConfig[skill.status];
  return (
    <div className="flex items-center gap-3 group">
      {/* Bar + label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-[#2C2C2C] font-medium truncate">{skill.label}</span>
          <StatusBadge status={skill.status} />
        </div>
        <div className="w-full h-1.5 bg-warm-beige rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${cfg.bar}%`, background: cfg.color }}
          />
        </div>
      </div>

      {/* Edit button — pengasuh/admin only */}
      {showEdit && (
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-7 h-7 rounded-lg bg-warm-beige flex items-center justify-center hover:bg-[#D4C8BA]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#8A8078]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 15v-2z" />
          </svg>
        </button>
      )}
    </div>
  );
}

function DomainCard({
  domain,
  showEdit,
  onEditSkill,
}: {
  domain: Domain;
  showEdit: boolean;
  onEditSkill: (domainTitle: string, skillLabel: string) => void;
}) {
  const score = domainScore(domain.skills);
  const scoreColor =
    score >= 80 ? "#5A7A5E" : score >= 50 ? "#C8973A" : "#E07B6A";

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {/* Domain header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-warm-beige flex items-center justify-center text-[#8A8078]">
            {domain.icon}
          </div>
          <h3 className="text-[16px] font-semibold text-[#2C2C2C]">{domain.title}</h3>
        </div>
        <span
          className="text-[13px] font-semibold px-3 py-1 rounded-full"
          style={{ color: scoreColor, background: `${scoreColor}18` }}
        >
          {score}%
        </span>
      </div>

      {/* Overall bar */}
      <div className="w-full h-1.5 bg-warm-beige rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: scoreColor }}
        />
      </div>

      {/* Skills */}
      <div className="space-y-4">
        {domain.skills.map((skill) => (
          <SkillItem
            key={skill.label}
            skill={skill}
            showEdit={showEdit}
            onEdit={() => onEditSkill(domain.title, skill.label)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  target,
  onClose,
  onSave,
}: {
  target: { domain: string; skill: string } | null;
  onClose: () => void;
  onSave: (domain: string, skill: string, status: SkillStatus) => void;
}) {
  const [selected, setSelected] = useState<SkillStatus>("Completed");
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-8 w-full max-w-sm mx-4 shadow-2xl font-montserrat"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-semibold text-[#2C2C2C] mb-1">Update Status</h3>
        <p className="text-[13px] text-[#8A8078] font-light mb-6">
          {target.domain} — {target.skill}
        </p>

        <div className="space-y-2 mb-8">
          {(["Completed", "Developing", "Not Completed"] as SkillStatus[]).map((s) => {
            const cfg = statusConfig[s];
            const active = selected === s;
            return (
              <button
                key={s}
                onClick={() => setSelected(s)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all"
                style={{
                  borderColor: active ? cfg.color : "transparent",
                  background: active ? cfg.bg : "#F2EAE0",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: cfg.color }}
                />
                <span
                  className="text-[14px] font-medium"
                  style={{ color: active ? cfg.color : "#8A8078" }}
                >
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium text-[#8A8078] bg-warm-beige hover:bg-[#D4C8BA] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => { onSave(target.domain, target.skill, selected); onClose(); }}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium text-white bg-sage-green hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(168,197,165,0.4)]"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const INITIAL_DOMAINS: Domain[] = [
  {
    title: "Cognitive Development",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    skills: [
      { label: "Problem Solving", status: "Completed" },
      { label: "Memory & Attention", status: "Completed" },
      { label: "Language Skills", status: "Completed" },
      { label: "Pattern Recognition", status: "Developing" },
    ],
  },
  {
    title: "Motor Skills",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
    skills: [
      { label: "Fine Motor Control", status: "Completed" },
      { label: "Gross Motor Skills", status: "Completed" },
      { label: "Hand-Eye Coordination", status: "Developing" },
    ],
  },
  {
    title: "Social & Emotional",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    skills: [
      { label: "Peer Interaction", status: "Completed" },
      { label: "Self-Regulation", status: "Developing" },
      { label: "Empathy & Sharing", status: "Completed" },
    ],
  },
  {
    title: "Creative Expression",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    skills: [
      { label: "Artistic Ability", status: "Completed" },
      { label: "Musical Interest", status: "Completed" },
      { label: "Imaginative Play", status: "Completed" },
    ],
  },
];

export default function RaporPage() {
  const userRole = "pengasuh" as string;
  const isEditor = userRole === "admin" || userRole === "pengasuh";

  const [domains, setDomains] = useState<Domain[]>(INITIAL_DOMAINS);
  const [editTarget, setEditTarget] = useState<{ domain: string; skill: string } | null>(null);

  const handleSave = (domainTitle: string, skillLabel: string, status: SkillStatus) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.title !== domainTitle ? d : {
          ...d,
          skills: d.skills.map((s) => s.label !== skillLabel ? s : { ...s, status }),
        }
      )
    );
  };

  const overallScore = Math.round(
    domains.reduce((acc, d) => acc + domainScore(d.skills), 0) / domains.length
  );

  return (
    <>
      <div className="max-w-4xl pb-20 font-montserrat">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#2C2C2C]">Rapor Perkembangan</h1>
            <p className="text-sm font-light text-[#8A8078] mt-0.5">Periode April – Mei 2025</p>
          </div>
          {isEditor && (
            <button
              onClick={() => setEditTarget({ domain: domains[0].title, skill: domains[0].skills[0].label })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium text-white bg-sage-green hover:opacity-90 transition-opacity shadow-[0_4px_16px_rgba(168,197,165,0.35)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Update Progress
            </button>
          )}
        </div>

        {/* ── Student + Overall Score Hero ── */}
        <div className="bg-[#2C2C2C] rounded-[24px] px-8 py-7 mb-6 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sage-green opacity-10 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-warm-beige opacity-10 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />

          {/* Avatar */}
          <div className="w-16 h-16 bg-warm-beige rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#9B8E82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          {/* Info */}
          <div className="flex-1 relative z-10">
            <div className="inline-block bg-white/10 text-white/50 text-[11px] tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-2">
              Rapor Bulanan
            </div>
            <h2 className="text-xl font-semibold text-white">Almira Zahra</h2>
            <div className="flex gap-4 mt-1">
              <span className="text-[13px] text-white/40">Usia: <span className="text-white/70">3 tahun 4 bulan</span></span>
              <span className="text-[13px] text-white/40">Kelas: <span className="text-white/70">Rainbow Room</span></span>
            </div>
          </div>

          {/* Overall score */}
          <div className="relative z-10 text-center shrink-0">
            <div
              className="text-4xl font-bold"
              style={{ color: overallScore >= 80 ? "#A8C5A5" : overallScore >= 50 ? "#C8973A" : "#E07B6A" }}
            >
              {overallScore}%
            </div>
            <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">Overall</div>
          </div>
        </div>

        {/* ── Domain Grid ── */}
        <div className="grid grid-cols-2 gap-4">
          {domains.map((domain) => (
            <DomainCard
              key={domain.title}
              domain={domain}
              showEdit={isEditor}
              onEditSkill={(d, s) => setEditTarget({ domain: d, skill: s })}
            />
          ))}
        </div>

        {/* ── Teacher Note ── */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] mt-4">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-[13px] font-semibold text-[#2C2C2C] uppercase tracking-[0.06em]">Catatan Pengasuh</h3>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-warm-beige flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#9B8E82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#2C2C2C]">Kak Dewi</p>
              <p className="text-[11px] text-[#8A8078]">Pengasuh Rainbow Room</p>
            </div>
          </div>
          <div className="bg-warm-beige rounded-xl px-5 py-4 text-[13px] text-[#2C2C2C] font-light leading-relaxed border-l-2 border-sage-green">
            Almira menunjukkan perkembangan yang sangat pesat bulan ini, terutama dalam hal kreativitas dan kemampuan berbahasa.
            Area yang perlu dikembangkan adalah self-regulation — Almira masih perlu bantuan saat harus bergantian atau menunggu giliran.
            Secara keseluruhan, Almira anak yang ceria dan penuh semangat belajar.
          </div>
        </div>

      </div>

      {/* ── Edit Modal ── */}
      <EditModal
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSave}
      />
    </>
  );
}