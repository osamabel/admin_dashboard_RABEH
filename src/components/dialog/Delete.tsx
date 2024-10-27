import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { forwardRef, useState, ForwardedRef } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
interface DeleteProps {
  id: string | number;
  api: string;
}

export const Delete = forwardRef<HTMLDivElement, DeleteProps>(
  ({ id, api }: DeleteProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${apiUrl}:${apiPort}/${api}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast({
          title: "Deleted Successfully",
          description: "The item has been deleted.",
        });

        setIsOpen(false);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while deleting.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <div ref={ref}>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-x-[10px] p-[5px] border-none h-auto w-full hover:bg-transparent"
            >
              <Trash2 width={16} />
              <p>Delete</p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="!rounded-[10px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                item and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-[10px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="rounded-[10px] bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

// Add display name for better debugging
Delete.displayName = "Delete";
