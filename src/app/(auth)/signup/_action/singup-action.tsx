"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(4, "O nome requer pelo menos 4 caracteres"),
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "O password requer pelo menos 6 digitos"),
});

type signUpFormData = z.infer<typeof signUpSchema>;

export async function signUpAction(params: signUpFormData) {
  const schema = signUpSchema.safeParse(params);

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
    

    const LowerCaseEmail = params.email.toLowerCase();

    const res = await axios.post("http://localhost:8080/api/register", {
      name: params.name,
      email: LowerCaseEmail,
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

    return { success: true, user: res.data.user, issues: [] };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Credenciais inválidas." };
  }
}
