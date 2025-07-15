"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "O password requer pelo menos 6 digitos"),
});

type loginFormData = z.infer<typeof loginSchema>;

export async function loginAction(params: loginFormData) {
  const schema = loginSchema.safeParse(params);

  if (!schema.success) {
    const errors = schema.error.issues.map((issue) => issue.message);

    console.log("Dados do errors:", errors);

    return {
      success: false,
      issues: errors,
      data: null,
      field: schema.error.issues[0].path || null,
    };
  }

  try {
    const res = await axios.post("http://localhost:8080/api/login", {
      email: params.email,
      password: params.password,
    });

    (await cookies()).set("token", res.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    if (!res.data.user) {
      return { success: false, message: "Usuário não encontrado." };
    }
    console.log("Dados do res:", res.data.user);

    return { success: true, user: res.data.user, issues: [] };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Credenciais inválidas." };
  }
}
