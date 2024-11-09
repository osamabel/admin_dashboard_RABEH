import React from "react";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;

export type RankingUser = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  gender: string;
  points: number;
  totalPoints: number;
  type: string;
  diamonds: number;
  avatar: string | null;
  createAt: string;
};

export const getBadgeImage = (totalPoints: number) => {
  if (totalPoints < 100) return "badges/badge 1.png";
  if (totalPoints < 200) return "badges/badge 2.png";
  if (totalPoints < 300) return "badges/badge 3.png";
  if (totalPoints < 400) return "badges/badge 4.png";
  if (totalPoints < 500) return "badges/badge 5.png";
  if (totalPoints < 600) return "badges/badge 6.png";
  if (totalPoints < 700) return "badges/badge 7.png";
  if (totalPoints < 800) return "badges/badge 8.png";
  if (totalPoints < 900) return "badges/badge 9.png";
  return "badges/badge 10.png";
};

export function RankingTable() {
  // const navigate = useNavigate();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [users, setUsers] = React.useState<RankingUser[]>([]);

  // Add these state declarations
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}:${apiPort}/user`, {
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
      // Sort users by totalPoints in descending order
      const sortedUsers = data.sort(
        (a: RankingUser, b: RankingUser) => b.totalPoints - a.totalPoints
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);
  
  const columns: ColumnDef<RankingUser>[] = [
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
        const avatar = row.original.avatar;
        const index = row.index;
        let badge = null;
  
        if (index === 0) {
          badge = (
            <img
              src="/first.svg"
              alt="المركز الأول"
              width={24}
              height={24}
              className="mr-2"
            />
          );
        } else if (index === 1) {
          badge = (
            <img
              src="/second.svg"
              alt="المركز الثاني"
              width={20}
              height={24}
              className="mr-2"
            />
          );
        } else if (index === 2) {
          badge = (
            <img
              src="/third.svg"
              alt="المركز الثالث"
              width={24}
              height={24}
              className="mr-2"
            />
          );
        }
  
        return (
          <div className="capitalize pr-[20px] flex items-center">
            <div className="flex items-center justify-between gap-x-[10px] w-[200px]">
              <div className="min-w-[100px] max-w-[180px] flex items-center gap-3">
                <div className="w-[45px] aspect-square border rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={`${apiUrl}:${apiPort}/${avatar}`}
                      alt={row.original.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      {row.original.name[0]}
                    </div>
                  )}
                </div>
                <span>{row.original.name}</span>
              </div>
              {badge}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            تاريخ التسجيل
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pr-[20px]">
          {new Date(row.original.createAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "points",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            العملات
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pr-[30px]">
          <div className="flex gap-x-[10px] items-center">
            <p>{row.original.points}</p>
            <img width={20} src="/coin.svg" alt="عملات" />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "diamonds",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الماس
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pr-[30px]">
          <div className="flex gap-x-[10px] items-center">
            <p>{row.original.diamonds}</p>
            <img width={20} src="/diamond.svg" alt="ماس" />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalPoints",
      header: "الوسام",
      cell: ({ row }) => (
        <div className="">
          <img
            src={getBadgeImage(row.original.totalPoints)}
            alt={`وسام ${row.original.totalPoints} نقطة`}
            width={32}
            height={32}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
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

  // Dynamic page size calculation
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

  return (
    <div ref={elementRef} className="w-full h-full" dir="rtl">
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث بالاسم..."
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
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "name" ? "الاسم" :
                     column.id === "createAt" ? "تاريخ التسجيل" :
                     column.id === "points" ? "العملات" :
                     column.id === "diamonds" ? "الماس" :
                     column.id === "totalPoints" ? "الوسام" :
                     column.id}
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
                  <TableHead className="text-right" key={header.id}>
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

export default RankingTable;
