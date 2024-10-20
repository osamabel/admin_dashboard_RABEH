"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: Game[] = [
  {
    id: "m5gr84i9",
    coins: 316,
    status: "created",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game1",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    coins: 242,
    status: "ended",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game2",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    coins: 242,
    status: "started",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game3",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    coins: 242,
    status: "closed",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game4",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    coins: 242,
    status: "ended",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game5",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    coins: 242,
    status: "ended",
    licence: "yes",
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    name: "Game6",
    date: "05-10-2024",
  },
];

export type Game = {
  id: string;
  name: string;
  date: string;
  coins: number;
  sponsor: { name: string; logo: string }[];
  licence: string;
  status: "created" | "started" | "ended" | "closed";
};

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Game Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pl-[20px]">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pl-[20px]">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "coins",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Coins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pl-[30px]">{row.getValue("coins")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function EventTable() {
  const eventRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
        pageIndex: 0,
      },
    },
  });

  React.useEffect(() => {
    const updatePageSize = () => {
      if (eventRef.current) {
        const height = eventRef.current.getBoundingClientRect().height;
        const newPageSize = Math.max(1, Math.floor((height - 200) / 73));
        setPageSize(newPageSize);
      }
    };
    updatePageSize();
    // Add event listener for window resize
    window.addEventListener('resize', updatePageSize);
    // Cleanup
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

    // Update table's page size when pageSize state changes
    React.useEffect(() => {
      table.setPageSize(pageSize);
    }, [pageSize, table]);

  return (
    <div ref={eventRef} className="w-full h-full">

      <div className="flex items-center py-4">
        <Input
          placeholder="Search by Game name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-[6px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto rounded-[6px]">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
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
      </div>
      <div className="rounded-[6px] border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Button className="rounded-[6px]" variant="default">
            Create new Game
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            className="rounded-[6px]"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="rounded-[6px]"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
