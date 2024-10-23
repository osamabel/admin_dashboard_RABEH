import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { PenBox } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  city: string;
  avatar: string | null;
  type: "NORMAL" | "SPECIAL";
}

interface UpdateUserProps {
  userId: any;
}

const UpdateUser = React.forwardRef<HTMLDivElement, UpdateUserProps>(
  ({ userId }, ref) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
      // Fetch user data when the dialog opens
      if (isOpen) {
        fetchUserData(userId);
      }
    }, [isOpen, userId]);

  const fetchUserData = async (id: string) => {
    // Mock data - replace with actual API call
    const mockUserData: UserData = {
      id,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      gender: "Male",
      dateOfBirth: "1990-01-01",
      country: "USA",
      city: "New York",
      avatar: null,
      type: "NORMAL",
    };

    setUserData(mockUserData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle avatar upload if a new file was selected
      if (avatarFile) {
        // In a real application, you would upload the file to your server or a file storage service
        console.log("Uploading avatar:", avatarFile.name);
      }

      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div ref={ref}>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-start gap-x-[10px] p-[5px] border-none h-auto w-full hover:bg-transparent"
        >
          <PenBox width={16} />
          <p>Update User</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="!rounded-[10px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Make changes to the user's information here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        {userData && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col gap-y-[30px]"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    className="rounded-[6px]"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    className="rounded-[6px]"
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    className="rounded-[6px]"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  value={userData.gender}
                >
                  <SelectTrigger className="rounded-[6px]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                    className="rounded-[6px]"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={userData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                    className="rounded-[6px]"
                  id="country"
                  name="country"
                  value={userData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                    className="rounded-[6px]"
                  id="city"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">User Type</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("type", value as "NORMAL" | "SPECIAL")
                  }
                  value={userData.type}
                >
                  <SelectTrigger className="rounded-[6px]">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="SPECIAL">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={userData.avatar || undefined} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
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
            </div>
            <DialogFooter>
              <Button className="rounded-[6px]" type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
    </div>

  );
});

export default UpdateUser;
