import { GameNeedReports } from '@/components/tables/GameNeedReports'
import { ReportTable } from '@/components/tables/ReportsTable'

function Reports() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col gap-y-[20px]">
      <div className="w-full h-[50%]">
        <h1 className="text-[25px] font-semibold">الألعاب تحتاج إلى الإبلاغ عنها</h1>
        <GameNeedReports />
      </div>
        <div className="w-full h-[50%]">
          <h1 className="text-[25px] font-semibold">التقارير</h1>
          <ReportTable />
        </div>
    </div>
  )
}

export default Reports