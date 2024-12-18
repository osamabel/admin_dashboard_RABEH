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
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "./SponsorsTable";

const apiUrl = import.meta.env.VITE_API_URL;
interface sponsor {
  id: number;
  logo: string;
  name: string;
  status: string;
}

export type Game = {
  id: string;
  name: string;
  createdAt: string;
  requiredDiamonds: number;
  sponsorId: sponsor[];
  licenseId: string;
  status: "created" | "started" | "ended" | "closed";
  userGames: { userId: string; gameId: string; name: string; avatar: string }[];
  prizes: string[];
  isReported?: boolean;
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
          اسم اللعبة
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pr-[20px]">{row.getValue("name")}</div>
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
    accessorKey: "prize",
    header: "الجوائز",
    cell: ({ row }) => {
      const prz = row.original.prizes;
      return <PrizeDialog prizes={prz} />;
    },
  },
  {
    accessorKey: "requiredDiamonds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الماس المطلوب
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase pr-[30px]">
        {row.getValue("requiredDiamonds")}
      </div>
    ),
  },
  {
    accessorKey: "sponsorId",
    header: "الرعاة",
    cell: ({ row }) => {
      const sponsors = row.original.sponsorId;
      return <SponsorsDialog sponsors={sponsors} />;
    },
  },
  {
    accessorKey: "licenseId",
    header: "الترخيص",
    cell: ({ row }) => (
      <div className="lowercase pr-[20px]">{row.getValue("licenseId")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
          case "pending": return "قيد الانتظار";
          case "started": return "بدأت";
          case "closed": return "مغلقة";
          case "ended": return "انتهت";
          default: return status;
        }
      };

      return (
        <div className="flex h-full items-center justify-center max-w-[80px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center 
                    ${status.toLowerCase() === "pending" ? "text-[#626262] bg-[#F1F1F1]" : ""}
                    ${status.toLowerCase() === "started" ? "text-[#0FB71D] bg-[#D0FFCF]" : ""}
                    ${status.toLowerCase() === "closed" ? "text-[#FF3A3A] bg-[#FFE0E0]" : ""}
                    ${status.toLowerCase() === "ended" ? "text-[#F49301] bg-[#FFE4BB]" : ""}`}
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
      const game = row.original;

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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Delete api={"game"} id={game.id} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <GameReportGeneration game={game} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function GameNeedReports() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [games, setGames] = React.useState<Game[]>([]);
  const { toast } = useToast();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch games from API
  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${apiUrl}/dashboard/unreportedGames`,
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
      // Transform the data to match the Game type
      const transformedData = Array.isArray(data)
        ? data.map((game) => ({
            id: game.id.toString(),
            name: game.name,
            createdAt: game.createdAt, // Keep as is, as per Game type
            requiredDiamonds: game.requiredDiamonds,
            sponsorId:
              game.sponsorId?.map((s: sponsor) => ({
                id: s.id,
                name: s.name,
                logo: s.logo,
                status: s.status,
              })) || [],
            licenseId: game.licenseId,
            status: game.status as "created" | "started" | "ended" | "closed",
            userGames:
              game.userGames?.map((w: any) => ({
                userId: w.userId || "",
                gameId: w.gameId || "",
                name: w.name || "",
                avatar: w.avatar || "",
              })) || [],
            prizes: game.prizes || [],
            isReported: game.isReported,
          }))
        : [];

      setGames(transformedData);
    } catch (error: any) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to load games. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchGames();
  }, []);

  const table = useReactTable({
    data: games,
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
    <div ref={elementRef} className="w-full h-full" dir="rtl">
    <div className="flex items-center py-4">
      <Input
        placeholder="البحث باسم اللعبة..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm rounded-[6px]"
      />
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
                name: "اسم اللعبة",
                createdAt: "تاريخ الإنشاء",
                prize: "الجوائز",
                requiredDiamonds: "الماس المطلوب",
                sponsorId: "الرعاة",
                licenseId: "الترخيص",
                status: "الحالة"
              };
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {columnNames[column.id as keyof typeof columnNames] || column.id}
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
                    <TableHead className="text-right" key={header.id}>
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
            سابق
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
