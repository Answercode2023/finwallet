import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DataCardResponse = {
  current_balance: number;
  total_deposits: number;
  total_received: number;
  total_sent: number;
};

export function SectionCards({ data }: { data: DataCardResponse }) {
  const current_balance = data.current_balance;
  const formattedBalance = current_balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const total_deposits = data.total_deposits;
  const formattedDeposits = total_deposits.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const total_received = data.total_received;
  const formattedReceived = total_received.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const total_sent = data.total_sent;
  const formattedSent = total_sent.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ">
            <h1
              className={
                current_balance > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {formattedBalance}
            </h1>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Este mês teve um crescimento positivo

            {/* <IconTrendingUp className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">
            Resumo dos últimos 6 meses de saldo
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total recebido</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            + {formattedReceived}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Recebimentos caíram neste período
            {/* Down 20% this period <IconTrendingDown className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">
            Atenção: entradas de valores estão em queda
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de depósitos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <h1>
              <span >
                {formattedDeposits}
              </span>
            </h1>

          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Strong user retention <IconTrendingUp className="size-4" /> */}
            Depósitos consistentes dos usuários
          </div>
          <div className="text-muted-foreground">Indicadores superaram as metas de engajamento</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total enviado</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <h1 className={
              current_balance > 0 ? "text-red-600" : "text-green-600"
            }>
              <span >
                {formattedSent}
              </span>
            </h1>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Steady performance increase <IconTrendingUp className="size-4" /> */}
            Aumento constante nos envios de valores
          </div>
          <div className="text-muted-foreground">Projeções de crescimento foram atingidas</div>
        </CardFooter>
      </Card>
    </div>
  );
}
