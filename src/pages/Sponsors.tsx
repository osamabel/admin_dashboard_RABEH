import { SponsorsTables } from "@/components/tables/SponsorsTable";

function Sponsors() {
  return (
    <div className="bg-redf-300 w-full h-full overflow-hidfden flex flex-col ">
      <div className="w-full h-[95%]">
        <h1 className="text-[25px] font-semibold">Sponsors</h1>
        <SponsorsTables />
      </div>
    </div>
  );
}

export default Sponsors;
