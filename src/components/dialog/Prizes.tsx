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
interface PrizeDialogProps{
  prizes: string[]
}

export function PrizeDialog({prizes}: PrizeDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="rounded-[10px] text-[12px]">
        🏆 Prize
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px]">
        <AlertDialogHeader className="">
          <AlertDialogTitle>Prize for Top Winners</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="lowercase text-center  w-full flex h-[100px] gap-x-[20px] pl-[20px]">
              <div className="flex flex-col gap-y-[10px] justify-around h-full">
                <img width={20} src="/first.svg" alt="" />
                <img width={20} src="/second.svg" alt="" />
                <img width={20} src="/third.svg" alt="" />
              </div>
              <div className="h-full items-start flex flex-col gap-y-[10px] justify-around text-[15px] font-[500]">
                {
                  prizes.map((i, index)=>(
                    <p key={index}>{i}</p>
                  ))
                }
              </div>
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
