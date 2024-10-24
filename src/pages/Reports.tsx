import { DataTableDemo } from '@/components/tables/GameTable'
import { ReportsTable } from '@/components/tables/ReportsTable'

function Reports() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col gap-y-[20px]">
      <div className="w-full h-[50%]">
        <h1 className="text-[25px] font-semibold">Games need to be Repported</h1>
        <DataTableDemo />
      </div>
        <div className="w-full h-[50%]">
          <h1 className="text-[25px] font-semibold">Repports</h1>
          <ReportsTable />
        </div>
    </div>
  )
}

export default Reports