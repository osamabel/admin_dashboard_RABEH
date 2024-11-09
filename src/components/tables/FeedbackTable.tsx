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
import { ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "./SponsorsTable";
import { FeedbackAnalyticsDialog } from "../dialog/FeedbackAnalytics";
import { FeedbackCreationDialog } from "../dialog/FeedbackCreation";

const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;

interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

interface Feedback {
  id: number;
  sponsorId: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hasResponded: boolean;
  lastResponse: string | null;
}

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          العنوان
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pr-[20px]">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "الوصف",
    cell: ({ row }) => (
      <div className="pr-[20px] max-w-[300px] truncate">
        {row.getValue("description")}
      </div>
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
    accessorKey: "isActive",
    header: "الحالة",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <div className="flex h-full items-center justify-center max-w-[80px]">
          <div
            className={`py-[5px] px-[15px] rounded-[10px] w-full text-[12px] text-center 
              ${
                isActive
                  ? "text-[#0FB71D] bg-[#D0FFCF]"
                  : "text-[#FF3A3A] bg-[#FFE0E0]"
              }`}
          >
            {isActive ? "نشط" : "غير نشط"}
          </div>
        </div>
      );
    },
  },
  {
    id: "analytics",
    enableHiding: false,
    cell: ({ row }) => {
      const feedback = row.original;
      return <FeedbackAnalyticsDialog feedbackId={feedback.id} />;
    },
  },
];

export function FeedbackTable() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [selectedSponsorId, setSelectedSponsorId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
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
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}:${apiPort}/sponsor`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSponsors(data);
    } catch (error: any) {
      console.error("Error fetching sponsors:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الرعاة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  // Fetch feedbacks for selected sponsor
  const fetchFeedbacks = async (sponsorId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${apiUrl}:${apiPort}/sponsor-forms/sponsor/${sponsorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error: any) {
      console.error("Error fetching feedbacks:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التعليقات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSponsors();
  }, []);

  React.useEffect(() => {
    if (selectedSponsorId) {
      fetchFeedbacks(selectedSponsorId);
    } else {
      setFeedbacks([]);
    }
  }, [selectedSponsorId]);

  const table = useReactTable({
    data: feedbacks,
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
  });
  return (
    <div className="w-full" dir="rtl">
      <div className="flex items-center py-4 gap-4 w-full justify-between">
        <div className="flex-1 max-w-sm">
          <Select
            value={selectedSponsorId}
            onValueChange={setSelectedSponsorId}
            disabled={isLoading}
          >
            <SelectTrigger className="rounded-[6px]">
              <SelectValue placeholder="اختر راعياً" />
            </SelectTrigger>
            <SelectContent>
              {sponsors.map((sponsor) => (
                <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                  {sponsor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedSponsorId && (
          <Input
            placeholder="البحث في التعليقات..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded-[6px]"
          />
        )}
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
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
                {selectedSponsorId
                  ? "لا توجد تعليقات."
                  : "اختر راعياً لعرض التعليقات."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    {selectedSponsorId && (
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <FeedbackCreationDialog
            onSuccess={() => fetchFeedbacks(selectedSponsorId)}
          />
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
    )}
  </div>
  );
}
