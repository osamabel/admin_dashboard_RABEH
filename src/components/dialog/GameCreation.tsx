import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import {
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
  prizes: string[];
  licences: string;
  sponsors: Number[];
  quizFile: any[];
  startCondition: "PLAYERS" | "TIME";
  requiredPlayers?: number;
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
    startCondition: "TIME",
    requiredPlayers: undefined,
  });

  const handleModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as "PLAYERS" | "TIME";
    setFormData((prev) => ({
      ...prev,
      startCondition: mode,
      // Reset requiredPlayers when switching away from PLAYERS mode
      requiredPlayers: mode === "TIME" ? undefined : prev.requiredPlayers,
    }));
  };

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


  const addPrize = () => {
    setFormData((prevState) => ({
      ...prevState,
      prizes: [...prevState.prizes, ""],
    }));
  };

  const removePrize = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      prizes: prevState.prizes.filter((_, i) => i !== index),
    }));
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          Create new Game
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!rounded-[10px]">
        <AlertDialogTitle className="text-xl font-bold">
          Games Creation
        </AlertDialogTitle>
        <Card className="w-full flex flex-col gap-y-[40px] mx-auto border-none shadow-none">
          <CardContent className="p-0 ">
            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4"
            >
              <div className="flex flex-col gap-4">
                {/* Basic Game Information Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="gameName">Game Name</Label>
                      <Input
                        className="rounded-[6px]"
                        id="gameName"
                        name="gameName"
                        value={formData.gameName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="requiredDiamond">Required Diamond</Label>
                      <Input
                        className="rounded-[6px]"
                        id="requiredDiamond"
                        name="requiredDiamond"
                        value={formData.requiredDiamond}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Game Settings Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Game Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="startingDate">Starting Date & Time</Label>
                      <Input
                        className="rounded-[6px]"
                        id="startingDate"
                        name="startingDate"
                        type="datetime-local"
                        value={formData.startingDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="startCondition">Game Mode</Label>
                      <select
                        id="startCondition"
                        name="startCondition"
                        value={formData.startCondition}
                        onChange={handleModeChange}
                        className="w-full h-10 px-3 border rounded-[6px]"
                      >
                        <option value="TIME">Time-based</option>
                        <option value="PLAYERS">Players-based</option>
                      </select>
                    </div>
                    {formData.startCondition === "PLAYERS" && (
                      <div className="w-full">
                        <Label htmlFor="requiredPlayers">
                          Required Players
                        </Label>
                        <Input
                          className="rounded-[6px]"
                          id="requiredPlayers"
                          name="requiredPlayers"
                          type="number"
                          min="1"
                          value={formData.requiredPlayers || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              requiredPlayers: isNaN(value) ? undefined : value,
                            }));
                          }}
                          placeholder="Enter number of players"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Prizes</h3>
                    <Button
                      type="button"
                      onClick={addPrize}
                      variant="outline"
                      size="sm"
                      className="rounded-[6px]"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Prize
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.prizes.map((prize, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Label htmlFor={`prize${index + 1}`}>
                            Prize {index + 1}
                          </Label>
                          <Input
                            className="rounded-[6px]"
                            id={`prize${index + 1}`}
                            value={prize}
                            onChange={(e) =>
                              handlePrizeChange(index, e.target.value)
                            }
                          />
                        </div>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-6"
                            onClick={() => removePrize(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* License Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">License</h3>
                  <div className="w-full">
                    <Label htmlFor="licences">License Key</Label>
                    <Input
                      className="rounded-[6px]"
                      id="licences"
                      name="licences"
                      value={formData.licences}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Sponsors Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Sponsors</h3>
                  <div className="w-full">
                    <div className="flex gap-2">
                      <select
                        id="sponsors"
                        value={currentSelection}
                        onChange={handleSponsorSelect}
                        className="flex-grow h-10 px-3 border rounded-[6px]"
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
                    {selectedSponsorIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSponsorIds.map((id) => {
                          const sponsor = sponsors.find((s) => s.id === id);
                          return sponsor ? (
                            <div
                              key={id}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center"
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

                {/* Quiz File Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Quiz File</h3>
                  <div className="w-full">
                    <Label htmlFor="quizFileUpload">
                      Upload Quiz JSON File
                    </Label>
                    <Input
                      className="rounded-[6px]"
                      id="quizFileUpload"
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
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
