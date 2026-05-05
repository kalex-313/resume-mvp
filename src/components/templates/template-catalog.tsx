import { UseTemplateButton } from "./use-template-button";

export type TemplateCatalogItem = {
  id: string;
  name: string;
  desc: string;
  tag: string;
  accentClass: string;
  premium?: boolean;
};

export const templateCatalog: TemplateCatalogItem[] = [
  {
    id: "professional-blue",
    name: "Professional Blue",
    desc: "Modern blue accent with strong professional hierarchy.",
    tag: "Business",
    accentClass: "bg-gradient-to-br from-blue-50 to-slate-100 border-b-4 border-blue-600"
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    desc: "Centered, simple, and elegant layout with clean spacing.",
    tag: "Clean",
    accentClass: "bg-gradient-to-br from-slate-50 to-white border border-slate-200"
  },
  {
    id: "ats-classic",
    name: "ATS Classic",
    desc: "Traditional text-first layout for ATS-friendly exports.",
    tag: "ATS",
    accentClass: "bg-white border-2 border-slate-800"
  },
  {
    id: "modern-pro",
    name: "Modern Pro",
    desc: "Premium two-column layout with bold sidebar and stronger personal branding.",
    tag: "Premium",
    accentClass: "bg-gradient-to-br from-slate-900 to-slate-700",
    premium: true
  },
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    desc: "Luxury minimal layout with spacious typography and polished sections.",
    tag: "Premium",
    accentClass: "bg-gradient-to-br from-white to-slate-100 border border-slate-200",
    premium: true
  },
  {
    id: "tech-pro",
    name: "Tech Pro",
    desc: "Dark modern style for developers, product, and startup roles.",
    tag: "Tech",
    accentClass: "bg-gradient-to-br from-cyan-950 to-slate-950",
    premium: true
  }
];

function MiniPreview({ item }: { item: TemplateCatalogItem }) {
  return (
    <div className={["relative mb-4 h-48 overflow-hidden rounded-2xl", item.accentClass].join(" ")}>
      <div className="absolute inset-0 p-4">
        <div className="h-full rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-slate-300/80" />
            <div className="h-2 w-12 rounded bg-slate-200/90" />
          </div>
          <div className="mb-4 h-2 w-40 rounded bg-slate-200/90" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-slate-200/90" />
            <div className="h-2 w-[88%] rounded bg-slate-200/90" />
            <div className="h-2 w-[92%] rounded bg-slate-200/90" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="h-2 w-16 rounded bg-slate-300/80" />
              <div className="h-2 w-full rounded bg-slate-200/90" />
              <div className="h-2 w-[80%] rounded bg-slate-200/90" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-16 rounded bg-slate-300/80" />
              <div className="h-2 w-full rounded bg-slate-200/90" />
              <div className="h-2 w-[78%] rounded bg-slate-200/90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateCatalogGrid({
  isLoggedIn = false,
  userPlan = "free",
}: {
  isLoggedIn?: boolean;
  userPlan?: "free" | "pro";
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templateCatalog.map((item) => (
        <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <MiniPreview item={item} />
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              {item.tag}
            </span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{item.desc}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {item.premium ? "Best for paid users" : "Included in base library"}
            </span>
            <UseTemplateButton
              templateId={item.id}
              isLoggedIn={isLoggedIn}
              locked={!!item.premium && userPlan !== "pro"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
