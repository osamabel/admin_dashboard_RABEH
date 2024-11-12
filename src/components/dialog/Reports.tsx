import React, { forwardRef, useState } from "react";
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
import { FileText, ChevronLeft, ChevronRight, User } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Game } from "../tables/GameNeedReports";

const apiUrl = import.meta.env.VITE_API_URL;


type WinnerReport = {
  winnerId: number;
  prizeId: string;
  dateOfDelivery: string;
  expenseOfPrize: string;
  additionalExpense: string;
  isPrizeDelivered: boolean;
  videoUrl: string;
};
interface GameReportGenerationProps {
  game: Game;
}
const reportSchema = z.object({
  dateOfDelivery: z.string().min(1, "تاريخ التسليم مطلوب"),
  expenseOfPrize: z.string().min(1, "تكلفة الجائزة مطلوبة"),
  additionalExpense: z.string().min(1, "التكلفة الإضافية مطلوبة"),
  isPrizeDelivered: z.boolean(),
  videoUrl: z
    .string()
    .url("الرجاء إدخال رابط صحيح")
    .optional()
    .or(z.literal("")),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const GameReportGeneration = forwardRef<
  HTMLDivElement,
  GameReportGenerationProps
>(({ game }, ref) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [winnerReports, setWinnerReports] = useState<WinnerReport[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      dateOfDelivery: "",
      expenseOfPrize: "",
      additionalExpense: "",
      isPrizeDelivered: false,
      videoUrl: "",
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    // Save current winner's report
    const userId = Number(game.userGames[currentWinnerIndex].userId);
    const currentReport: WinnerReport = {
      winnerId: userId,
      prizeId: game.prizes[currentWinnerIndex],
      dateOfDelivery: data.dateOfDelivery,
      expenseOfPrize: data.expenseOfPrize,
      additionalExpense: data.additionalExpense,
      isPrizeDelivered: data.isPrizeDelivered,
      videoUrl: data.videoUrl || "",
    };

    // Update winner reports
    const updatedReports = [...winnerReports];
    updatedReports[currentWinnerIndex] = currentReport;
    setWinnerReports(updatedReports);

    if (currentWinnerIndex < game.userGames.length - 1) {
      // Move to next winner
      setCurrentWinnerIndex(currentWinnerIndex + 1);
      form.reset();
    } else {
      // Submit all reports when on last winner
      await submitAllReports(updatedReports);
    }
  };

  const submitReport = async (reportData: WinnerReport) => {
    const sponsorIds = game.sponsorId.map((sponsor) => sponsor.id);
    const payload = {
      gameId: game.id,
      winnerId: reportData.winnerId,
      prizeId: reportData.prizeId,
      dateOfDelivery: reportData.dateOfDelivery,
      expenseOfPrize: reportData.expenseOfPrize,
      additionalExpense: reportData.additionalExpense,
      isPrizeDelivered: reportData.isPrizeDelivered,
      videoUrl: reportData.videoUrl,
      sponsorIds: sponsorIds,
    };

    const token = localStorage.getItem("jwt_token");
    const response = await axios.post(
      `${apiUrl}/dashboard/${game.id}/winner-report`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
  };

  const submitAllReports = async (reports: WinnerReport[]) => {
    setIsSubmitting(true);
    try {
      console.log(
        "Preparing to submit reports for all winners:",
        reports.map((report, index) => ({
          winnerIndex: index + 1,
          winnerId: report.winnerId,
          prizeId: report.prizeId,
          dateOfDelivery: report.dateOfDelivery,
          expenseOfPrize: report.expenseOfPrize,
          additionalExpense: report.additionalExpense,
          isPrizeDelivered: report.isPrizeDelivered,
          videoUrl: report.videoUrl,
        }))
      );

      // Submit reports sequentially
      for (let i = 0; i < reports.length; i++) {
        console.log(
          `Submitting report for winner ${i + 1}/${reports.length}:`,
          reports[i]
        );
        await submitReport(reports[i]);
        console.log(`Successfully submitted report for winner ${i + 1}`);
      }

      toast({
        title: "تم إنشاء التقارير",
        description: `تم إنشاء وإرسال جميع تقارير ${game.name} بنجاح.`,
      });

      setIsOpen(false);
      // Reset the form and stored reports
      setWinnerReports([]);
      setCurrentWinnerIndex(0);
      form.reset();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء بعض التقارير. يرجى المحاولة مرة أخرى.",
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
    setWinnerReports([]); // Reset stored reports when opening dialog
    setCurrentWinnerIndex(0);
    form.reset();
  };

  const currentWinner = game.userGames[currentWinnerIndex];
  const currentPrize = game.prizes[currentWinnerIndex];
  return (
    <>
      <div
        ref={ref}
        onClick={handleOpenDialog}
        className="flex items-center justify-start gap-x-[10px] p-[5px] w-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        <FileText width={16} />
        <p>تقرير</p>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-[425px] !rounded-[10px]" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>إنشاء تقرير لـ {game.name}</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={currentWinner?.avatar}
                  alt={currentWinner?.name || "الفائز"}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              إنشاء تقرير لـ {currentWinner?.name || "فائز غير معروف"}
              <span className="text-muted-foreground">
                (الفائز {currentWinnerIndex + 1} من {game.userGames.length})
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dateOfDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ التسليم</FormLabel>
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
                    <FormLabel>تكلفة الجائزة</FormLabel>
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
                    <FormLabel>التكلفة الإضافية</FormLabel>
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
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الفيديو (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="أدخل رابط الفيديو"
                        {...field}
                        className="rounded-[6px]"
                      />
                    </FormControl>
                    <FormDescription>
                      أدخل رابطاً صحيحاً لمحتوى الفيديو
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPrizeDelivered"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>تم تسليم الجائزة</FormLabel>
                      <FormDescription>
                        حدد إذا تم تسليم الجائزة
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
                    form.reset();
                  }}
                  disabled={currentWinnerIndex === 0}
                  className="rounded-[6px]"
                >
                  <ChevronRight className="ml-2 h-4 w-4" /> السابق
                </Button>
                <AlertDialogCancel className="rounded-[10px]">
                  إلغاء
                </AlertDialogCancel>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[6px]"
                >
                  {isSubmitting
                    ? `جارٍ الإرسال ${currentWinnerIndex + 1}/${game.userGames.length}...`
                    : currentWinnerIndex === game.userGames.length - 1
                    ? "إرسال جميع التقارير"
                    : "حفظ والتالي"}
                  {currentWinnerIndex < game.userGames.length - 1 && (
                    <ChevronLeft className="mr-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">الفائز والجائزة الحالية:</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={currentWinner?.avatar}
                  alt={currentWinner?.name || "الفائز"}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <p>
                {currentWinner?.name || "فائز غير معروف"} -{" "}
                {currentPrize || "جائزة غير معروفة"}
              </p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

GameReportGeneration.displayName = "GameReportGeneration";

export default GameReportGeneration;
