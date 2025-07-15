import { cookies } from "next/headers";

export async function getSessionToken() {
  return (await cookies()).get("token")?.value;
}
