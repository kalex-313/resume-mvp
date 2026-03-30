import type { ResumeContent } from "@/types/resume";

type Props = {
  title: string;
  templateId: string;
  content: ResumeContent;
};

function SectionExperience({ content, variant }: { content: ResumeContent; variant: string }) {
  const wrapperClass =
    variant === "tech"
      ? "rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-5"
      : variant === "modern"
      ? "mb-8"
      : variant === "ats"
      ? "mb-5"
      : "mb-6";

  const headingClass =
    variant === "blue"
      ? "mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
      : variant === "minimal"
      ? "mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"
      : variant === "ats"
      ? "mb-2 text-sm font-bold uppercase"
      : variant === "modern"
      ? "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600"
      : variant === "minimal-pro"
      ? "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
      : "mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300";

  const itemTextClass = variant === "tech" ? "text-sm text-slate-300" : "text-sm text-slate-600";
  const bulletClass =
    variant === "ats"
      ? "mt-2 list-disc space-y-1 pl-5 text-sm leading-6"
      : variant === "tech"
      ? "mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-200"
      : "mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700";

  return (
    <section className={wrapperClass}>
      <h3 className={headingClass}>{variant === "ats" ? "Professional Experience" : "Experience"}</h3>
      <div className="space-y-4">
        {content.experience.length > 0 ? (
          content.experience.map((exp, index) => (
            <div key={index}>
              <div className={variant === "minimal" || variant === "minimal-pro" ? "mb-2 flex items-start justify-between gap-6" : ""}>
                <div>
                  <p className={variant === "ats" ? "font-bold" : "font-semibold"}>{exp.role || "Role"}</p>
                  <p className={itemTextClass}>
                    {exp.company || "Company"}
                    {exp.location ? (variant === "ats" ? `, ${exp.location}` : ` · ${exp.location}`) : ""}
                  </p>
                </div>
                {(variant === "minimal" || variant === "minimal-pro") ? (
                  <p className="text-xs text-slate-500">{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</p>
                ) : null}
              </div>
              <ul className={bulletClass}>
                {exp.bullets.filter(Boolean).length > 0 ? (
                  exp.bullets.filter(Boolean).map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)
                ) : (
                  <li>Your experience bullets will appear here.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className={variant === "tech" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>Your experience will appear here.</p>
        )}
      </div>
    </section>
  );
}

function SectionEducation({ content, variant }: { content: ResumeContent; variant: string }) {
  const wrapperClass =
    variant === "tech"
      ? "rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-5"
      : variant === "modern"
      ? "mb-0"
      : variant === "ats"
      ? "mb-5"
      : "mb-6";

  const headingClass =
    variant === "blue"
      ? "mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
      : variant === "minimal"
      ? "mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"
      : variant === "ats"
      ? "mb-2 text-sm font-bold uppercase"
      : variant === "modern"
      ? "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600"
      : variant === "minimal-pro"
      ? "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
      : "mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300";

  const textClass = variant === "tech" ? "text-sm text-slate-300" : "text-sm text-slate-600";
  const detailClass = variant === "tech" ? "mt-2 text-sm leading-6 text-slate-200" : "mt-2 text-sm leading-6 text-slate-700";

  return (
    <section className={wrapperClass}>
      <h3 className={headingClass}>Education</h3>
      <div className="space-y-4">
        {content.education.length > 0 ? (
          content.education.map((edu, index) => (
            <div key={index}>
              <p className={variant === "ats" ? "font-bold" : "font-semibold"}>{edu.program || "Program"}</p>
              <p className={textClass}>{edu.school || "School"}</p>
              {edu.details ? <p className={detailClass}>{edu.details}</p> : null}
            </div>
          ))
        ) : (
          <p className={variant === "tech" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>Your education will appear here.</p>
        )}
      </div>
    </section>
  );
}

function SectionSkills({ content, mode }: { content: ResumeContent; mode: string }) {
  if (mode === "chips") {
    return (
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {content.skills.length > 0 ? content.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{skill}</span>) : <span className="text-sm text-slate-500">Your skills will appear here.</span>}
        </div>
      </section>
    );
  }

  if (mode === "chips-outline") {
    return (
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {content.skills.length > 0 ? content.skills.map((skill) => <span key={skill} className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700">{skill}</span>) : <span className="text-sm text-slate-500">Your skills will appear here.</span>}
        </div>
      </section>
    );
  }

  if (mode === "inline-dots") {
    return (
      <section>
        <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Skills</h3>
        <p className="text-sm leading-6 text-slate-700">{content.skills.length > 0 ? content.skills.join(" • ") : "Your skills will appear here."}</p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-bold uppercase">Skills</h3>
      <p className="text-sm leading-6">{content.skills.length > 0 ? content.skills.join(", ") : "Your skills will appear here."}</p>
    </section>
  );
}

function ProfessionalBlue({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-white p-8 text-slate-900">
      <div className="mb-6 border-b-4 border-blue-600 pb-5">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-blue-600">{title || "Resume Preview"}</p>
        <h2 className="text-3xl font-bold">{content.personal.fullName || "Your Name"}</h2>
        <p className="mt-2 text-sm text-slate-600">{[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(" • ")}</p>
      </div>
      <section className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</h3>
        <p className="text-sm leading-6 text-slate-700">{content.summary || "Your professional summary will appear here."}</p>
      </section>
      <SectionExperience content={content} variant="blue" />
      <SectionEducation content={content} variant="blue" />
      <SectionSkills content={content} mode="chips" />
    </div>
  );
}

function MinimalClean({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-white p-10 text-slate-900">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold">{content.personal.fullName || "Your Name"}</h2>
        <p className="mt-2 text-sm text-slate-600">{[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(" • ")}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{title || "Resume"}</p>
      </div>
      <section className="mb-6">
        <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Summary</h3>
        <p className="text-sm leading-6 text-slate-700">{content.summary || "Your professional summary will appear here."}</p>
      </section>
      <SectionExperience content={content} variant="minimal" />
      <SectionEducation content={content} variant="minimal" />
      <SectionSkills content={content} mode="inline-dots" />
    </div>
  );
}

function ATSClassic({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-white p-8 font-serif text-slate-900">
      <div className="mb-5 border-b border-slate-900 pb-3">
        <h2 className="text-2xl font-bold uppercase tracking-wide">{content.personal.fullName || "Your Name"}</h2>
        <p className="mt-1 text-xs">{[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(" | ")}</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">{title || "Resume"}</p>
      </div>
      <section className="mb-5">
        <h3 className="mb-2 text-sm font-bold uppercase">Professional Summary</h3>
        <p className="text-sm leading-6">{content.summary || "Your professional summary will appear here."}</p>
      </section>
      <SectionExperience content={content} variant="ats" />
      <SectionEducation content={content} variant="ats" />
      <SectionSkills content={content} mode="inline-commas" />
    </div>
  );
}

function ModernPro({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-white text-slate-900">
      <div className="grid min-h-[960px] grid-cols-[220px_1fr]">
        <div className="bg-slate-900 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{title || "Resume"}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight">{content.personal.fullName || "Your Name"}</h2>
          <div className="mt-6 space-y-2 text-sm text-slate-200">
            <p>{content.personal.email || "email@example.com"}</p>
            <p>{content.personal.phone || "Phone number"}</p>
            <p>{content.personal.location || "Location"}</p>
          </div>
          <div className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Skills</h3>
            <div className="space-y-2">
              {content.skills.length > 0 ? content.skills.map((skill) => (
                <div key={skill} className="rounded-lg bg-slate-800 px-3 py-2 text-sm">{skill}</div>
              )) : <p className="text-sm text-slate-300">Your skills will appear here.</p>}
            </div>
          </div>
        </div>
        <div className="p-8">
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Profile</h3>
            <p className="text-sm leading-7 text-slate-700">{content.summary || "Your professional summary will appear here."}</p>
          </section>
          <SectionExperience content={content} variant="modern" />
          <SectionEducation content={content} variant="modern" />
        </div>
      </div>
    </div>
  );
}

function MinimalPro({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-white p-12 text-slate-900">
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-light tracking-tight">{content.personal.fullName || "Your Name"}</h2>
          <p className="mt-3 text-sm text-slate-600">{content.summary || "Your professional summary will appear here."}</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p>{content.personal.email || "email@example.com"}</p>
          <p>{content.personal.phone || "Phone number"}</p>
          <p>{content.personal.location || "Location"}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{title || "Resume"}</p>
        </div>
      </div>
      <SectionExperience content={content} variant="minimal-pro" />
      <SectionEducation content={content} variant="minimal-pro" />
      <SectionSkills content={content} mode="chips-outline" />
    </div>
  );
}

function TechPro({ title, content }: Props) {
  return (
    <div id="resume-preview-export" className="bg-[#0b1220] p-8 text-slate-100">
      <div className="mb-8 rounded-2xl border border-cyan-400/30 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{title || "Resume"}</p>
        <h2 className="mt-3 text-3xl font-bold text-white">{content.personal.fullName || "Your Name"}</h2>
        <p className="mt-3 text-sm text-slate-300">{[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(" • ")}</p>
      </div>
      <section className="mb-6 rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Summary</h3>
        <p className="text-sm leading-7 text-slate-200">{content.summary || "Your professional summary will appear here."}</p>
      </section>
      <SectionExperience content={content} variant="tech" />
      <SectionEducation content={content} variant="tech" />
      <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/50 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {content.skills.length > 0 ? content.skills.map((skill) => <span key={skill} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{skill}</span>) : <span className="text-sm text-slate-400">Your skills will appear here.</span>}
        </div>
      </section>
    </div>
  );
}

export function ResumePreview({ title, templateId, content }: Props) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {templateId === "minimal-clean" ? (
        <MinimalClean title={title} templateId={templateId} content={content} />
      ) : templateId === "ats-classic" ? (
        <ATSClassic title={title} templateId={templateId} content={content} />
      ) : templateId === "modern-pro" ? (
        <ModernPro title={title} templateId={templateId} content={content} />
      ) : templateId === "minimal-pro" ? (
        <MinimalPro title={title} templateId={templateId} content={content} />
      ) : templateId === "tech-pro" ? (
        <TechPro title={title} templateId={templateId} content={content} />
      ) : (
        <ProfessionalBlue title={title} templateId={templateId} content={content} />
      )}
    </aside>
  );
}
