import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { motion, useInView } from "framer-motion";
import { FormData } from "./GameCreation";

type GameState = "welcome" | "playing" | "result";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: Option[];
  time: number;
}

function Simulation({ formData }: { formData: FormData }) {
  const phoneSimulation = useRef<HTMLDivElement>(null);
  const isVisible = useInView(phoneSimulation, { once: true, amount: 0.3 });
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timerActive, setTimerActive] = useState(false); // Add this new state

  useEffect(() => {
    if (gameState === "playing" && timer > 0 && timerActive) {
      // Add timerActive condition
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [gameState, timer, timerActive]); // Add timerActive to dependencies

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setTimer(formData.quizFile[0].time);
    setScore(0);
    setShowAnswers(false);
    setSelectedOptions([]);
    setTimerActive(true); // Start timer when game starts
  };

  const handleOptionSelect = (index: number) => {
    if (!showAnswers) {
      setSelectedOptions((prev) => {
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        } else {
          return [...prev, index];
        }
      });
    }
  };
  const verifyAnswer = () => {
    if (selectedOptions.length > 0) {
      setShowAnswers(true);
      setTimerActive(false); // Stop timer on verify
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < formData.quizFile.length - 1) {
      // Check if all selected answers are correct and no correct answers were missed
      const currentQuiz = formData.quizFile[currentQuestion];
      const correctAnswers = currentQuiz.options
        .map((option: Option, index: number) => ({
          isCorrect: option.isCorrect,
          index,
        }))
        .filter((option: Option) => option.isCorrect);
      // .map((option: Option) => option.index);

      const isAllCorrect =
        selectedOptions.length === correctAnswers.length &&
        selectedOptions.every(
          (selected) => currentQuiz.options[selected].isCorrect
        );

      if (isAllCorrect) {
        setScore((prev) => prev + 1);
      }

      setCurrentQuestion((prev) => prev + 1);
      setTimer(formData.quizFile[currentQuestion + 1].time);
      setSelectedOptions([]);
      setShowAnswers(false);
      setTimerActive(true); // Restart timer for next question
    } else {
      setGameState("result");
    }
  };

  const retryGame = () => {
    setGameState("welcome");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOptions([]);
    setShowAnswers(false);
    setTimerActive(false); // Reset timer state
  };

  const getOptionStyle = (option: Option, index: number) => {
    if (!showAnswers) {
      return selectedOptions.includes(index) ? "bg-blue-100" : "bg-[#F9F9F9]";
    }

    if (option.isCorrect) {
      return "bg-green-100 border-green-500";
    }

    if (selectedOptions.includes(index) && !option.isCorrect) {
      return "bg-red-100 border-red-500";
    }

    return "bg-[#F9F9F9]";
  };

  const renderGameContent = () => {
    switch (gameState) {
      case "welcome":
        return (
          <div className="flex flex-col items-center justify-center h-full text-white w-full">
            <div className="w-full max-w-xs bg-gradient-to-t from-[#DFB334] to-[#EAB040] rounded-[30px] p-6 text-center space-y-8">
              <h1 className="text-2xl font-bold">{formData.gameName}</h1>
              <div className="flex items-center justify-center gap-2">
                <span>مطلوبة</span>
                <span>{formData.requiredDiamond}</span>
                <img src="/coin.svg" alt="" />
              </div>
              <Button
                onClick={startGame}
                className="w-full bg-white text-yellow-500 hover:bg-white/90 rounded-[30px]"
              >
                ابدأ
              </Button>
            </div>
          </div>
        );

      case "playing":
        const currentQuiz: QuizQuestion = formData.quizFile[currentQuestion];
        return (
          <div className="flex flex-col h-full text-white space-y-4 py-6 w-full">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                {timer}
              </div>
            </div>
            <div className="flex-1 flex flex-col space-y-4">
              <h2 className="text-xl text-[#434343]">{currentQuiz.question}</h2>
              <div className="space-y-3">
                {currentQuiz.options.map((option: Option, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showAnswers}
                    className={`w-full flex justify-between p-3 text-left ${getOptionStyle(
                      option,
                      index
                    )} 
                    text-[#434343] rounded-full transition-colors duration-200`}
                  >
                    <div>{option.text}</div>
                    <div
                      className={`  h-[25px] w-[25px] rounded-full flex items-center justify-center 
                    
                    ${showAnswers ? "" : "border-[2px] border-[#b2b2b2]"} `}
                    >
                      {selectedOptions.includes(index) && (
                        <div
                          className={`h-[10px] w-[10px] rounded-full 
                          ${showAnswers ? "" : "bg-[#b2b2b2]"}
                          `}
                        ></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={showAnswers ? nextQuestion : verifyAnswer}
              disabled={selectedOptions.length === 0}
              className={`w-full hover:opacity-90 disabled:opacity-50 rounded-full
                ${
                  showAnswers
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-[#EAB040] hover:bg-[#DFB334]"
                }`}
            >
              {showAnswers ? "التالي" : "Verify"}
            </Button>
          </div>
        );

      case "result":
        return (
          <div className="flex flex-col items-center justify-center h-full text-white space-y-6 w-full">
            {/* <div className="text-6xl">😊</div> */}
            <p className="text-xl">
              Score: {score}/{formData.quizFile.length}
            </p>
            <Button
              onClick={retryGame}
              className="w-full max-w-xs bg-[#EAB040] hover:bg-[#DFB334] rounded-full"
            >
              إعادة المحاولة
            </Button>
          </div>
        );
    }
  };

  return (
    <Card
      ref={phoneSimulation}
      className="w-full mx-auto border-none shadow-none overflow-hidden h-[80vh]"
    >
      <CardContent className="p-0 h-full w-[85%] mx-auto overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 500 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="h-full w-full absolute bottom-[-10%] flex justify-center"
        >
          <img
            className="absolute object-contain z-[10]"
            src="/phone.png"
            alt=""
          />
          <div className="absolute w-full h-full p-[10px] z-0">
            <div className="relative w-full h-full rounded-[50px] bg-[#1E1E1E]"></div>
          </div>

          <div className="w-full h-full p-[10px] z-[100]">
            <div className="w-full h-full p-[10px]">
              <div className="w-full h-full overflow-hidden flex flex-col justify-between px-[20px]">
                <div className="w-full min-h-[30%] flex items-center justify-center">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img src="/admin.png" alt="" />
                    <p className="text-white">admin</p>
                  </div>
                </div>
                <div className="h-full flex items-end px-[20px] bg-white rounded-t-[30px]">
                  {renderGameContent()}
                </div>
                <div className="h-[10%] min-h-[calc(10%-20px)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default Simulation;
