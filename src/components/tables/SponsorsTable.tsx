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
import SponsorCreation from "../dialog/SponsorCreation";
import { Delete } from "../dialog/Delete";
import SponsorUpdate from "../dialog/UpdateSponsor";

const data: User[] = [
  {
    id: "m5gr84i9",
    manyTime: 316,
    status: "inactive",
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
    name: "Username1",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    manyTime: 242,
    status: "??",
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
    name: "Username2",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    manyTime: 242,
    status: "active",
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
    name: "Username3",
    date: "05-10-2024",
  },
  {
    id: "3u1reuv4",
    manyTime: 242,
    status: "active",
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
    name: "Username4",
    date: "05-10-2024",
  },

];

export type User = {
  id: string;
  name: string;
  date: string;
  manyTime: number;
  sponsor: { name: string; logo: string }[];
  licence: string;
  status: "active" | "inactive" | "??";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize pl-[20px] via-fuchsia-400">
          <div className="flex items-center gap-x-[10px]">
            <div className="w-[45px] aspect-square border rounded-full"></div>
            <div>{row.getValue("name")}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "manyTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Sponsored Games
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pl-[30px]">{row.getValue("manyTime")}</div>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex h-full items-center justify-center max-w-[80px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center 
                    ${status === "active" ? "text-[#0FB71D] bg-[#D0FFCF]" : ""}
                    ${status === "??" ? "text-[#FF3A3A] bg-[#FFE0E0]" : ""}
                    ${status === "inactive" ? "text-[#F49301] bg-[#FFE4BB]" : ""}`}
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
      const sponsor = row.original;

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
          <DropdownMenuItem asChild>
            <SponsorUpdate sponsorId={sponsor.id} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Delete userId={sponsor.id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      );
    },
  },
];

export function SponsorsTables() {
  const elementRef = React.useRef<HTMLDivElement>(null);
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
          <SponsorCreation/>
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
