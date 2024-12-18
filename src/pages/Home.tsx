import { EventTable } from "@/components/tables/EventTable";
import { DataTableDemo } from "@/components/tables/GameTable";

function Home() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col gap-y-[20px]">
      <div className="w-full h-[50%]">
        <h1 className="text-[25px] font-semibold">الألعاب الحالية</h1>
        <DataTableDemo />
      </div>
      <div className="w-full flex h-[50%] gap-x-[20px]">
        <div className="w-full h-full">
          <h1 className="text-[25px] font-semibold">الاحداث الحالية</h1>
          <EventTable />
        </div>
        {/* <div className="w-full h-full flex flex-col">
          <h1 className="text-[25px] font-semibold">Results</h1>
          <div className="border h-full rounded-[10px] flex flex-col gap-y-[10px] p-[20px] overflow-auto">
            <div className="border rounded-[6px] min-h-[80px]">hello</div>
            <div className="border rounded-[6px] min-h-[80px]">hello</div>
            <div className="border rounded-[6px] min-h-[80px]">hello</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

// api creation :
// event/create

// api fetch:
// /event

// api delete:
// /event

// {
//   name:
//   type: "QUIZ" | "SQRATSH" 
//   rewad: 500 Coin
//   quiz: ?
//   scratch: [{ type: "Coins"| "diamond", number: 40 },{},{}]
// }

export default Home;
