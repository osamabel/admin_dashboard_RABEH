import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  id: string;
  name: string;
  status: "active" | "inactive" | "rejected";
  avatar: string | null;
}

interface SponsorUpdateProps {
  sponsorId: string;
}

const SponsorUpdate: React.FC<SponsorUpdateProps> = ({ sponsorId }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    id: "",
    name : "",
    avatar : "",
    status: "active"
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSponsorData();
    }
  }, [isOpen, sponsorId]);

  const fetchSponsorData = async () => {
    try {
      const response = await fetch(`/sponsor/${sponsorId}`);
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

    try {
      const formData = new FormData();
      formData.append("name", sponsorData.name);
      formData.append("status", sponsorData.status);
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      }

      const response = await fetch(`/sponsor/${sponsorId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update sponsor");
      }

      toast({
        title: "Sponsor Updated",
        description: "Sponsor information has been successfully updated.",
      });

      setIsOpen(false);
      //   onUpdate(); // Trigger refresh of sponsor list
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to update sponsor. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!sponsorData) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="lex items-center justify-start gap-x-[10px] p-[5px] border-none h-auto w-full hover:bg-transparent">
          <PenBox width={16}/>
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={
                    newAvatar
                      ? URL.createObjectURL(newAvatar)
                      : sponsorData.avatar || undefined
                  }
                />
                <AvatarFallback>{sponsorData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={handleSelectChange}
              value={sponsorData.status}
            >
              <SelectTrigger>
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
            <Button type="submit">Update Sponsor</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SponsorUpdate;
