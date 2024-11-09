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
        🏆 الجوائز
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px]" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>جوائز الفائزين الأوائل</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="lowercase text-center w-full flex h-[100px] gap-x-[20px] pr-[20px]">
              <div className="flex flex-col gap-y-[10px] justify-around h-full">
              </div>
              <div className="h-full items-start flex flex-col gap-y-[10px] justify-around text-[15px] font-[500]">
                {
                  prizes.map((i, index) => (
                    <p key={index} className="text-right w-full">🏆 {i}</p>
                  ))
                }
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:flex-row-reverse">
          <AlertDialogCancel className="rounded-[10px]">
            إغلاق
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
