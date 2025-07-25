import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { getUserSession } from "@/lib/session"
import { getDataTableAction } from "./action/getDataTable-action"
import { getDataCardAction } from "./action/getDataCard-action"

export default async function Page() {

  const user = await getUserSession();

  console.log("User session data:", user);
  const dataBase = await getDataTableAction();

  const dataBaseCard = await getDataCardAction();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={dataBaseCard} />
              <div className="px-4 lg:px-6">
                {/* <ChartAreaInteractive /> */}
              </div>
              <DataTable data={dataBase.transactions} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
