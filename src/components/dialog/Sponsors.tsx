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
        <Button variant="outline" className="rounded-[10px] text-[12px]">Sponsors</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Sponsors of This Game</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="w-full max-h-[200px]  overflow-auto border rounded-[10px]">
              {sponsors.map((sponsor: any, index: number) => (
                <div key={index} className="flex items-center mb-2 p-2">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-8 h-8 mr-2"
                  />
                  <span>{sponsor.name}</span>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[10px]">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
