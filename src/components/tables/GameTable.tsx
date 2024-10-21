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
import { SponsorsDialog } from "../dialog/Sponsors";
import { PrizeDialog } from "../dialog/Prizes";
import GameReportGeneration from "../dialog/Reports";
import GameCration from "../dialog/GameCreation";
import { Delete } from "../dialog/Delete";

const data: Game[] = [
  {
    id: "m5gr84i9",
    name: "Game1",
    prizes: ["p 1", "p2", "p3"],
    createAt: "05-10-2024",
    requiredDiamond: 316,
    status: "created",
    licence: "yes",
    winners: [{ id: "", name: "hel", avatar: "url" }],
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
      { name: "johnDoe", logo: "sp.png" },
    ],
    isRported: true,
  },
  {
    id: "n4gj29ke",
    name: "Game2",
    prizes: ["p 1", "p2", "p3"],
    createAt: "12-10-2024",
    requiredDiamond: 150,
    status: "created",
    licence: "no",
    winners: [{ id: "1", name: "alice", avatar: "url1" }, { id: "2", name: "john", avatar: "url2" }, { id: "3", name: "mark", avatar: "url3" }],
    sponsor: [
      { name: "sara98", logo: "sp.png" },
      { name: "gamma87", logo: "sp.png" },
      { name: "delta32", logo: "sp.png" },
    ],
    isRported: false,
  },
  {
    id: "k8tr37ip",
    name: "Game3",
    prizes: ["p 1", "p2", "p3"],
    createAt: "20-10-2024",
    requiredDiamond: 500,
    status: "created",
    licence: "yes",
    winners: [{ id: "1", name: "steve", avatar: "url1" }, { id: "2", name: "ellen", avatar: "url2" }, { id: "3", name: "mike", avatar: "url3" }],
    sponsor: [
      { name: "omega21", logo: "sp.png" },
      { name: "gamma87", logo: "sp.png" },
    ],
    isRported: true,
  },
  {
    id: "f9ku54hd",
    name: "Game4",
    prizes: ["p 1", "p2", "p3"],
    createAt: "01-11-2024",
    requiredDiamond: 425,
    status: "created",
    licence: "yes",
    winners: [{ id: "1", name: "lisa", avatar: "url1" }, { id: "2", name: "james", avatar: "url2" }, { id: "3", name: "pat", avatar: "url3" }],
    sponsor: [
      { name: "beta34", logo: "sp.png" },
      { name: "omega21", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    isRported: true,
  },
  {
    id: "a3xy47qm",
    name: "Game5",
    prizes: ["p 1", "p2", "p3"],
    createAt: "10-11-2024",
    requiredDiamond: 612,
    status: "created",
    licence: "no",
    winners: [{ id: "1", name: "nancy", avatar: "url1" }, { id: "2", name: "carla", avatar: "url2" }, { id: "3", name: "joel", avatar: "url3" }],
    sponsor: [
      { name: "gamma87", logo: "sp.png" },
      { name: "johnDoe", logo: "sp.png" },
      { name: "sara98", logo: "sp.png" },
    ],
    isRported: false,
  },
  {
    id: "b5lk23hf",
    name: "Game6",
    prizes: ["p 1", "p2", "p3"],
    createAt: "15-12-2024",
    requiredDiamond: 730,
    status: "created",
    licence: "yes",
    winners: [{ id: "1", name: "patrick", avatar: "url1" }, { id: "2", name: "marie", avatar: "url2" }, { id: "3", name: "jason", avatar: "url3" }],
    sponsor: [
      { name: "Abe45", logo: "sp.png" },
      { name: "gamma87", logo: "sp.png" },
    ],
    isRported: true,
  },
];

export type Game = {
  id: string;
  name: string;
  createAt: string;
  requiredDiamond: number;
  sponsor: { name: string; logo: string }[];
  licence: string;
  status: "created" | "started" | "ended" | "closed";
  winners: { id: string; name: string; avatar: string }[];
  prizes: string[];
  isRported?: boolean;
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
    accessorKey: "createAt",
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
      <div className="lowercase pl-[20px]">{row.getValue("createAt")}</div>
    ),
  },
  {
    accessorKey: "prize",
    header: "Prize",
    cell: () => {
      return <PrizeDialog />;
    },
  },
  {
    accessorKey: "requiredDiamond",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          required Diamond
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pl-[30px]">{row.getValue("requiredDiamond")}</div>
    ),
  },
  {
    accessorKey: "Sponsor",
    header: "Sponsors",
    cell: ({ row }) => {
      const sponsors = row.original.sponsor;

      return <SponsorsDialog sponsors={sponsors} />;
    },
  },

  {
    accessorKey: "licence",
    header: "Licence",
    cell: ({ row }) => (
      <div className="lowercase pl-[20px]">{row.getValue("licence")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex h-full items-center justify-center max-w-[80px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center 
                    ${status === "created" ? "text-[#626262] bg-[#F1F1F1]" : ""}
                    ${status === "started" ? "text-[#0FB71D] bg-[#D0FFCF]" : ""}
                    ${status === "closed" ? "text-[#FF3A3A] bg-[#FFE0E0]" : ""}
                    ${status === "ended" ? "text-[#F49301] bg-[#FFE4BB]" : ""}`}
          >
            {status}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const game = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(game.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Delete id={game.id} api={'/game/'}/>
            </DropdownMenuItem>
            {
              !game.isRported &&
              <DropdownMenuItem asChild>
                <GameReportGeneration game={game} />
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableDemo() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
      if (elementRef.current) {
        const height = elementRef.current.getBoundingClientRect().height;
        const newPageSize = Math.max(1, Math.floor((height - 200) / 73));
        setPageSize(newPageSize);
        console.log("New page size:", newPageSize);
      }
    };
    updatePageSize();
    // Add event listener for window resize
    window.addEventListener("resize", updatePageSize);
    // Cleanup
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  // Update table's page size when pageSize state changes
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div ref={elementRef} className="w-full h-full">
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
          <GameCration />
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
