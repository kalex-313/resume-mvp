import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricing</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Free</h2>
          <p className="text-3xl font-bold mb-4">$0</p>
          <p className="mb-4 text-sm text-slate-600">
            Basic resume builder with limited AI rewrites.
          </p>
        </div>

        <div className="border rounded-xl p-6 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">Pro</h2>
          <p className="text-3xl font-bold mb-4">$9<span className="text-base">/mo</span></p>
          <p className="mb-4 text-sm text-slate-600">
            Get hired faster with stronger resumes.
          </p>

          <Link
            href="/upgrade"
            className="inline-block w-full text-center rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
