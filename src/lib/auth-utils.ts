
"use server";


import axios from "axios";
import { cookies } from "next/headers";


// export async function loginAction(email: string, password: string) {
//   try {
//     console.log(email, password);
//     console.log(axios);
    
//     const res = await axios.post("http://localhost:8080/api/login", { email, password });

//     (await cookies()).set("token", res.data.token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: true,
//     });

//     if (!res.data.user) {
//       return { success: false, message: "Usuário não encontrado." };
//     }

//     return { success: true, user: res.data.user };
//   } catch (err) {
//     console.log(err);
//     return { success: false, message: "Credenciais inválidas." };
//   }
// }

// export async function registerAction(name: string, email: string, password: string) {
//     const LowerCaseEmail = email.toLowerCase();
//   try {
//     const res = await axios.post("http://localhost:8080/api/register", { name, LowerCaseEmail, password });

//     (await cookies()).set("token", res.data.token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: true,
//     });

//     return { success: true, user: res.data.user };
//   } catch (err) {
//     console.log(err);
//     return { success: false, message: "Erro ao registrar. Verifique os dados." };
//   }
// }

export async function logoutAction() {
  try {
    const token = (await cookies()).get("token")?.value;
    await axios.post("/logout", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    (await cookies()).delete("token");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
