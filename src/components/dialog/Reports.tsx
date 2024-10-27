import React, { forwardRef, useState, useRef } from "react";
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
import { FileText, ChevronLeft, ChevronRight, Upload, User } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Game } from "../tables/GameNeedReports";

interface GameReportGenerationProps {
  game: Game;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];

const reportSchema = z.object({
  dateOfDelivery: z.string().min(1, "Date of delivery is required"),
  expenseOfPrize: z.string().min(1, "Expense of prize is required"),
  additionalExpense: z.string().min(1, "Additional expense is required"),
  isPrizeDelivered: z.boolean(),
  video: z
    .any()
    .refine((file) => file instanceof File, "Video is required")
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "Max file size is 500MB"
    )
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file?.type),
      "Only .mp4, .mov and .avi formats are supported"
    ),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const GameReportGeneration = forwardRef<HTMLDivElement, GameReportGenerationProps>(
  ({ game }, ref) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>("");

    const form = useForm<ReportFormValues>({
      resolver: zodResolver(reportSchema),
      defaultValues: {
        dateOfDelivery: "",
        expenseOfPrize: "",
        additionalExpense: "",
        isPrizeDelivered: false,
        video: undefined,
      },
    });
console.log(">>>game" ,game)
    const onSubmit = async (data: ReportFormValues) => {
      if (currentWinnerIndex < game.userGames.length - 1) {
        setCurrentWinnerIndex(currentWinnerIndex + 1);
        form.reset();
        setSelectedFileName("");
      } else {
        await submitReport(data);
      }
    };

    const submitReport = async (formData: ReportFormValues) => {
      setIsSubmitting(true);
      try {
        // Create FormData object to handle file upload
        const submitData = new FormData();
        
        // Get sponsor IDs from the game object
        const sponsorIds = game.sponsorId.map(sponsor => sponsor.id);

        // Append all form fields
        submitData.append("gameId", game.id.toString());
        submitData.append("winnerId", game.userGames[currentWinnerIndex].userId.toString());
        submitData.append("prizeId", game.prizes[currentWinnerIndex]);
        submitData.append("dateOfDelivery", formData.dateOfDelivery);
        submitData.append("expenseOfPrize", formData.expenseOfPrize);
        submitData.append("additionalExpense", formData.additionalExpense);
        submitData.append("isPrizeDelivered", formData.isPrizeDelivered.toString());
        submitData.append("video", formData.video);
        submitData.append("sponsorIds", JSON.stringify(sponsorIds));


        console.log("FormData entries:");
        for (let pair of submitData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        const token = localStorage.getItem("jwt_token");
        await axios.post(`http://10.32.108.154:3000/dashboard/${game.id}/winners-report`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast({
          title: "Report Created",
          description: `Report for ${game.name} has been successfully created and sent.`,
        });

        setIsOpen(false);
      } catch (error) {
        console.error("Error creating report:", error);
        toast({
          title: "Error",
          description: "Failed to create report. Please try again.",
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFileName(file.name);
        form.setValue("video", file);
      }
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
          <p>Report</p>
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="sm:max-w-[425px] !rounded-[10px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Generate Report for {game.name}</AlertDialogTitle>
              <AlertDialogDescription className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={currentWinner?.avatar} 
                    alt={currentWinner?.name || 'Winner'} 
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                Create report for {currentWinner?.name || 'Unknown Winner'} 
                <span className="text-muted-foreground">
                  (Winner {currentWinnerIndex + 1} of {game.userGames.length})
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
                  name="video"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            disabled
                            value={selectedFileName}
                            placeholder="No file selected"
                            className="rounded-[6px]"
                          />
                          <Input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a video file (max 500MB, .mp4, .mov, or .avi)
                      </FormDescription>
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
                      form.reset();
                      setSelectedFileName("");
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
                      : currentWinnerIndex === game.userGames.length - 1
                      ? "Finish"
                      : "Next"}
                    {currentWinnerIndex < game.userGames.length - 1 && (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Current Winner and Prize:</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={currentWinner?.avatar} 
                    alt={currentWinner?.name || 'Winner'} 
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <p>
                  {currentWinner?.name || 'Unknown Winner'} -{' '}
                  {currentPrize || 'Unknown Prize'}
                </p>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);

GameReportGeneration.displayName = "GameReportGeneration";

export default GameReportGeneration;