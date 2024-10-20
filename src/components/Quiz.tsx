import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Copy, Trash2, AlertCircle, Download, Upload } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: Option[];
  time: number;
}

const QuizCreator: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      time: 60,
    },
  ]);
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        time: 60,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (
    questionIndex: number,
    field: string,
    value: string | number
  ) => {
    const newQuestions = [...questions];
    if (field === "question") {
      newQuestions[questionIndex].question = value as string;
    } else if (field === "time") {
      newQuestions[questionIndex].time = Math.max(
        1,
        parseInt(value as string) || 1
      );
    }
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newQuestions = [...questions];
    if (field === "text") {
      newQuestions[questionIndex].options[optionIndex].text = value as string;
    } else if (field === "isCorrect") {
      newQuestions[questionIndex].options[optionIndex].isCorrect =
        value as boolean;
    }
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const validateQuestions = (): boolean => {
    const newErrors: string[] = [];
    questions.forEach((q, qIndex) => {
      if (q.question.trim() === "") {
        newErrors.push(`Question ${qIndex + 1}: Question text is required.`);
      }
      if (q.options.length < 2) {
        newErrors.push(
          `Question ${qIndex + 1}: At least two options are required.`
        );
      }
      q.options.forEach((option, oIndex) => {
        if (option.text.trim() === "") {
          newErrors.push(
            `Question ${qIndex + 1}, Option ${
              oIndex + 1
            }: Option text is required.`
          );
        }
      });
      if (!q.options.some((option) => option.isCorrect)) {
        newErrors.push(
          `Question ${
            qIndex + 1
          }: At least one correct answer must be selected.`
        );
      }
      if (q.time < 1) {
        newErrors.push(
          `Question ${qIndex + 1}: Time must be at least 1 second.`
        );
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const generateJSON = () => {
    if (validateQuestions()) {
      const jsonData = JSON.stringify(questions, null, 2);
      setJsonOutput(jsonData);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      alert("JSON copied to clipboard!");
    });
  };
  const downloadJSON = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJSONEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonOutput(e.target.value);
  };

  const applyJSONChanges = () => {
    try {
      const parsedQuestions = JSON.parse(jsonOutput);
      setQuestions(parsedQuestions);
      setErrors([]);
    } catch (error) {
      setErrors(["Invalid JSON format. Please check your input."]);
    }
  };
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonContent = event.target?.result as string;
          const parsedQuestions = JSON.parse(jsonContent);
          setQuestions(parsedQuestions);
          setJsonOutput(JSON.stringify(parsedQuestions, null, 2));
          setErrors([]);
        } catch (error) {
          setErrors(["Invalid JSON file. Please check the file content."]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 mx-auto h-full overflow-auto w-full flex gap-x-[40px]">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">
          Quiz Creator (Required Fields)
        </h1>
        <div className="h-[80vh] overflow-auto">
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Question {qIndex + 1}</h2>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeQuestion(qIndex)}
                  className="rounded-[6px]"
                >
                  <Trash2 className="h-4 w-4 " />
                </Button>
              </div>
              <Textarea
                value={q.question}
                onChange={(e) =>
                  updateQuestion(qIndex, "question", e.target.value)
                }
                placeholder="Enter question (required)"
                className="mb-2 rounded-[6px]"
              />
              <div className="mb-2">
                <label
                  htmlFor={`time-${qIndex}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Time Allowed (seconds):
                </label>
                <Input
                  id={`time-${qIndex}`}
                  type="number"
                  value={q.time}
                  onChange={(e) =>
                    updateQuestion(qIndex, "time", e.target.value)
                  }
                  min="1"
                  className="mt-1 rounded-[6px]"
                />
              </div>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, "text", e.target.value)
                    }
                    placeholder={`Option ${oIndex + 1} (required)`}
                    className="flex-grow mr-2 rounded-[6px]"
                  />
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) =>
                      updateOption(qIndex, oIndex, "isCorrect", checked)
                    }
                    className="mr-2 rounded-[6px]"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(qIndex, oIndex)}
                    disabled={q.options.length <= 2}
                    className="rounded-[6px]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => addOption(qIndex)} className="mt-2 rounded-[6px]">
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-4">
          <Button onClick={addQuestion} className="rounded-[6px]">
            <Plus className="mr-2 h-4 w-4 " /> Add Question
          </Button>
          <Button className="rounded-[6px]" onClick={generateJSON}>Generate JSON</Button>
        </div>
      </div>
      <div className="flex-1 border h-full">
        {jsonOutput && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Generated JSON</h2>
            <div className="relative">
              <Textarea
                value={jsonOutput}
                onChange={handleJSONEdit}
                className="h-[60vh] font-mono text-sm"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button className="rounded-[6px]" onClick={copyToClipboard} size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button className="rounded-[6px]" onClick={downloadJSON} size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={applyJSONChanges} className="mt-2 rounded-[6px]">
              Apply JSON Changes
            </Button>
          </div>
        )}
        <div className="mt-4">
          <input
            type="file"
            accept=".json"
            onChange={importJSON}
            ref={fileInputRef}
            className="hidden rounded-[6px]"
          />
          <Button className="rounded-[6px]" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
