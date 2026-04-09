import type { ResumeContent } from "@/types/resume";

type ResumePreviewProps = {
  title: string;
  templateId: string;
  content: ResumeContent;
};

function joinLocation(parts: Array<string | undefined>) {
  return parts.map((item) => String(item || "").trim()).filter(Boolean).join(" • ");
}

function accentClasses(templateId: string) {
  switch (templateId) {
    case "professional-blue":
      return {
        header: "border-blue-200 bg-blue-50",
        section: "border-blue-100",
        accent: "text-blue-700",
      };
    case "minimal-clean":
      return {
        header: "border-slate-200 bg-slate-50",
        section: "border-slate-200",
        accent: "text-slate-700",
      };
    case "ats-classic":
      return {
        header: "border-slate-200 bg-white",
        section: "border-slate-200",
        accent: "text-slate-900",
      };
    case "modern-pro":
      return {
        header: "border-violet-200 bg-violet-50",
        section: "border-violet-100",
        accent: "text-violet-700",
      };
    case "minimal-pro":
      return {
        header: "border-emerald-200 bg-emerald-50",
        section: "border-emerald-100",
        accent: "text-emerald-700",
      };
    case "tech-pro":
      return {
        header: "border-cyan-200 bg-cyan-50",
        section: "border-cyan-100",
        accent: "text-cyan-700",
      };
    default:
      return {
        header: "border-slate-200 bg-slate-50",
        section: "border-slate-200",
        accent: "text-slate-700",
      };
  }
}

function renderDateRange(startDate?: string, endDate?: string) {
  const start = String(startDate || "").trim();
  const end = String(endDate || "").trim();

  if (!start && !end) return "";
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

const textWrapClass =
  "whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

function Section({
  title,
  children,
  borderClass,
}: {
  title: string;
  children: React.ReactNode;
  borderClass: string;
}) {
  return (
    <section className={`rounded-2xl border ${borderClass} p-4`}>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-black">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ResumePreview({
  title,
  templateId,
  content,
}: ResumePreviewProps) {
  const theme = accentClasses(templateId);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Live Preview
      </div>

      <div
        id="resume-preview-export"
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className={`rounded-2xl border px-5 py-5 ${theme.header}`}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              {content.personal.fullName || title || "Untitled Resume"}
            </h1>

            <div className={`text-sm font-medium ${theme.accent} ${textWrapClass}`}>
              {joinLocation([
                content.personal.email,
                content.personal.phone,
                content.personal.location,
              ]) || "Add contact details"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {String(content.summary || "").trim() ? (
            <Section title="Summary" borderClass={theme.section}>
              <p className={`text-sm leading-7 text-slate-800 ${textWrapClass}`}>
                {content.summary}
              </p>
            </Section>
          ) : null}

          {(content.experience || []).some(
            (item) =>
              String(item.company || "").trim() ||
              String(item.role || "").trim() ||
              String(item.location || "").trim() ||
              (item.bullets || []).some((bullet) => String(bullet || "").trim())
          ) ? (
            <Section title="Experience" borderClass={theme.section}>
              <div className="space-y-5">
                {(content.experience || []).map((exp, index) => {
                  const bullets = (exp.bullets || []).filter((bullet) =>
                    String(bullet || "").trim()
                  );

                  if (
                    !String(exp.company || "").trim() &&
                    !String(exp.role || "").trim() &&
                    !String(exp.location || "").trim() &&
                    bullets.length === 0
                  ) {
                    return null;
                  }

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className={`text-base font-semibold text-black ${textWrapClass}`}>
                            {[exp.role, exp.company].filter(Boolean).join(" @ ")}
                          </p>
                          {String(exp.location || "").trim() ? (
                            <p className={`text-sm text-slate-600 ${textWrapClass}`}>
                              {exp.location}
                            </p>
                          ) : null}
                        </div>

                        {renderDateRange(exp.startDate, exp.endDate) ? (
                          <p className="shrink-0 text-sm font-medium text-slate-600">
                            {renderDateRange(exp.startDate, exp.endDate)}
                          </p>
                        ) : null}
                      </div>

                      {bullets.length > 0 ? (
                        <ul className="space-y-2 pl-5 text-sm leading-6 text-slate-800">
                          {bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className={textWrapClass}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {(content.education || []).some(
            (item) =>
              String(item.school || "").trim() ||
              String(item.program || "").trim() ||
              String(item.details || "").trim()
          ) ? (
            <Section title="Education" borderClass={theme.section}>
              <div className="space-y-5">
                {(content.education || []).map((edu, index) => {
                  if (
                    !String(edu.school || "").trim() &&
                    !String(edu.program || "").trim() &&
                    !String(edu.details || "").trim()
                  ) {
                    return null;
                  }

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className={`text-base font-semibold text-black ${textWrapClass}`}>
                            {[edu.program, edu.school].filter(Boolean).join(" — ")}
                          </p>
                        </div>

                        {renderDateRange(edu.startDate, edu.endDate) ? (
                          <p className="shrink-0 text-sm font-medium text-slate-600">
                            {renderDateRange(edu.startDate, edu.endDate)}
                          </p>
                        ) : null}
                      </div>

                      {String(edu.details || "").trim() ? (
                        <p className={`text-sm leading-6 text-slate-800 ${textWrapClass}`}>
                          {edu.details}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {(content.skills || []).length > 0 ? (
            <Section title="Skills" borderClass={theme.section}>
              <div className="flex flex-wrap gap-2">
                {(content.skills || [])
                  .filter((skill) => String(skill || "").trim())
                  .map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
