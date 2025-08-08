import { IconTrendingDown, IconTrendingUp, IconWallet, IconArrowUp, IconArrowDown, IconCoin } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconWallet className="size-4" />
            Saldo Total
          </CardDescription>
          <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl">
            R$ 8.450,00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Saldo aumentou este mês <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total em todas as contas
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconArrowUp className="size-4" />
            Receitas
          </CardDescription>
          <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-green-600">
            R$ 12.350,00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Receitas aumentaram <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total de entradas este mês
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconArrowDown className="size-4" />
            Despesas
          </CardDescription>
          <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-red-600">
            R$ 3.900,00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -5.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Despesas reduzidas <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total de saídas este mês
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCoin className="size-4" />
            Economia
          </CardDescription>
          <CardTitle className="text-2xl tabular-nums @[250px]/card:text-3xl text-blue-600">
            R$ 8.450,00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Economia em alta <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total acumulado este ano
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
