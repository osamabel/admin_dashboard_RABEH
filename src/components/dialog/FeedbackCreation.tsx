import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const apiUrl = import.meta.env.VITE_API_URL;


interface Question {
  questionText: string;
  type: "RATING" | "YES_NO" | "MULTIPLE_CHOICE" | "TEXT";
  required: boolean;
  order: number;
  options?: string[];
}

interface FeedbackForm {
  sponsorId: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Props {
  onSuccess?: () => void;
}

export const FeedbackCreationDialog: React.FC<Props> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeedbackForm>({
    sponsorId: 0,
    title: "",
    description: "",
    questions: [],
  });

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          type: "TEXT",
          required: true,
          order: prev.questions.length + 1,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({
        ...q,
        order: i + 1,
      })),
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, ...updates } : q
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${apiUrl}/sponsor-forms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create feedback form");

      toast({
        title: "Success",
        description: "Feedback form created successfully",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create feedback form",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-[6px]" variant="default">
          Create Feedback Form
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="sponsorId">Sponsor</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          sponsorId: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="rounded-[6px]">
                        <SelectValue placeholder="Select a sponsor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sponsor 1</SelectItem>
                        <SelectItem value="2">Sponsor 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      className="rounded-[6px]"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      className="rounded-[6px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Questions</h3>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    variant="outline"
                    className="rounded-[6px]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {formData.questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-[6px] space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label>Question Text</Label>
                          <Textarea
                            value={question.questionText}
                            onChange={(e) =>
                              updateQuestion(index, {
                                questionText: e.target.value,
                              })
                            }
                            className="rounded-[6px]"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label>Question Type</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value: Question["type"]) =>
                                updateQuestion(index, { type: value })
                              }
                            >
                              <SelectTrigger className="rounded-[6px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RATING">Rating</SelectItem>
                                <SelectItem value="YES_NO">Yes/No</SelectItem>
                                <SelectItem value="MULTIPLE_CHOICE">
                                  Multiple Choice
                                </SelectItem>
                                <SelectItem value="TEXT">Text</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2 mt-8">
                            <Label>Required</Label>
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) =>
                                updateQuestion(index, {
                                  required: e.target.checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        {question.type === "MULTIPLE_CHOICE" && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            {question.options?.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex gap-2 items-center"
                              >
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [
                                      ...(question.options || []),
                                    ];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(index, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="rounded-[6px]"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = question.options?.filter(
                                      (_, i) => i !== optionIndex
                                    );
                                    updateQuestion(index, {
                                      options: newOptions,
                                    });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newOptions = [
                                  ...(question.options || []),
                                  "",
                                ];
                                updateQuestion(index, { options: newOptions });
                              }}
                            >
                              Add Option
                            </Button>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[6px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="rounded-[6px] bg-green-600 hover:bg-green-700"
            >
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};