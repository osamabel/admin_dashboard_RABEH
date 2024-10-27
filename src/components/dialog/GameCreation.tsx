import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
const apiUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

interface FormData {
  gameName: string;
  requiredDiamond: string;
  startingDate: string;
  // endingDate: string;
  prizes: string[];
  licences: string;
  sponsors: Number[];
  quizFile: any[];
}

const GameCration: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsorIds, setSelectedSponsorIds] = useState<number[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    gameName: "",
    requiredDiamond: "",
    startingDate: "",
    prizes: ["", "", ""],
    licences: "",
    sponsors: [],
    quizFile: [],
  });

  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}:${apiPort}/sponsor`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast({
        title: "Error",
        description: "Failed to load sponsors. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    fetchSponsors();
  }, []);

  const toggleSponsor = (sponsorId: number) => {
    setSelectedSponsorIds((prevIds) => {
      const newSelectedIds = prevIds.includes(sponsorId)
        ? prevIds.filter((id) => id !== sponsorId)
        : [...prevIds, sponsorId];

      setFormData((prevState) => ({
        ...prevState,
        sponsors: newSelectedIds,
      }));

      return newSelectedIds;
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePrizeChange = (index: number, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      prizes: prevState.prizes.map((prize, i) => (i === index ? value : prize)),
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsedContent = JSON.parse(content);

          if (!Array.isArray(parsedContent)) {
            throw new Error("The JSON content is not an array");
          }

          // Validate the structure of each question
          const isValidQuizFormat = parsedContent.every(
            (question: any) =>
              typeof question.question === "string" &&
              Array.isArray(question.options) &&
              typeof question.time === "number" &&
              question.options.every(
                (option: any) =>
                  typeof option.text === "string" &&
                  typeof option.isCorrect === "boolean"
              )
          );

          if (!isValidQuizFormat) {
            throw new Error("Invalid quiz question format");
          }

          setFormData((prevState) => ({
            ...prevState,
            quizFile: parsedContent,
          }));

          toast({
            title: "Success",
            description: "Quiz file uploaded successfully",
            variant: "default",
          });
        } catch (error) {
          console.error("Error parsing quiz file:", error);
          toast({
            title: "Error",
            description:
              "Invalid quiz file format. Please check the file structure.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !formData.gameName ||
        !formData.startingDate ||
        !formData.requiredDiamond
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate quiz file
      if (formData.quizFile.length === 0) {
        throw new Error("Please upload a quiz file");
      }

      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Prepare the request body
      const requestBody = {
        ...formData,
        requiredDiamond: parseInt(formData.requiredDiamond, 10),
        prizes: formData.prizes.filter((prize) => prize !== ""), // Remove empty prizes
      };

      const response = await fetch(`${apiUrl}:${apiPort}/game/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create the game");
      }

      toast({
        title: "Success",
        description: "Game created successfully",
        variant: "default",
      });

      // Reset form or redirect
      window.location.reload();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [currentSelection, setCurrentSelection] = useState<string>("");

  const handleSponsorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSelection(event.target.value);
  };

  const addSelectedSponsor = () => {
    const sponsorId = Number(currentSelection);
    if (sponsorId && !selectedSponsorIds.includes(sponsorId)) {
      setSelectedSponsorIds((prevIds) => [...prevIds, sponsorId]);
      setFormData((prevState) => ({
        ...prevState,
        sponsors: [...prevState.sponsors, sponsorId],
      }));
      setCurrentSelection("");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          Create new Game
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px] h-[100vh]">
        <AlertDialogTitle className="text-xl font-bold">
          Games Creation
        </AlertDialogTitle>
        <Card className="w-full flex flex-col gap-y-[40px] mx-auto border-none shadow-none">
          <CardHeader className="p-0">
            {/* <CardTitle className="text-2xl font-bold">Games Creation</CardTitle> */}
            <AlertDialogDescription className="text-sm">
              Create a new Quiz Game
            </AlertDialogDescription>
          </CardHeader>
          <CardContent className="p-0 ">
            <form onSubmit={handleSubmit} className="">
              <div className="grid grid-cols-2 gap-2 mb-[60px]">
                <div className="">
                  <Label htmlFor="gameName">Games Name</Label>
                  <Input
                    className="rounded-[6px]"
                    id="gameName"
                    name="gameName"
                    value={formData.gameName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <Label htmlFor="requiredDiamond">
                    Required Diamond to play
                  </Label>
                  <Input
                    className="rounded-[6px]"
                    id="requiredDiamond"
                    name="requiredDiamond"
                    value={formData.requiredDiamond}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <Label htmlFor="startingDate">Starting date and time</Label>
                  <Input
                    className="rounded-[6px]"
                    id="startingDate"
                    name="startingDate"
                    type="datetime-local"
                    value={formData.startingDate}
                    onChange={handleInputChange}
                  />
                </div>

                {/* <div className="">
                  <Label htmlFor="endingDate">Ending date</Label>
                  <Input
                    className="rounded-[6px]"
                    id="endingDate"
                    name="endingDate"
                    type="date"
                    value={formData.endingDate}
                    onChange={handleInputChange}
                  />
                </div> */}
                <br />
                {formData.prizes.map((prize, index) => (
                  <div key={index} className="">
                    <Label htmlFor={`prize${index + 1}`}>
                      prize {index + 1}
                    </Label>
                    <Input
                      className="rounded-[6px]"
                      id={`prize${index + 1}`}
                      value={prize}
                      onChange={(e) => handlePrizeChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <br />
                <div className="">
                  <Label htmlFor="licences">Licences</Label>
                  <Input
                    className="rounded-[6px] "
                    id="licences"
                    name="licences"
                    value={formData.licences}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 w-full flex flex-col gap-y-[10px]">
                  <div className="mt-4 w-full">
                    <Label htmlFor="sponsors">Select Sponsors</Label>
                    <div className="flex gap-2 mt-1">
                      <select
                        id="sponsors"
                        value={currentSelection}
                        onChange={handleSponsorSelect}
                        className="flex-grow p-2 border rounded-[6px]"
                      >
                        <option value="">Select a sponsor...</option>
                        {sponsors.map((sponsor) => (
                          <option
                            key={sponsor.id}
                            value={sponsor.id}
                            disabled={selectedSponsorIds.includes(sponsor.id)}
                          >
                            {sponsor.name}{" "}
                            {selectedSponsorIds.includes(sponsor.id)
                              ? "(Selected)"
                              : ""}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={addSelectedSponsor}
                        disabled={!currentSelection}
                        className="px-3 rounded-[6px]"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="w-full">
                    {selectedSponsorIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSponsorIds.map((id) => {
                          const sponsor = sponsors.find((s) => s.id === id);
                          return sponsor ? (
                            <div
                              key={id}
                              className="bg-black/5 border flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                            >
                              {sponsor.name}
                              <button
                                onClick={() => toggleSponsor(id)}
                                className="ml-1 text-secondary-foreground/50 hover:text-secondary-foreground"
                              >
                                <X width={14} />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mt-[100px]">
                <Label htmlFor="quizFileUpload">Upload Quiz JSON File</Label>
                <Input
                  className="rounded-[6px]"
                  id="quizFileUpload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </div>
            </form>
          </CardContent>
        </Card>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[10px]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleSubmit(e as any)}
            className="rounded-[10px] bg-green-600 hover:bg-green-700"
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameCration;
