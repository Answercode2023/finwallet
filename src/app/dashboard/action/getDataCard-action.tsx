'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { getUserSession } from "@/lib/session";


// type DataTableResponse = {
//   user: {
//     id: string
//     name: string
//     email: string
//     avatar: string
//   }
// }



export async function getDataCardAction( ) {
  const token = (await cookies()).get("token")?.value;

   const data = await getUserSession();


  if (!data ) {
    console.error("Dados de usuário não informados ou incompletos:", data);
    return null;
  }



  if (!token) return null;

  try {
    const res = await axios.get("http://localhost:8080/api/users/" + data.id +"/statement", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("getDataCardAction:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error fetching data table:", error);
    return null;
  }
}