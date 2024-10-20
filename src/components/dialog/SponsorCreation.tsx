import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface SponsorData {
  name: string;
  status: "active" | "inactive" | "rejected";
  avatar: File | null;
}

const SponsorCreation = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
    status: "inactive",
    avatar: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: "active" | "inactive" | "rejected") => {
    setSponsorData((prev) => ({ ...prev, status: value }));
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
      formData.append("status", sponsorData.status);
      if (sponsorData.avatar) {
        formData.append("avatar", sponsorData.avatar);
      }

      const response = await axios.post("/sponsor/creation", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Sponsor Created",
        description: "Sponsor has been successfully created.",
      });

      setIsOpen(false);
      setSponsorData({ name: "", status: "inactive", avatar: null });
    } catch (error) {
      console.error("Error creating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to create sponsor. Please try again.",
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
            <Input className="rounded-[6px]"
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
                <AvatarImage src={sponsorData.avatar ? URL.createObjectURL(sponsorData.avatar) : undefined} />
                <AvatarFallback>{sponsorData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input className="rounded-[6px]" id="avatar" type="file" onChange={handleAvatarChange} accept="image/*" />
            </div>
          </div>
          <div className="space-y-2">
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
          </div>
          <DialogFooter>
            <Button className="rounded-[6px]" type="submit">Create Sponsor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorCreation;