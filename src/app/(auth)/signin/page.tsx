import { getUserSession } from "@/lib/session";
import { SignInForm } from "./_components/signin-form";
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
        <SignInForm />
      </div>
    </div>
  )
}
