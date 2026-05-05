"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ResumeCertificationItem,
  ResumeContent,
  ResumeLanguageItem,
  ResumeRecord,
} from "@/types/resume";
import { ResumePreview } from "./resume-preview";
import { AIRewriteControls } from "./ai-rewrite-controls";
import { PDFDownloadButton } from "./pdf-download-button";
import { TemplateSelector } from "./template-selector";
import { PDFLockedNote } from "./pdf-locked-note";
import { isFreeTemplate } from "@/lib/templates";

function emptyExperience() {
  return {
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [""],
  };
}

function emptyEducation() {
  return {
    school: "",
    program: "",
    startDate: "",
    endDate: "",
    details: "",
  };
}

function emptyLanguage(): ResumeLanguageItem {
  return {
    name: "",
    level: "",
  };
}

function emptyCertification(): ResumeCertificationItem {
  return {
    name: "",
    issuer: "",
    year: "",
  };
}

function normalizeContent(value: ResumeRecord["content_json"]): ResumeContent {
  return {
    personal: {
      fullName: value?.personal?.fullName || "",
      email: value?.personal?.email || "",
      phone: value?.personal?.phone || "",
      location: value?.personal?.location || "",
    },
    summary: value?.summary || "",
    experience:
      value?.experience && value.experience.length > 0
        ? value.experience
        : [emptyExperience()],
    education:
      value?.education && value.education.length > 0
        ? value.education
        : [emptyEducation()],
    skills: Array.isArray(value?.skills) ? value.skills : [],
    languages:
      Array.isArray(value?.languages) && value.languages.length > 0
        ? value.languages
        : [emptyLanguage()],
    certifications:
      Array.isArray(value?.certifications) && value.certifications.length > 0
        ? value.certifications
        : [emptyCertification()],
  };
}

type Quota = {
  plan: "free" | "pro";
  used: number;
  limit: number | null;
  remaining: number | null;
};

type ParsedDate = {
  month: string;
  year: string;
  present: boolean;
};

const MONTH_OPTIONS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LANGUAGE_LEVELS = [
  "",
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Conversational",
  "Basic",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 56 }, (_, index) =>
  String(CURRENT_YEAR + 2 - index)
);

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
}

function parseStoredDate(value: string): ParsedDate {
  const raw = String(value || "").trim();

  if (!raw) {
    return { month: "", year: "", present: false };
  }

  if (/^present$/i.test(raw)) {
    return { month: "", year: "", present: true };
  }

  const isoMonthMatch = raw.match(/^(\d{4})-(\d{2})$/);
  if (isoMonthMatch) {
    const year = isoMonthMatch[1];
    const monthIndex = Number(isoMonthMatch[2]);
    return {
      month: MONTH_OPTIONS[monthIndex] || "",
      year,
      present: false,
    };
  }

  const monthYearMatch = raw.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i
  );
  if (monthYearMatch) {
    const month =
      MONTH_OPTIONS.find(
        (item) => item.toLowerCase() === monthYearMatch[1].toLowerCase()
      ) || "";
    return {
      month,
      year: monthYearMatch[2],
      present: false,
    };
  }

  const zhYearMatch = raw.match(/^(\d{4})撟?/);
  if (zhYearMatch) {
    return { month: "", year: zhYearMatch[1], present: false };
  }

  const yearOnlyMatch = raw.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return { month: "", year: yearOnlyMatch[1], present: false };
  }

  return { month: "", year: raw, present: false };
}

function formatStoredDate({
  month,
  year,
  present,
}: ParsedDate) {
  if (present) return "Present";
  if (month && year) return `${month} ${year}`;
  if (year) return year;
  return "";
}

function updateDateValue(
  currentValue: string,
  updates: Partial<ParsedDate>,
  allowPresent = false
) {
  const parsed = parseStoredDate(currentValue);
  const next: ParsedDate = {
    ...parsed,
    ...updates,
  };

  if (!allowPresent) {
    next.present = false;
  }

  return formatStoredDate(next);
}

