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
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react";
  
interface DeleteProps {
    id: string;
    api: string;
  }

  export function Delete({ id, api }: DeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        const response = await fetch(`${api}${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('User deleted successfully.');
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the user.');
      } finally {
        setIsDeleting(false);
      }
    };
    return (
        <AlertDialog>
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
              user's account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-[10px] bg-red-600 hover:bg-red-700"
              disabled={isDeleting} // Disable the button while processing the delete request
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  