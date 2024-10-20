import { RankingTable } from "@/components/tables/RankingTable";

function Ranking() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col ">
      <div className="w-full h-[95%]">
        <h1 className="text-[25px] font-semibold">Leading Board</h1>
        <RankingTable />
      </div>
    </div>
  );
}

export default Ranking;
