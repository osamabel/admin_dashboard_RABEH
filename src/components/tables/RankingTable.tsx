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
import { ArrowUpDown, ChevronDown, MoreHorizontal, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
const getRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
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
  const navigate = useNavigate();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = React.useState(1);
  const [users, setUsers] = React.useState<RankingUser[]>([
    {
      id: 1,
      name: "Alex Thompson",
      phoneNumber: "+1234567890",
      email: "alex@example.com",
      gender: "male",
      points: 450,
      totalPoints: 950,
      type: "premium",
      diamonds: 75,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 2,
      name: "Sarah Chen",
      phoneNumber: "+1234567891",
      email: "sarah@example.com",
      gender: "female",
      points: 380,
      totalPoints: 820,
      type: "premium",
      diamonds: 62,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      phoneNumber: "+1234567892",
      email: "mike@example.com",
      gender: "male",
      points: 320,
      totalPoints: 750,
      type: "regular",
      diamonds: 45,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 4,
      name: "Emma Davis",
      phoneNumber: "+1234567893",
      email: "emma@example.com",
      gender: "female",
      points: 180,
      totalPoints: 280,
      type: "regular",
      diamonds: 28,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 5,
      name: "James Wilson",
      phoneNumber: "+1234567894",
      email: "james@example.com",
      gender: "male",
      points: 150,
      totalPoints: 190,
      type: "regular",
      diamonds: 15,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 6,
      name: "Linda Kim",
      phoneNumber: "+1234567895",
      email: "linda@example.com",
      gender: "female",
      points: 90,
      totalPoints: 120,
      type: "regular",
      diamonds: 8,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 7,
      name: "David Brown",
      phoneNumber: "+1234567896",
      email: "david@example.com",
      gender: "male",
      points: 60,
      totalPoints: 85,
      type: "regular",
      diamonds: 5,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 8,
      name: "Sophie Taylor",
      phoneNumber: "+1234567897",
      email: "sophie@example.com",
      gender: "female",
      points: 40,
      totalPoints: 65,
      type: "regular",
      diamonds: 3,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 9,
      name: "Chris Martinez",
      phoneNumber: "+1234567898",
      email: "chris@example.com",
      gender: "male",
      points: 30,
      totalPoints: 45,
      type: "regular",
      diamonds: 2,
      avatar: null,
      createAt: getRandomDate(),
    },
    {
      id: 10,
      name: "Rachel Lee",
      phoneNumber: "+1234567899",
      email: "rachel@example.com",
      gender: "female",
      points: 20,
      totalPoints: 25,
      type: "regular",
      diamonds: 1,
      avatar: null,
      createAt: getRandomDate(),
    },
  ]);

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
      // setUsers(sortedUsers);

      setUsers([
        {
          id: 1,
          name: "Alex Thompson",
          phoneNumber: "+1234567890",
          email: "alex@example.com",
          gender: "male",
          points: 450,
          totalPoints: 950,
          type: "premium",
          diamonds: 75,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 2,
          name: "Sarah Chen",
          phoneNumber: "+1234567891",
          email: "sarah@example.com",
          gender: "female",
          points: 380,
          totalPoints: 820,
          type: "premium",
          diamonds: 62,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 3,
          name: "Mike Rodriguez",
          phoneNumber: "+1234567892",
          email: "mike@example.com",
          gender: "male",
          points: 320,
          totalPoints: 750,
          type: "regular",
          diamonds: 45,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 4,
          name: "Emma Davis",
          phoneNumber: "+1234567893",
          email: "emma@example.com",
          gender: "female",
          points: 180,
          totalPoints: 280,
          type: "regular",
          diamonds: 28,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 5,
          name: "James Wilson",
          phoneNumber: "+1234567894",
          email: "james@example.com",
          gender: "male",
          points: 150,
          totalPoints: 190,
          type: "regular",
          diamonds: 15,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 6,
          name: "Linda Kim",
          phoneNumber: "+1234567895",
          email: "linda@example.com",
          gender: "female",
          points: 90,
          totalPoints: 120,
          type: "regular",
          diamonds: 8,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 7,
          name: "David Brown",
          phoneNumber: "+1234567896",
          email: "david@example.com",
          gender: "male",
          points: 60,
          totalPoints: 85,
          type: "regular",
          diamonds: 5,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 8,
          name: "Sophie Taylor",
          phoneNumber: "+1234567897",
          email: "sophie@example.com",
          gender: "female",
          points: 40,
          totalPoints: 65,
          type: "regular",
          diamonds: 3,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 9,
          name: "Chris Martinez",
          phoneNumber: "+1234567898",
          email: "chris@example.com",
          gender: "male",
          points: 30,
          totalPoints: 45,
          type: "regular",
          diamonds: 2,
          avatar: null,
          createAt: getRandomDate(),
        },
        {
          id: 10,
          name: "Rachel Lee",
          phoneNumber: "+1234567899",
          email: "rachel@example.com",
          gender: "female",
          points: 20,
          totalPoints: 25,
          type: "regular",
          diamonds: 1,
          avatar: null,
          createAt: getRandomDate(),
        },
      ]);
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
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
              alt="First place"
              width={24}
              height={24}
              className="ml-2"
            />
          );
        } else if (index === 1) {
          badge = (
            <img
              src="/second.svg"
              alt="Second place"
              width={20}
              height={24}
              className="ml-2"
            />
          );
        } else if (index === 2) {
          badge = (
            <img
              src="/third.svg"
              alt="Third place"
              width={24}
              height={24}
              className="ml-2"
            />
          );
        }

        return (
          <div className="capitalize pl-[20px] flex items-center">
            <div className="flex items-center justify-between gap-x-[10px]  w-[200px]">
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
            Created at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase pl-[20px]">
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
            Coins
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase pl-[30px]">
          <div className="flex gap-x-[10px] items-center">
            <img width={20} src="/coin.svg" alt="Coins" />
            <p>{row.original.points}</p>
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
            Diamonds
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase pl-[30px]">
          <div className="flex gap-x-[10px] items-center">
            <img width={20} src="/diamond.svg" alt="Diamonds" />
            <p>{row.original.diamonds}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalPoints",
      header: "Badge",
      cell: ({ row }) => (
        <div className="">
          <img
            src={getBadgeImage(row.original.totalPoints)}
            alt={`Badge for ${row.original.totalPoints} points`}
            width={32}
            height={32}
          />
        </div>
      ),
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const user = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuItem onClick={() => navigate(`/user/${user.id}`)}>
    //             <User className="mr-2 h-4 w-4" />
    //             <span>View Profile</span>
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
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
    <div ref={elementRef} className="w-full h-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name..."
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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

export default RankingTable;
