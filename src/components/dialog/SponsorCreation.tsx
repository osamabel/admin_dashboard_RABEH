import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface SponsorData {
  name: string;
  avatar: File | null;
}

const SponsorCreation = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
    avatar: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSponsorData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", sponsorData.name);
      if (sponsorData.avatar) {
        formData.append("logo", sponsorData.avatar);
      }

      // Get token from localStorage or wherever you store it
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Log FormData contents for debugging

      const response = await fetch("https://145.223.117.65:3000/sponsor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success response:", data);

      toast({
        title: "Sponsor Created",
        description: "Sponsor has been successfully created.",
      });

      setIsOpen(false);
      setSponsorData({ name: "", avatar: null });
      window.location.reload();
    } catch (error) {
      console.error("Error creating sponsor:", error);

      // More specific error handling
      let errorMessage = "Failed to create sponsor. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.message.includes("413")) {
          errorMessage = "File size too large. Please choose a smaller image.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          Create Sponsor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sponsor</DialogTitle>
          <DialogDescription>
            Enter the sponsor's information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="rounded-[6px]"
              id="name"
              name="name"
              value={sponsorData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={
                    sponsorData.avatar
                      ? URL.createObjectURL(sponsorData.avatar)
                      : undefined
                  }
                />
                <AvatarFallback>{sponsorData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                className="rounded-[6px]"
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={handleSelectChange} value={sponsorData.status}>
              <SelectTrigger className="rounded-[6px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <DialogFooter>
            <Button className="rounded-[6px]" type="submit">
              Create Sponsor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorCreation;
