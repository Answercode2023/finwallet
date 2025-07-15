// components/TransferDrawerStyled.tsx

"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { BarChart, Bar, ResponsiveContainer } from "recharts"

interface TransferDrawerStyledProps {
  children: React.ReactNode
  item: {
    id: string
    nome_usuario_origem: string
    nome_quem_recebeu: string
    valor_transferido: number
    data_transferencia: string
  }
}

export function TransferDrawerStyled({ children, item }: TransferDrawerStyledProps) {
  const [goal, setGoal] = useState(item.valor_transferido)

  const data = [{ goal }]

  const onClick = (delta: number) => {
    setGoal((prev) => Math.max(200, Math.min(400, prev + delta)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Transferência de {item.nome_usuario_origem}</DrawerTitle>
            <DrawerDescription>
              {item.nome_quem_recebeu} retornar seus {" "}
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.valor_transferido)}
              </strong>{" "}
              em {new Date().toLocaleString("pt-BR")}.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Diminuir</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  Simulação: Pontuação de risco
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Aumentar</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button>Confirmar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
