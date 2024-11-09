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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Delete } from "@/components/dialog/Delete";
const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
interface StoreItem {
  id: number;
  name: string;
  price: number;
  reward: number;
}

export function StoreTable() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [items, setItems] = React.useState<StoreItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    price: 0,
    reward: 0,
  });

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}:${apiPort}/store`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch store items");
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.price <= 0 || formData.reward <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول بقيم صحيحة.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}:${apiPort}/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create store item");
      }

      toast({
        title: "نجاح",
        description: "تم إنشاء المنتج بنجاح.",
      });

      setFormData({
        name: "",
        price: 0,
        reward: 0,
      });
      setIsOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<StoreItem>[] = [
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
      cell: ({ row }) => (
        <div className="capitalize pr-[20px]">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            السعر
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase pr-[30px]">
          <div className="flex gap-x-[10px]">
            <p>{row.getValue("price")}</p>
            <img width={20} src="/coin.svg" alt="عملات" />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "reward",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            المكافأة
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase pr-[30px]">
          <div className="flex gap-x-[10px]">
            <p>{row.getValue("reward")}</p>
            <img width={20} src="/diamond.svg" alt="ماس" />
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[10px]">
              <DropdownMenuItem className="p-0" asChild>
                <Delete id={item.id} api={"store"} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: items,
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

  return (
    <div ref={elementRef} className="w-full h-full" dir="rtl">
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث باسم المنتج..."
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
                  name: "الاسم",
                  price: "السعر",
                  reward: "المكافأة",
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
                    {columnNames[column.id as keyof typeof columnNames] ||
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-[6px]">
                <Plus className="ml-2 h-4 w-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px] !rounded-[10px]"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
                <DialogDescription>
                  أضف منتجاً جديداً للمتجر. املأ جميع المعلومات المطلوبة.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-[6px]"
                      placeholder="أدخل اسم المنتج"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (عملات)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="rounded-[6px]"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">المكافأة (ماس)</Label>
                    <Input
                      id="reward"
                      name="reward"
                      type="number"
                      value={formData.reward}
                      onChange={handleInputChange}
                      className="rounded-[6px]"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[6px]"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-[6px]"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الإنشاء..." : "إنشاء"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
export default StoreTable;
