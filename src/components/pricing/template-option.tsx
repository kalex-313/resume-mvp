type TemplateOptionProps = {
  name: string;
  isPro: boolean;
  userPlan: "free" | "pro";
};

export function TemplateOption({ name, isPro, userPlan }: TemplateOptionProps) {
  const locked = isPro && userPlan !== "pro";

  return (
    <button
      type="button"
      disabled={locked}
      className={`px-3 py-2 rounded-full border text-sm ${
        locked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
      }`}
    >
      {name} {locked ? "🔒" : ""}
    </button>
  );
}
