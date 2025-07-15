import { getUserSession } from "@/lib/session";
import { SignUpForm } from "./_components/signup-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserSession();
  if (user) {
    // If the user is already logged in, redirect to the dashboard
    redirect("/dashboard");
  }
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
