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

interface ApiResponse {
  user_id: string;
  transactions: {
    id: string;
    nome_usuario_origem: string;
    valor_transferido: number;
    tipo_transferencia: string;
    nome_quem_recebeu: string;
    data_transferencia: string;
  }[];
}


export async function getDataTableAction( ) {
  const token = (await cookies()).get("token")?.value;

   const data = await getUserSession();


  if (!data ) {
    console.error("Dados de usuário não informados ou incompletos:", data);
    return null;
  }



  if (!token) return null;

  try {
    const res = await axios.get("http://localhost:8080/api/transactions/user/" + data.id, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Data table response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error fetching data table:", error);
    return null;
  }
}