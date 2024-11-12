import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DistributionItem {
  rating: number;
  count: number;
}
const apiUrl = import.meta.env.VITE_API_URL;

interface QuestionAnalytics {
  questionId: number;
  questionText: string;
  type: "RATING" | "YES_NO" | "MULTIPLE_CHOICE" | "TEXT";
  totalResponses: number;
  averageRating?: number;
  distribution?: DistributionItem[];
  yesPercentage?: number;
  noPercentage?: number;
  optionCounts?: Record<string, number>;
  averageLength?: number;
}

interface FeedbackAnalytics {
  formId: number;
  totalResponses: number;
  averageRating: number | null;
  questionAnalytics: QuestionAnalytics[];
  responseRate: number;
  trends: {
    date: string;
    averageRating: number;
    responseCount: number;
  }[];
}

interface Props {
  feedbackId: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const FeedbackAnalyticsDialog: React.FC<Props> = ({ feedbackId }) => {
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${apiUrl}/sponsor-forms/${feedbackId}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback analytics",
        variant: "destructive",
      });
    }
  };

  const renderRatingDistribution = (distribution?: DistributionItem[]) => {
    if (!distribution) return null;
    
    return (
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}${entry}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderYesNoDistribution = (yesPercentage?: number, noPercentage?: number) => {
    if (typeof yesPercentage !== 'number' || typeof noPercentage !== 'number') return null;

    const data = [
      { name: 'Yes', value: yesPercentage },
      { name: 'No', value: noPercentage },
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Yes</p>
            <p className="text-2xl font-semibold text-green-700">{yesPercentage}%</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">No</p>
            <p className="text-2xl font-semibold text-red-700">{noPercentage}%</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}${entry}`} fill={index === 0 ? '#4ade80' : '#f87171'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMultipleChoice = (optionCounts?: Record<string, number>) => {
    if (!optionCounts) return null;

    const data = Object.entries(optionCounts).map(([option, count]) => ({
      option,
      count,
    }));

    return (
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="option" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTextAnalytics = (totalResponses: number, averageLength?: number) => {
    return (
      <div className="space-y-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex flex-col items-center">
            <p className="text-sm text-blue-600">Average Response Length</p>
            <p className="text-2xl font-semibold text-blue-700">
              {averageLength?.toFixed(0) || 0} characters
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Total responses: {totalResponses}
        </p>
      </div>
    );
  };

  const renderQuestionAnalytics = (question: QuestionAnalytics) => {
    switch (question.type) {
      case "RATING":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex flex-col items-center">
                <p className="text-sm text-purple-600">Average Rating</p>
                <p className="text-2xl font-semibold text-purple-700">
                  {question.averageRating?.toFixed(1) || "N/A"}
                </p>
              </div>
            </div>
            {renderRatingDistribution(question.distribution)}
          </div>
        );

      case "YES_NO":
        return renderYesNoDistribution(question.yesPercentage, question.noPercentage);

      case "MULTIPLE_CHOICE":
        return renderMultipleChoice(question.optionCounts);

      case "TEXT":
        return renderTextAnalytics(question.totalResponses, question.averageLength);

      default:
        return null;
    }
  };

  const NoDataAlert = () => (
    <Alert className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>No Responses Yet</AlertTitle>
      <AlertDescription>
        This feedback form hasn't received any responses yet. Analytics will be available once users start responding.
      </AlertDescription>
    </Alert>
  );

  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0"
            onClick={() => {
              fetchAnalytics();
              setIsOpen(true);
            }}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Analytics</DialogTitle>
          </DialogHeader>
          
          {analytics && analytics.totalResponses === 0 ? (
            <NoDataAlert />
          ) : (
            analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-[6px]">
                    <h4 className="font-semibold">Total Responses</h4>
                    <p className="text-2xl">{analytics.totalResponses}</p>
                  </div>
                  <div className="p-4 border rounded-[6px]">
                    <h4 className="font-semibold">Average Rating</h4>
                    <p className="text-2xl">
                      {analytics.averageRating?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-[6px]">
                    <h4 className="font-semibold">Response Rate</h4>
                    <p className="text-2xl">{analytics.responseRate.toFixed(1)}%</p>
                  </div>
                </div>
  
                {analytics.trends.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Response Trends</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.trends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="averageRating"
                            stroke="#8884d8"
                            name="Average Rating"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="responseCount"
                            stroke="#82ca9d"
                            name="Response Count"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
  
                {analytics.questionAnalytics.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Question Analytics</h3>
                    {analytics.questionAnalytics.map((question) => (
                      <div
                        key={question.questionId}
                        className="p-4 border rounded-[6px] space-y-4"
                      >
                        <h4 className="font-semibold">{question.questionText}</h4>
                        {renderQuestionAnalytics(question)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    );
  };