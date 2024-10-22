import React, { useState, useEffect, forwardRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PenBox } from "lucide-react";

interface SponsorData {
  name: string;
  status: string;
  logo: File | null;
}

interface SponsorUpdateProps {
  sponsorId: string;
}


export const SponsorUpdate = forwardRef<HTMLDivElement, SponsorUpdateProps>(
  ({ sponsorId }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
    logo: null,
    status: "",
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSponsorData();
    }
  }, [isOpen, sponsorId]);

  const fetchSponsorData = async () => {
    try {
      // Get token from localStorage or wherever you store it
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(
        `http://10.11.10.13:3000/sponsor/${sponsorId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sponsor data");
      }
      const data = await response.json();
      setSponsorData(data);
    } catch (error) {
      console.error("Error fetching sponsor data:", error);
      toast({
        title: "Error",
        description: "Failed to load sponsor data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSponsorData((prev: any) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (value: "active" | "inactive" | "rejected") => {
    setSponsorData((prev: any) => (prev ? { ...prev, status: value } : null));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorData) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      
      // Only append fields that have values and have changed
      if (sponsorData.name.trim()) {
        formData.append("name", sponsorData.name.trim());
      }
      
      if (sponsorData.status) {
        formData.append("status", sponsorData.status.toUpperCase());
      }
      
      if (newAvatar) {
        formData.append("logo", newAvatar);
      }

      // Debug FormData contents
      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // First, check if there's anything to update
      if (formData.entries().next().done) {
        toast({
          title: "No Changes",
          description: "No changes were made to update.",
        });
        return;
      }

      const response = await fetch(`http://10.11.10.13:3000/sponsor/${sponsorId}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update sponsor');
      }

      const updatedData = await response.json();
      console.log("Update response:", updatedData);

      toast({
        title: "Success",
        description: "Sponsor updated successfully",
      });

      setIsOpen(false);
      window.location.reload(); // Consider using a more elegant way to refresh data
      
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update sponsor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (!sponsorData) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-start gap-x-[10px] p-[5px] border-none h-auto w-full hover:bg-transparent"
        >
          <PenBox width={16} />
          <p>Update Sponsor</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] !rounded-[10px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Sponsor</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the sponsor's information here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={sponsorData.name}
              onChange={handleInputChange}
              className="rounded-[6px]"
              placeholder="Enter sponsor name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Logo</Label>
            <div className="flex items-center gap-4">
              {/* Show current logo if exists */}
              {sponsorData.logo && (
                <img
                  src={`http://10.11.10.13:3000/${sponsorData.logo}`}
                  alt="Current logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <Input
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                className="rounded-[6px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={handleSelectChange}
              value={sponsorData.status.toLowerCase()}
            >
              <SelectTrigger className="rounded-[6px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Sponsor"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default SponsorUpdate;
