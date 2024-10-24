import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface PrizeDialogProps {
    prizes: string[];
  }
  
  export function PrizeDialog({ prizes }: PrizeDialogProps) {
    if (!prizes || prizes.length === 0) {
      return <div className="text-center text-muted">No prizes</div>;
    }
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-[100px] h-[35px] rounded-[6px] bg-black/5"
          >
            View Prizes
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Prize List</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[400px] pr-4">
            <div className="flex flex-col gap-4">
              {prizes.map((prize, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {index + 1}
                    </div>
                    <span>{prize}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }