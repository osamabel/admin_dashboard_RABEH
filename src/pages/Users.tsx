import { UserTable } from '@/components/tables/UserTable'

function Users() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col ">
      <div className="w-full h-[95%]">
        <h1 className="text-[25px] font-semibold">User</h1>
        <UserTable />
      </div>
    </div>
  )
}

export default Users