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
import { ArrowUpDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "./SponsorsTable";
const apiUrl = import.meta.env.VITE_API_URL;

interface Sponsor {
  id: number;
  name: string;
  logo: string | null;
  status: string;
  createdAt: string;
}

interface Game {
  name: string;
  sponsorId: Sponsor[];
}

interface User {
  name: string;
  avatar: string | null;
}

export type Report = {
  id: number;
  userId: number;
  gameId: number;
  trophyType: string;
  expenses: string;
  additionalExpenses: string;
  amount: string;
  reportDate: string;
  hasTrophy: boolean;
  createdAt: string;
  user: User;
  game: Game;
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "game",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم اللعبة
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pr-[20px]">{row.original.game.name}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "الفائز",
    cell: ({ row }) => (
      <div className="capitalize pr-[20px]">{row.original.user.name}</div>
    ),
  },
  {
    accessorKey: "trophyType",
    header: "نوع الكأس",
    cell: ({ row }) => (
      <div className="capitalize pr-[20px]">{row.getValue("trophyType")}</div>
    ),
  },
  {
    accessorKey: "expenses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المصاريف
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pr-[20px]">${row.getValue("expenses")}</div>
    ),
  },
  {
    accessorKey: "additionalExpenses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المصاريف الإضافية
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pr-[20px]">${row.getValue("additionalExpenses")}</div>
    ),
  },
  {
    accessorKey: "sponsors",
    header: "الرعاة",
    cell: ({ row }) => {
      const sponsors = row.original.game.sponsorId;
      return <SponsorsDialog sponsors={sponsors} />;
    },
  },
  {
    accessorKey: "hasTrophy",
    header: "حالة الكأس",
    cell: ({ row }) => {
      const hasTrophy = row.getValue("hasTrophy");
      return (
        <div className="flex h-full items-center justify-center max-w-[100px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center ${
              hasTrophy
                ? "text-[#0FB71D] bg-[#D0FFCF]"
                : "text-[#FF3A3A] bg-[#FFE0E0]"
            }`}
          >
            {hasTrophy ? "تم التسليم" : "قيد الانتظار"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reportDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ التقرير
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pr-[20px]">{formatDate(row.getValue("reportDate"))}</div>
    ),
  },
];

export function ReportTable() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [reports, setReports] = React.useState<Report[]>([]);
  const { toast } = useToast();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${apiUrl}/dashboard/allReports`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReports(data);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchReports();
  }, []);

  const table = useReactTable({
    data: reports,
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
      }
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const [isLoading, setIsLoading] = React.useState(false);
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${apiUrl}/dashboard/generate-pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      // Get filename from response headers if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `Repport.pdf`;

      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        );
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={elementRef} className="w-full h-full" dir="rtl">
      <div className="flex items-center py-4 w-full justify-between">
        <Input
          placeholder="البحث باسم اللعبة..."
          value={(table.getColumn("game")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("game")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-[6px]"
        />
  
        <Button
          onClick={handleDownloadPDF}
          className="rounded-[6px]"
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 ml-2" />
              جاري التحميل...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 ml-2" />
              تحميل PDF
            </>
          )}
        </Button>
      </div>
      <div className="rounded-[6px] border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead  className="text-right"  key={header.id}>
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
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
    <div className="flex items-center justify-start space-x-2 py-4">
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
