"use client";

const templates = [
  { id: "professional-blue", name: "Professional Blue" },
  { id: "minimal-clean", name: "Minimal Clean" },
  { id: "ats-classic", name: "ATS Classic" },
  { id: "modern-pro", name: "Modern Pro" },
  { id: "minimal-pro", name: "Minimal Pro" },
  { id: "tech-pro", name: "Tech Pro" }
];

export function TemplateSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((template) => {
        const active = value === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={[
              "rounded-full border px-3 py-2 text-xs font-medium transition",
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            ].join(" ")}
          >
            {template.name}
          </button>
        );
      })}
    </div>
  );
}
