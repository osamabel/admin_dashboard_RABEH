import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function SponsorsDialog({ sponsors }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="rounded-[10px] text-[12px]">
          Sponsors
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Sponsors of This Game</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="w-full max-h-[200px]  overflow-auto border rounded-[10px]">
              {sponsors.map((sponsor: any, index: number) => (
                <div key={index} className="flex items-center w-full p-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-[10px] items-center">
                      <div className="w-[45px] aspect-square border rounded-full ">
                        {sponsor.logo ? (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={`https://145.223.117.65:3000/${sponsor.logo}`}
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-65">
                            {sponsor.name[0]}
                          </div>
                        )}
                      </div>
                      <span>{sponsor.name}</span>
                    </div>

                    <div
                      className={`py-[5px] px-[15px] rounded-[10px] text-[12px] text-center 
                      ${
                        sponsor.status.toLocaleLowerCase() === "active"
                          ? "text-[#0FB71D] bg-[#D0FFCF]"
                          : ""
                      }
                      ${
                        sponsor.status.toLocaleLowerCase() === "rejected"
                          ? "text-[#FF3A3A] bg-[#FFE0E0]"
                          : ""
                      }
                      ${
                        sponsor.status.toLocaleLowerCase() === "inactive"
                          ? "text-[#F49301] bg-[#FFE4BB]"
                          : ""
                      }`}
                    >
                      {sponsor.status.toLocaleLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[10px]">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
