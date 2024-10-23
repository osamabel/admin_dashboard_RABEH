import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Copy } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  gender: string;
  dob: string;
  country: string;
  city: string;
  type: string;
  avatar: File | null;
  isDisabled: boolean;
  initialCoins: number;
  initialDiamonds: number;
}

interface ApiResponse {
  message: string;
  user: {
    email: string;
    password: string;
  };
}
interface UserCreationProps {
  onSuccess?: () => void;
}
const CopyButton = ({ credentialsString }: { credentialsString: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(credentialsString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [credentialsString]);

  return (
    <Button
      className="rounded-[6px] flex items-center gap-x-[7px]"
      onClick={handleCopy}
    >
      {isCopied ? (
        <Check width={16} className="text-green-500" />
      ) : (
        <Copy width={16} />
      )}
      <p>{isCopied ? "Copied!" : "Copy Credentials"}</p>
    </Button>
  );
};

const ToastContent = ({ response, credentialsString }: { response: ApiResponse; credentialsString: string }) => (
  <div className="flex flex-col justify-end gap-y-[20px]">
    <h2 className="text-[20px]">{response.message}</h2>
    <div>
      <p>
        <strong>Email:</strong> {response.user.email}
      </p>
      <p>
        <strong>Password:</strong> {response.user.password}
      </p>
    </div>
    <div className="w-full flex justify-start">
      <CopyButton credentialsString={credentialsString} />
    </div>
  </div>
);

const UserCreation = ({ onSuccess }: UserCreationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    role: "USER",
    gender: "",
    dob: "",
    country: "",
    city: "",
    type: "NORMAL",
    avatar: null,
    isDisabled: false,
    initialCoins: 0,
    initialDiamonds: 0,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDisabled: checked,
      type: checked ? "SPECIAL" : "NORMAL",
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "avatar" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value !== "object") {
          formDataToSend.append(key, String(value));
        }
      });
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      // Make the API call
      const response = await fetch("http://10.13.8.4:3000/user/createUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: formDataToSend,
      });
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      // Create credentials string for copying
      const credentialsString = `Email: ${data.user.email}\nPassword: ${data.user.password}`;
      
      // Show success toast
      toast({
        description: <ToastContent response={data} credentialsString={credentialsString} />,
        duration: 5000,
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        role: "USER",
        gender: "",
        dob: "",
        country: "",
        city: "",
        type: "NORMAL",
        avatar: null,
        isDisabled: false,
        initialCoins: 0,
        initialDiamonds: 0,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          Create new User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl !rounded-[10px]">
        <AlertDialogTitle className="text-2xl font-bold">
          User Creation
        </AlertDialogTitle>
        <Card className="w-full border-none shadow-none">
          <CardHeader className="p-0">
            <AlertDialogDescription>Create a new User</AlertDialogDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    className="rounded-[6px]"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="rounded-[6px]"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    className="rounded-[6px]"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    className="rounded-[6px]"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    className="rounded-[6px]"
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    className="rounded-[6px]"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    className="rounded-[6px]"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    className="rounded-[6px]"
                    id="avatar"
                    name="avatar"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isDisabled">Special User</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isDisabled"
                      checked={formData.isDisabled}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isDisabled">
                      {formData.isDisabled ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
                {formData.isDisabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="initialCoins">Initial Coins</Label>
                      <Input
                        className="rounded-[6px]"
                        id="initialCoins"
                        name="initialCoins"
                        type="number"
                        value={formData.initialCoins}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialDiamonds">Initial Diamonds</Label>
                      <Input
                        className="rounded-[6px]"
                        id="initialDiamonds"
                        name="initialDiamonds"
                        type="number"
                        value={formData.initialDiamonds}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-[10px]" disabled={isLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  className="rounded-[10px] bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserCreation;