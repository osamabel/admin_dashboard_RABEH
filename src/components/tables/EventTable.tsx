import React, { useState } from 'react';
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
import { ArrowUpDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

const apiUrl = import.meta.env.VITE_API_URL;


type ScratchReward = {
  type: "Coins" | "diamond";
  number: number;
};

export type Event = {
  id: string;
  name: string;
  type: "QUIZ" | "SCRATCH";
  reward?: number | null;
  quiz?: any | null;
  scratch?: ScratchReward[] | null;
  createdAt: string;
};

const CreateEventDialog = ({ onEventCreated }: { onEventCreated: () => void }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"QUIZ" | "SCRATCH">("QUIZ");
  const [reward, setReward] = useState("");
  const [quizFile, setQuizFile] = useState<File | null>(null);
  const [scratchRewards, setScratchRewards] = useState<ScratchReward[]>([
    { type: "Coins", number: 0 },
    { type: "Coins", number: 0 },
    { type: "Coins", number: 0 }
  ]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuizFile(e.target.files[0]);
    }
  };

  const handleScratchRewardChange = (index: number, field: keyof ScratchReward, value: any) => {
    const newRewards = [...scratchRewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setScratchRewards(newRewards);
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!name?.trim()) {
        throw new Error("Event name is required");
      }
  
      // Read quiz file if it exists
      let quizContent = null;
      if (type === "QUIZ") {
        // Validate quiz specific fields
        const rewardNumber = Number(reward);
        if (!reward || isNaN(rewardNumber) || rewardNumber <= 0) {
          throw new Error("Valid reward amount is required for quiz events");
        }
        if (!quizFile) {
          throw new Error("Quiz file is required");
        }
  
        // Read quiz file content
        quizContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = JSON.parse(e.target?.result as string);
              resolve(content);
            } catch (error) {
              reject(new Error("Invalid quiz file format"));
            }
          };
          reader.onerror = () => reject(new Error("Error reading quiz file"));
          reader.readAsText(quizFile);
        });
      } else {
        // Validate scratch rewards
        if (!scratchRewards?.length) {
          throw new Error("Scratch rewards are required");
        }
        if (scratchRewards.some(reward => reward.number <= 0)) {
          throw new Error("All scratch rewards must have a positive value");
        }
      }
  
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");
  
      // Prepare the payload based on event type
      const payload = {
        name,
        type,
        ...(type === "QUIZ" 
          ? {
              reward: Number(reward),
              quiz: quizContent,
              scratch: null
            } 
          : {
              reward: null,
              quiz: null,
              scratch: scratchRewards.filter(reward => reward.number > 0) // Only send non-zero rewards
            }
        )
      };
  
      // Log the payload for debugging
      console.log("Sending payload:", {
        payload
      });
  
      const response = await fetch(`${apiUrl}/game/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const responseData = await response.json();
      console.log(">>>>>>>>>", responseData)
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create event");
      }
  
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      
      // Reset form and close dialog
      setName("");
      setType("QUIZ");
      setReward("");
      setQuizFile(null);
      setScratchRewards([
        { type: "Coins", number: 0 },
        { type: "Coins", number: 0 },
        { type: "Coins", number: 0 }
      ]);
      
      onEventCreated();
  
    } catch (error) {
      console.error("Error creating event:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        name,
        type,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          <Plus className="ml-2 h-4 w-4" /> إنشاء فعالية جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء فعالية جديدة</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>اسم الفعالية</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>نوع الفعالية</Label>
            <Select value={type} onValueChange={(value: "QUIZ" | "SCRATCH") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الفعالية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QUIZ">مسابقة</SelectItem>
                <SelectItem value="SCRATCH">سحب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "QUIZ" ? (
            <>
              <div className="grid gap-2">
                <Label>المكافأة (عملات)</Label>
                <Input 
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>ملف المسابقة (JSON)</Label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Label>جوائز السحب</Label>
              {scratchRewards.map((reward, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    value={reward.type}
                    onValueChange={(value: "Coins" | "diamond") => 
                      handleScratchRewardChange(index, "type", value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coins">عملات</SelectItem>
                      <SelectItem value="diamond">ماس</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={reward.number}
                    onChange={(e) => 
                      handleScratchRewardChange(index, "number", parseInt(e.target.value))
                    }
                    placeholder="القيمة"
                  />
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleSubmit}>إنشاء الفعالية</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function EventTable() {
  const eventRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [events, setEvents] = React.useState<Event[]>([]);
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/game/events_dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/game/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم الفعالية
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize pr-[20px]">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "النوع",
      cell: ({ row }) => (
        <div className="pr-[20px]">
          {row.getValue("type") === "QUIZ" ? "مسابقة" : "سحب"}
        </div>
      ),
    },
    {
      accessorKey: "reward",
      header: "المكافأة",
      cell: ({ row }) => {
        const event = row.original;
        if (event.type === "QUIZ") {
          return <div className="pr-[20px]">{event.reward} عملة</div>;
        } else {
          return (
            <div className="pr-[20px]">
              {event.scratch?.map((reward, index) => (
                <div key={index}>
                  {reward.number} {reward.type === "Coins" ? "عملة" : "ماس"}
                </div>
              ))}
            </div>
          );
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ الإنشاء
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="pr-[20px]">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleDelete(event.id)}
                className="text-red-600"
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: events,
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
        const newPageSize = Math.max(1, Math.floor((height - 200) / 145));
        setPageSize(newPageSize);
      }
    };
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div ref={eventRef} className="w-full h-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث عن اسم الفعالية.."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-[6px]"
        />
      </div>
      <div className="rounded-[6px] border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className='text-right' key={header.id}>
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
                    <TableCell className=""  key={cell.id}>
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
          <CreateEventDialog onEventCreated={fetchEvents} />
        </div>
        <div className="space-x-2">
          <Button
            className="rounded-[6px]"
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

export default EventTable;