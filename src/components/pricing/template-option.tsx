export function TemplateOption({ name, isPro, userPlan }) {
  const locked = isPro && userPlan !== "pro";

  return (
    <button
      disabled={locked}
      className={`px-3 py-2 rounded-full border text-sm ${
        locked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
      }`}
    >
      {name} {locked && "🔒"}
    </button>
  );
}
