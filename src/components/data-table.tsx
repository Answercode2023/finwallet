"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled, // Note: Este ícone pode não ser ideal para "receive", "transfer", "reversal", "deposit"
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader, // Note: Este ícone pode não ser ideal para "receive", "transfer", "reversal", "deposit"
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  TransferDrawerStyled } from "@/app/dashboard/_components/TransferDrawer";

// === ALTERAÇÃO AQUI: Novo Schema para suas transações ===
export const schema = z.object({
  id: z.string(), // ID agora é uma string (UUID)
  nome_usuario_origem: z.string(),
  valor_transferido: z.number(),
  tipo_transferencia: z.string(),
  nome_quem_recebeu: z.string(),
  data_transferencia: z.string(), // Mantido como string, pode ser formatado no cell
});

const typeColors: { [key: string]: string } = {
  receive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", // Exemplo de classe Tailwind para receber
  transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", // Exemplo para transferir
  reversal: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", // Exemplo para estorno
  deposit:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", // Exemplo para depósito
  // Adicione outros tipos se houver
};

// Create a separate component for the drag handle
// === ALTERAÇÃO AQUI: DragHandle para aceitar UniqueIdentifier ===
function DragHandle({ id }: { id: UniqueIdentifier }) {
  // Agora aceita UniqueIdentifier
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// === ALTERAÇÃO AQUI: Novas colunas para os seus dados de transação ===
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center ml-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome_usuario_origem",
    header: "Origem",
    cell: ({ row }) => {
      return <div>{row.original.nome_usuario_origem}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "valor_transferido",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      // Formata o valor para moeda brasileira
      const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor_transferido);
      return <div className="text-right">{formattedValue}</div>;
    },
  },
  {
    accessorKey: "tipo_transferencia",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.tipo_transferencia;
      const colorClass =
        typeColors[type] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"; // Cor padrão se não encontrar
      return (
        <Badge variant="outline" className={`px-1.5 ${colorClass}`}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "nome_quem_recebeu",
    header: "Destinatário",
    cell: ({ row }) => {
      return <div>{row.original.nome_quem_recebeu}</div>;
    },
  },
  {
    accessorKey: "data_transferencia",
    header: "Data da Transação",
    cell: ({ row }) => {
      // Formata a data para um formato mais legível
      const date = new Date(row.original.data_transferencia);
      return <div>{date.toLocaleString("pt-BR")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tipo = row.original.tipo_transferencia;

      if (tipo === "transfer") {
        return (
          <TransferDrawerStyled item={row.original}>
            <Button variant="outline" size="sm">
              Reversal
            </Button>
          </TransferDrawerStyled>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() =>
                toast.info(`Visualizar detalhes de: ${row.original.id}`)
              }
            >
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  //   {
  //     id: "actions",
  //     cell: ({ row }) => ( // Passa a row para o menu de ações, se precisar de dados específicos
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             variant="ghost"
  //             className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
  //             size="icon"
  //           >
  //             <IconDotsVertical />
  //             <span className="sr-only">Open menu</span>
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="w-32">
  //           <DropdownMenuItem onClick={() => toast.info(`Visualizar detalhes de: ${row.original.id}`)}>
  //             Visualizar
  //           </DropdownMenuItem>
  //           {/* Adicione outras ações específicas para transações aqui */}
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     ),
  //   },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id, // O id agora é string
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="transactions" // Alterado para um valor relevante para transações
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          Visualização
        </Label>
        <Select defaultValue="transactions">
          {" "}
          {/* Alterado */}
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Selecione uma visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transactions">Transações</SelectItem>{" "}
            {/* Alterado */}
            {/* Remova ou adicione outros SelectItem conforme necessário */}
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="transactions">Transações</TabsTrigger>{" "}
          {/* Alterado */}
          {/* Remova ou adicione outros TabsTrigger conforme necessário */}
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Personalizar Colunas</span>
                <span className="lg:hidden">Colunas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Adicionar Transação</span>{" "}
            {/* Alterado texto */}
          </Button>
        </div>
      </div>
      <TabsContent
        value="transactions" // Alterado
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para a primeira página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para a página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para a próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para a última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      {/* Removido TabsContent não utilizados para simplicidade */}
      {/* Se você precisar de outras abas, adapte o conteúdo para seus dados de transação */}
    </Tabs>
  );
}

// Removido o gráfico de exemplo, pois não parece ser relevante para os detalhes da transação
// Se você quiser um gráfico de histórico de transações, precisará adaptá-lo

// === ALTERAÇÃO AQUI: TableCellViewer precisa ser ajustado ou removido ===
// Eu comentei este componente pois ele foi projetado para o schema antigo (header, type, status, etc.)
// e não corresponde aos dados da transação. Se você precisar de um visualizador de detalhes da transação,
// você terá que reescrevê-lo completamente para exibir as informações de nome_usuario_origem, valor_transferido, etc.
/*
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header} // Este campo não existe mais no seu schema de transação
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle> // Este campo não existe mais
          <DrawerDescription>
            Mostrando detalhes da transação.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              // Gráfico ou informações adicionais específicas da transação
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="nome_usuario_origem">Usuário de Origem</Label>
              <Input id="nome_usuario_origem" defaultValue={item.nome_usuario_origem} />
            </div>
            // ... adicione outros campos da transação aqui
          </form>
        </div>
        // <DrawerFooter>
        //   <Button>Salvar</Button>
        //   <DrawerClose asChild>
        //     <Button variant="outline">Concluído</Button>
        //   </DrawerClose>
        // </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
*/
