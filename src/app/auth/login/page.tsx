import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-16">
        <LoginForm />
      </main>
      <SiteFooter />
    </div>
  );
}
