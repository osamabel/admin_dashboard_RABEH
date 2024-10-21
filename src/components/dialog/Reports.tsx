import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Game } from "../tables/GameTable";

interface GameReportGenerationProps {
  game: Game;
}

const reportSchema = z.object({
  dateOfDelivery: z.string().min(1, "Date of delivery is required"),
  expenseOfPrize: z.string().min(1, "Expense of prize is required"),
  additionalExpense: z.string().min(1, "Additional expense is required"),
  isPrizeDelivered: z.boolean(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const GameReportGeneration: React.FC<GameReportGenerationProps> = ({
  game,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [winnerForms, setWinnerForms] = useState<ReportFormValues[]>(
    game.winners.map(() => ({
      dateOfDelivery: "",
      expenseOfPrize: "",
      additionalExpense: "",
      isPrizeDelivered: false,
    }))
  );

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: winnerForms[currentWinnerIndex],
  });

  const onSubmit = async (data: ReportFormValues) => {
    const updatedForms = [...winnerForms];
    updatedForms[currentWinnerIndex] = data;
    setWinnerForms(updatedForms);

    if (currentWinnerIndex < game.winners.length - 1) {
      setCurrentWinnerIndex(currentWinnerIndex + 1);
      form.reset(updatedForms[currentWinnerIndex + 1]);
    } else {
      await submitAllReports(updatedForms);
    }
  };

  const submitAllReports = async (allForms: ReportFormValues[]) => {
    setIsSubmitting(true);
    try {
      const reportsData = allForms.map((formData, index) => ({
        gameId: game.id,
        winnerId: game.winners[index],
        prizeId: game.prizes[index],
        ...formData,
        expenseOfPrize: Number(formData.expenseOfPrize),
        additionalExpense: Number(formData.additionalExpense),
      }));

      await axios.post("/reports/create", reportsData);

      toast({
        title: "Reports Created",
        description: `All reports for ${game.name} have been successfully created and sent.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error creating reports:", error);
      toast({
        title: "Error",
        description: "Failed to create reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <div
        onClick={handleOpenDialog}
        className="flex items-center justify-start gap-x-[10px] p-[5px] w-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        <FileText width={16} />
        <p>Report</p>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-[425px] !rounded-[10px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Report for {game.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Create report for {game.winners[currentWinnerIndex].name} (Winner{" "}
              {currentWinnerIndex + 1} of {game.winners.length})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dateOfDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Delivery</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-[6px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expenseOfPrize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense of Prize</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="rounded-[6px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalExpense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Expense</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="rounded-[6px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPrizeDelivered"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Prize Delivered</FormLabel>
                      <FormDescription>
                        Check if the prize has been delivered
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    const prevIndex = currentWinnerIndex - 1;
                    setCurrentWinnerIndex(prevIndex);
                    form.reset(winnerForms[prevIndex]);
                  }}
                  disabled={currentWinnerIndex === 0}
                  className="rounded-[6px]"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <AlertDialogCancel className="rounded-[10px]">Cancel</AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[6px]"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentWinnerIndex === game.winners.length - 1
                    ? "Finish"
                    : "Next"}
                  {currentWinnerIndex < game.winners.length - 1 && (
                    <ChevronRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Current Winner and Prize:</h3>
            <p>
              {game.winners[currentWinnerIndex].name} -{" "}
              {game.prizes[currentWinnerIndex]}
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GameReportGeneration;