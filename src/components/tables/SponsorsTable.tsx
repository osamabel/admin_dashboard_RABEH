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
import { useToast } from "@/hooks/use-toast";
const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export type Sponsor = {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
  games: number;
  status: "active" | "inactive" | "rejected";
};

export const columns: ColumnDef<Sponsor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاسم
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const logo = row.original.logo;
      const name = row.original.name;
      return (
        <div className="capitalize pr-[20px] via-fuchsia-400">
          <div className="flex items-center gap-x-[10px]">
            <div className="w-[45px] aspect-square border rounded-full ">
              {logo ? (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={`${apiUrl}:${apiPort}/${logo}`}
                  alt={name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-65">
                  {name[0]}
                </div>
              )}
            </div>
            <div>{row.getValue("name")}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "games",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الألعاب المدعومة
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pr-[30px]">{row.getValue("games")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ الإنشاء
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pr-[20px]">{formatDate(row.getValue("createdAt"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
          case "active": return "نشط";
          case "rejected": return "مرفوض";
          case "inactive": return "غير نشط";
          default: return status;
        }
      };
      
      return (
        <div className="flex h-full items-center justify-center max-w-[80px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center 
                    ${status.toLowerCase() === "active" ? "text-[#0FB71D] bg-[#D0FFCF]" : ""}
                    ${status.toLowerCase() === "rejected" ? "text-[#FF3A3A] bg-[#FFE0E0]" : ""}
                    ${status.toLowerCase() === "inactive" ? "text-[#F49301] bg-[#FFE4BB]" : ""}`}
          >
            {getStatusText(status)}
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
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <SponsorUpdate sponsorId={sponsor.id} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Delete id={sponsor.id} api={"sponsor"} />
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
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch sponsors
  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}:${apiPort}/sponsor`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSponsors(data);
      console.log("SSS", data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الرعاة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchSponsors();
  }, []);

  const table = useReactTable({
    data: sponsors,
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

  // Page size calculation effect
  React.useEffect(() => {
    const updatePageSize = () => {
      if (elementRef.current) {
        const height = elementRef.current.getBoundingClientRect().height;
        const newPageSize = Math.max(1, Math.floor((height - 200) / 73));
        setPageSize(newPageSize);
      }
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [sponsors]);

  // Update table's page size when pageSize state changes
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  if (isLoading) {
    return <div>جاري تحميل الرعاة...</div>;
  }

  return (
    <div ref={elementRef} className="w-full h-full" dir="rtl">
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث باسم الراعي..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-[6px]"
        />
        <Button
          onClick={() => fetchSponsors()}
          variant="outline"
          className="mr-2 rounded-[6px]"
        >
          تحديث
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto rounded-[6px]">
              الأعمدة <ChevronDown className="mr-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnNames = {
                  name: "الاسم",
                  games: "عدد الألعاب المدعومة",
                  createdAt: "تاريخ الإنشاء",
                  status: "الحالة"
                };
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnNames[column.id as keyof typeof columnNames] || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-[6px] border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        <SponsorCreation />
      </div>
      <div className="space-x-2 flex-row-reverse">
        <Button
          className="rounded-[6px] mx-2"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          السابق
        </Button>
        <Button
          className="rounded-[6px]"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          التالي
        </Button>
      </div>
    </div>
  </div>
);
}
