type TemplateSelectorProps = {
  value: string;
  onChange: (templateId: string) => void;
  plan?: "free" | "pro";
};

const TEMPLATE_OPTIONS = [
  { id: "professional-blue", label: "Professional Blue", premium: false },
  { id: "minimal-clean", label: "Minimal Clean", premium: false },
  { id: "ats-classic", label: "ATS Classic", premium: false },
  { id: "modern-pro", label: "Modern Pro", premium: true },
  { id: "minimal-pro", label: "Minimal Pro", premium: true },
  { id: "tech-pro", label: "Tech Pro", premium: true },
];

export function TemplateSelector({
  value,
  onChange,
  plan = "pro",
}: TemplateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {TEMPLATE_OPTIONS.map((template) => {
        const selected = value === template.id;
        const locked = template.premium && plan !== "pro";

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
              selected
                ? "border-brand-600 bg-brand-600 text-white"
                : locked
                ? "border-slate-300 bg-slate-50 text-slate-400"
                : "border-slate-300 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50",
            ].join(" ")}
            aria-pressed={selected}
          >
            <span>{template.label}</span>
            {locked ? (
              <span className="text-xs font-medium">🔒 Pro</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