export function ResumeEditor({
  resume,
  initialPlan,
  scheduledCancellation,
  currentPeriodEnd,
}: {
  resume: ResumeRecord;
  initialPlan: "free" | "pro";
  scheduledCancellation?: boolean;
  currentPeriodEnd?: string | null;
}) {
  const router = useRouter();
  const normalizedResumeContent = normalizeContent(resume.content_json);

  const [title, setTitle] = useState(resume.title);
  const [templateId, setTemplateId] = useState(
    resume.template_id || "professional-blue"
  );
  const [content, setContent] = useState<ResumeContent>(normalizedResumeContent);
  const [skillsInput, setSkillsInput] = useState(
    (normalizedResumeContent.skills || []).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [quota, setQuota] = useState<Quota | null>(null);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(true);
  const [languagesOpen, setLanguagesOpen] = useState(true);
  const [certificationsOpen, setCertificationsOpen] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  const skillsText = useMemo(() => content.skills.join(", "), [content.skills]);
  const pdfEnabled = initialPlan === "pro";
  const planName = initialPlan === "pro" ? "Pro" : "Free";

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    async function loadQuota() {
      try {
        const response = await fetch("/api/ai/quota");
        const data = await response.json();
        if (response.ok && active) {
          setQuota(data);
        }
      } catch {}
    }

    loadQuota();
    setHasHydrated(true);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSkillsInput((content.skills || []).join(", "));
  }, [skillsText]);

  async function handleSave(showAlert = false) {
    setSaving(true);
    setSaveState("saving");

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          template_id: templateId,
          content_json: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.code === "PREMIUM_TEMPLATE_LOCKED") {
          alert("This template is available on the Pro plan.");
          setTemplateId("professional-blue");
          setSaveState("error");
          return;
        }
        throw new Error("Save failed");
      }

      setSaveState("saved");
      if (showAlert) {
        alert("Saved successfully.");
      }
      router.refresh();

      setTimeout(() => {
        setSaveState("idle");
      }, 1500);
    } catch {
      setSaveState("error");
      if (showAlert) {
        alert("Could not save the resume.");
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!hasHydrated) return;

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
      handleSave(false);
    }, 2500);

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [title, templateId, content, hasHydrated]);

  function updateExperience(
    index: number,
    updates: Partial<ResumeContent["experience"][number]>
  ) {
    setContent({
      ...content,
      experience: content.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      ),
    });
  }

  function updateEducation(
    index: number,
    updates: Partial<ResumeContent["education"][number]>
  ) {
    setContent({
      ...content,
      education: content.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      ),
    });
  }

  function updateLanguage(index: number, updates: Partial<ResumeLanguageItem>) {
    setContent({
      ...content,
      languages: content.languages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      ),
    });
  }

  function updateCertification(
    index: number,
    updates: Partial<ResumeCertificationItem>
  ) {
    setContent({
      ...content,
      certifications: content.certifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      ),
    });
  }

  function addExperience() {
    setContent({
      ...content,
      experience: [...content.experience, emptyExperience()],
    });
    setExperienceOpen(true);
  }

  function removeExperience(index: number) {
    const next = content.experience.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setContent({
      ...content,
      experience: next.length > 0 ? next : [emptyExperience()],
    });
  }

  function addEducation() {
    setContent({
      ...content,
      education: [...content.education, emptyEducation()],
    });
    setEducationOpen(true);
  }

  function removeEducation(index: number) {
    const next = content.education.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setContent({
      ...content,
      education: next.length > 0 ? next : [emptyEducation()],
    });
  }

  function addLanguage() {
    setContent({
      ...content,
      languages: [...content.languages, emptyLanguage()],
    });
    setLanguagesOpen(true);
  }

  function removeLanguage(index: number) {
    const next = content.languages.filter((_, itemIndex) => itemIndex !== index);
    setContent({
      ...content,
      languages: next.length > 0 ? next : [emptyLanguage()],
    });
  }

  function addCertification() {
    setContent({
      ...content,
      certifications: [...content.certifications, emptyCertification()],
    });
    setCertificationsOpen(true);
  }

  function removeCertification(index: number) {
    const next = content.certifications.filter(
      (_, itemIndex) => itemIndex !== index
    );
    setContent({
      ...content,
      certifications: next.length > 0 ? next : [emptyCertification()],
    });
  }

  function handleTemplateChange(nextTemplateId: string) {
    if (initialPlan === "free" && !isFreeTemplate(nextTemplateId)) {
      alert("This template is available on the Pro plan.");
      window.location.href = "/upgrade";
      return;
    }

    setTemplateId(nextTemplateId);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Resume Builder</h1>
            <p className="mt-1 text-sm text-slate-500">
              Current plan: {planName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {pdfEnabled ? (
              <PDFDownloadButton
                targetId="resume-preview-export"
                fileName={title || "resume"}
              />
            ) : (
              <a
                href="/upgrade"
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900"
              >
                Upgrade for PDF
              </a>
            )}

            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-600">
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
              ? "Saved"
              : saveState === "error"
              ? "Save failed"
              : "Changes auto-save automatically"}
          </span>
          <span className="text-slate-400">Auto-save on</span>
        </div>

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          RoleArc supports English, Chinese, and bilingual resume content. AI
          rewrite keeps the same language as your input.
        </div>

        {scheduledCancellation ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your Pro plan is scheduled to end on{" "}
            <span className="font-semibold">
              {formatDate(currentPeriodEnd || null)}
            </span>
            . You can continue using Pro features until then.
          </div>
        ) : null}

        {quota && quota.plan === "free" ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Free plan:{" "}
            <span className="font-semibold">
              {quota.used} / {quota.limit}
            </span>{" "}
            AI rewrites used
          </div>
        ) : null}

        {!pdfEnabled ? (
          <div className="mb-6">
            <PDFLockedNote />
          </div>
        ) : null}

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Template
            </h2>
            <TemplateSelector
              value={templateId}
              onChange={handleTemplateChange}
              plan={initialPlan}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Resume Title
            </h2>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Resume"
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Personal Info
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-slate-300 px-4 py-2.5"
                placeholder="Full name"
                value={content.personal.fullName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal: {
                      ...content.personal,
                      fullName: e.target.value,
                    },
                  })
                }
              />
              <input
                className="rounded-xl border border-slate-300 px-4 py-2.5"
                placeholder="Email"
                value={content.personal.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal: {
                      ...content.personal,
                      email: e.target.value,
                    },
                  })
                }
              />
              <input
                className="rounded-xl border border-slate-300 px-4 py-2.5"
                placeholder="Phone"
                value={content.personal.phone}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal: {
                      ...content.personal,
                      phone: e.target.value,
                    },
                  })
                }
              />
              <input
                className="rounded-xl border border-slate-300 px-4 py-2.5"
                placeholder="Location"
                value={content.personal.location}
                onChange={(e) =>
                  setContent({
                    ...content,
                    personal: {
                      ...content.personal,
                      location: e.target.value,
                    },
                  })
                }
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Summary
              </h2>
              <AIRewriteControls
                section="summary"
                resumeId={resume.id}
                getText={() => content.summary}
                onApply={(value) => setContent({ ...content, summary: value })}
                onQuotaUpdate={setQuota}
              />
            </div>
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3"
              value={content.summary}
              onChange={(e) => setContent({ ...content, summary: e.target.value })}
            />
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Experience
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Add Experience
                </button>
                <button
                  type="button"
                  onClick={() => setExperienceOpen((v) => !v)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {experienceOpen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {experienceOpen
              ? content.experience.map((exp, index) => {
                  const parsedStartDate = parseStoredDate(exp.startDate);
                  const parsedEndDate = parseStoredDate(exp.endDate);

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <p className="text-sm font-semibold text-slate-700">
                          Experience #{index + 1}
                        </p>
                        <div className="w-full sm:w-auto">
                          <div className="flex flex-col gap-3 sm:items-end">
                            <AIRewriteControls
                              section="bullet"
                              resumeId={resume.id}
                              getText={() => exp.bullets.join("\n")}
                              onApply={(value) =>
                                updateExperience(index, {
                                  bullets: value.split("\n").filter(Boolean),
                                })
                              }
                              onQuotaUpdate={setQuota}
                            />
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="self-start rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 sm:self-end"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="rounded-xl border border-slate-300 px-4 py-2.5"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(index, { company: e.target.value })
                          }
                        />
                        <input
                          className="rounded-xl border border-slate-300 px-4 py-2.5"
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) =>
                            updateExperience(index, { role: e.target.value })
                          }
                        />
                        <input
                          className="rounded-xl border border-slate-300 px-4 py-2.5"
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) =>
                            updateExperience(index, { location: e.target.value })
                          }
                        />

                        <div className="rounded-xl border border-slate-300 px-4 py-2.5">
                          <p className="mb-2 text-xs font-medium text-slate-500">
                            Start date
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              value={parsedStartDate.month}
                              onChange={(e) =>
                                updateExperience(index, {
                                  startDate: updateDateValue(exp.startDate, {
                                    month: e.target.value,
                                  }),
                                })
                              }
                            >
                              {MONTH_OPTIONS.map((month) => (
                                <option key={month || "none"} value={month}>
                                  {month || "Month"}
                                </option>
                              ))}
                            </select>

                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              value={parsedStartDate.year}
                              onChange={(e) =>
                                updateExperience(index, {
                                  startDate: updateDateValue(exp.startDate, {
                                    year: e.target.value,
                                  }),
                                })
                              }
                            >
                              <option value="">Year</option>
                              {YEAR_OPTIONS.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-300 px-4 py-2.5 md:col-span-2">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-xs font-medium text-slate-500">
                              End date
                            </p>
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                              <input
                                type="checkbox"
                                checked={parsedEndDate.present}
                                onChange={(e) =>
                                  updateExperience(index, {
                                    endDate: updateDateValue(
                                      exp.endDate,
                                      { present: e.target.checked },
                                      true
                                    ),
                                  })
                                }
                              />
                              Present
                            </label>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                              value={parsedEndDate.month}
                              disabled={parsedEndDate.present}
                              onChange={(e) =>
                                updateExperience(index, {
                                  endDate: updateDateValue(
                                    exp.endDate,
                                    { month: e.target.value },
                                    true
                                  ),
                                })
                              }
                            >
                              {MONTH_OPTIONS.map((month) => (
                                <option key={month || "none"} value={month}>
                                  {month || "Month"}
                                </option>
                              ))}
                            </select>

                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                              value={parsedEndDate.year}
                              disabled={parsedEndDate.present}
                              onChange={(e) =>
                                updateExperience(index, {
                                  endDate: updateDateValue(
                                    exp.endDate,
                                    { year: e.target.value },
                                    true
                                  ),
                                })
                              }
                            >
                              <option value="">Year</option>
                              {YEAR_OPTIONS.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <textarea
                        className="mt-3 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3"
                        value={exp.bullets.join("\n")}
                        onChange={(e) =>
                          updateExperience(index, {
                            bullets: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        placeholder="One bullet per line"
                      />
                    </div>
                  );
                })
              : null}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Education
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Add Education
                </button>
                <button
                  type="button"
                  onClick={() => setEducationOpen((v) => !v)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {educationOpen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {educationOpen
              ? content.education.map((edu, index) => {
                  const parsedStartDate = parseStoredDate(edu.startDate);
                  const parsedEndDate = parseStoredDate(edu.endDate);

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-700">
                          Education #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className="rounded-xl border border-slate-300 px-4 py-2.5"
                          placeholder="School"
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(index, { school: e.target.value })
                          }
                        />
                        <input
                          className="rounded-xl border border-slate-300 px-4 py-2.5"
                          placeholder="Program"
                          value={edu.program}
                          onChange={(e) =>
                            updateEducation(index, { program: e.target.value })
                          }
                        />

                        <div className="rounded-xl border border-slate-300 px-4 py-2.5">
                          <p className="mb-2 text-xs font-medium text-slate-500">
                            Start date
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              value={parsedStartDate.month}
                              onChange={(e) =>
                                updateEducation(index, {
                                  startDate: updateDateValue(edu.startDate, {
                                    month: e.target.value,
                                  }),
                                })
                              }
                            >
                              {MONTH_OPTIONS.map((month) => (
                                <option key={month || "none"} value={month}>
                                  {month || "Month"}
                                </option>
                              ))}
                            </select>

                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              value={parsedStartDate.year}
                              onChange={(e) =>
                                updateEducation(index, {
                                  startDate: updateDateValue(edu.startDate, {
                                    year: e.target.value,
                                  }),
                                })
                              }
                            >
                              <option value="">Year</option>
                              {YEAR_OPTIONS.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-300 px-4 py-2.5">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-xs font-medium text-slate-500">
                              End date
                            </p>
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                              <input
                                type="checkbox"
                                checked={parsedEndDate.present}
                                onChange={(e) =>
                                  updateEducation(index, {
                                    endDate: updateDateValue(
                                      edu.endDate,
                                      { present: e.target.checked },
                                      true
                                    ),
                                  })
                                }
                              />
                              Present
                            </label>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                              value={parsedEndDate.month}
                              disabled={parsedEndDate.present}
                              onChange={(e) =>
                                updateEducation(index, {
                                  endDate: updateDateValue(
                                    edu.endDate,
                                    { month: e.target.value },
                                    true
                                  ),
                                })
                              }
                            >
                              {MONTH_OPTIONS.map((month) => (
                                <option key={month || "none"} value={month}>
                                  {month || "Month"}
                                </option>
                              ))}
                            </select>

                            <select
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                              value={parsedEndDate.year}
                              disabled={parsedEndDate.present}
                              onChange={(e) =>
                                updateEducation(index, {
                                  endDate: updateDateValue(
                                    edu.endDate,
                                    { year: e.target.value },
                                    true
                                  ),
                                })
                              }
                            >
                              <option value="">Year</option>
                              {YEAR_OPTIONS.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <textarea
                        className="mt-3 min-h-20 w-full rounded-xl border border-slate-300 px-4 py-3"
                        value={edu.details}
                        onChange={(e) =>
                          updateEducation(index, { details: e.target.value })
                        }
                        placeholder="Extra details"
                      />
                    </div>
                  );
                })
              : null}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Languages
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addLanguage}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Add Language
                </button>
                <button
                  type="button"
                  onClick={() => setLanguagesOpen((v) => !v)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {languagesOpen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {languagesOpen
              ? content.languages.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">
                        Language #{index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        className="rounded-xl border border-slate-300 px-4 py-2.5"
                        placeholder="Language"
                        value={item.name}
                        onChange={(e) =>
                          updateLanguage(index, { name: e.target.value })
                        }
                      />
                      <select
                        className="rounded-xl border border-slate-300 px-4 py-2.5"
                        value={item.level}
                        onChange={(e) =>
                          updateLanguage(index, { level: e.target.value })
                        }
                      >
                        {LANGUAGE_LEVELS.map((level) => (
                          <option key={level || "none"} value={level}>
                            {level || "Level"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              : null}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Certifications
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addCertification}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Add Certification
                </button>
                <button
                  type="button"
                  onClick={() => setCertificationsOpen((v) => !v)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {certificationsOpen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {certificationsOpen
              ? content.certifications.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">
                        Certification #{index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        className="rounded-xl border border-slate-300 px-4 py-2.5 md:col-span-2"
                        placeholder="Certification or Qualification"
                        value={item.name}
                        onChange={(e) =>
                          updateCertification(index, { name: e.target.value })
                        }
                      />
                      <select
                        className="rounded-xl border border-slate-300 px-4 py-2.5"
                        value={item.year}
                        onChange={(e) =>
                          updateCertification(index, { year: e.target.value })
                        }
                      >
                        <option value="">Year</option>
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2.5"
                      placeholder="Issuing organization"
                      value={item.issuer}
                      onChange={(e) =>
                        updateCertification(index, { issuer: e.target.value })
                      }
                    />
                  </div>
                ))
              : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Skills
            </h2>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
              value={skillsInput}
              onChange={(e) => {
                const value = e.target.value;
                setSkillsInput(value);

                setContent({
                  ...content,
                  skills: value
                    .split(/[,.嚗n]/)
                    .map((item) => item.trim())
                    .filter(Boolean),
                });
              }}
              placeholder="Excel, Customer Service, Inventory Control"
            />
          </section>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <ResumePreview
          title={title}
          templateId={templateId}
          content={content}
        />
      </div>
    </div>
  );
}
