"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { signUpAction } from "../_action/singup-action";

type SignUpFormProps = {
  name: string;
  email: string;
  password: string;
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState<string[] | undefined>([]);

  const data: SignUpFormProps = {
    name: "",
    email: "",
    password: "",
  };

  const handleRegister = async (formData: FormData) => {
    data.email = formData.get("email") as string;
    data.password = formData.get("password") as string;
    data.name = formData.get("name") as string;

    console.log(data);

    const res = await signUpAction(data);

    if (!res.success) {
      setError(res.issues);
      toast.custom(() => (
        <div className="p-4 bg-red-500 text-white rounded-xl shadow-md">
          <strong className="block">ERROR</strong>
          {/* <span className="text-sm">{res.message}.</span> */}
          

        </div>
      ));
    }
    if (res.success) {
      toast.custom(() => (
        <div className="p-4 bg-green-500 text-white rounded-xl shadow-md">
          <strong className="block">Sucesso</strong>
          <span className="text-sm">Login realizado com sucesso.</span>
        </div>
      ));
      //   router.push("/dashboard");
      redirect("/signin");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={handleRegister}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              {/* <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div> */}
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Finwallet Bank</h1>
            <div className="text-center text-sm">
              Do you have an account?{" "}
              <a href="./../../signin" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="name"
                name="name"
                placeholder="m@example.com"
                required
                onChange={(e) => setName(e.target.value)}
              />
              {error!.includes("O nome requer pelo menos 4 caracteres") && (
                <p className="text-red-500">
                  O nome requer pelo menos 4 caracteres.
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              {error!.includes("Por favor, insira um email válido") && (
                <p className="text-red-500">
                  Por favor, insira um email válido.
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="****5**D**"
                required
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            {error!.includes("O password requer pelo menos 6 digitos") && (
              <p className="text-red-500">
                O password requer pelo menos 6 digitos.
              </p>
            )}
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
          
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
