import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Keep your existing login form here */}
          <div className="rounded-xl border bg-white p-6 shadow">
            <h1 className="text-xl font-semibold mb-4">Log in</h1>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
