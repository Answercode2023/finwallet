
"use server";


import axios from "axios";
import { cookies } from "next/headers";


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
