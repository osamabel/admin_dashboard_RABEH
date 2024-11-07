import { FeedbackTable } from "@/components/tables/FeedbackTable"

function Feedback() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col gap-y-[20px]">
    <div className="w-full h-[50%]">
      <h1 className="text-[25px] font-semibold">Current Games</h1>
      <FeedbackTable />
    </div>
  </div>
  )
}

export default Feedback