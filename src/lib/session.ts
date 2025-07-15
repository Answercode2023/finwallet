import { cookies } from "next/headers";
import axios from "./axios";

export async function getUserSession() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const res = await axios.get("http://localhost:8080/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    

    return res.data;
  } catch (error) {
    return null;
  }
}
