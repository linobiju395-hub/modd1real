
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Trophy, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { QUIZ_ONE } from '../constants';
import { playSound } from './SoundUtils';

const STORAGE_KEY = 'cq_quiz_progress';

const Quiz: React.FC = () => {
  // Initialize state from localStorage if available
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).currentQuestion || 0;
    return 0;
  });
  
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).score || 0;
    return 0;
  });

  const [showResult, setShowResult] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).showResult || false;
    return false;
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.selectedOption !== undefined ? parsed.selectedOption : null;
    }
    return null;
  });

  const [isAnswered, setIsAnswered] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).isAnswered || false;
    return false;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    const progress = {
      currentQuestion,
      score,
      showResult,
      selectedOption,
      isAnswered
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [currentQuestion, score, showResult, selectedOption, isAnswered]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === QUIZ_ONE[currentQuestion].correctAnswer) {
      setScore(score + 1);
      playSound('success');
    } else {
      playSound('click');
    }
  };

  const handleNext = () => {
    playSound('pop');
    if (currentQuestion < QUIZ_ONE.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    playSound('pop');
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (showResult) {
    const passed = score >= QUIZ_ONE.length / 2;
    return (
      <div className="bg-white p-8 rounded-[40px] shadow-xl text-center max-w-lg mx-auto border-b-[10px] border-yellow-400 animate-fadeIn my-4">
        <div className="flex justify-center mb-6">
          <div className={`p-6 rounded-full shadow-inner ${passed ? 'bg-yellow-100 text-yellow-500' : 'bg-red-100 text-red-500'}`}>
            {passed ? <Trophy size={80} /> : <RotateCcw size={80} />}
          </div>
        </div>
        <h2 className="text-4xl font-black text-gray-800 mb-2">
          {passed ? "Great Work!" : "Try Again!"}
        </h2>
        <p className="text-gray-500 text-xl mb-8 font-medium">
          You got <span className="font-black text-blue-500">{score}</span> / <span className="font-black text-blue-500">{QUIZ_ONE.length}</span>!
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={restart}
            className="bg-blue-500 text-white py-5 rounded-[25px] font-black text-xl hover:bg-blue-600 shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            <RotateCcw size={24} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_ONE[currentQuestion];

  return (
    <div className="max-w-xl mx-auto px-2 h-full flex flex-col justify-center">
      <div className="bg-white p-8 sm:p-10 rounded-[45px] shadow-xl border-b-[8px] border-blue-200 relative overflow-hidden flex flex-col shrink-0 max-h-full">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
           <div 
             className="h-full bg-blue-500 transition-all duration-500" 
             style={{ width: `${((currentQuestion + (isAnswered ? 1 : 0)) / QUIZ_ONE.length) * 100}%` }} 
           />
        </div>

        <div className="flex justify-between items-center mb-8 pt-2">
          <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm">
            Q {currentQuestion + 1} / {QUIZ_ONE.length}
          </span>
          <div className="flex gap-1.5">
            {QUIZ_ONE.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${i < currentQuestion ? 'bg-green-400 scale-90' : i === currentQuestion ? 'bg-blue-500 scale-125' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-black text-gray-800 mb-8 leading-tight">{question.question}</h3>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
          {question.options.map((option, index) => {
            let color = "bg-gray-50 border-gray-100 text-gray-700 hover:border-blue-400 hover:bg-white hover:-translate-y-0.5 shadow-sm";
            if (isAnswered) {
              if (index === question.correctAnswer) color = "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-50 scale-[1.01] shadow-md";
              else if (selectedOption === index) color = "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-50 scale-[0.99] opacity-80";
              else color = "bg-gray-50 border-gray-50 text-gray-300 grayscale opacity-40 scale-95";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={`p-5 rounded-[25px] border-[3px] text-left font-black text-lg transition-all flex justify-between items-center ${color}`}
              >
                <span className="flex-1">{option}</span>
                {isAnswered && index === question.correctAnswer && <CheckCircle2 className="text-green-600 shrink-0" size={24} strokeWidth={3} />}
                {isAnswered && selectedOption === index && index !== question.correctAnswer && <XCircle className="text-red-600 shrink-0" size={24} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button 
            onClick={handleNext}
            className="mt-8 w-full bg-blue-500 text-white py-5 rounded-[25px] font-black text-xl hover:bg-blue-600 shadow-lg flex items-center justify-center gap-2 animate-bounce border-b-[6px] border-blue-700 active:translate-y-0.5 active:border-b-0 shrink-0"
          >
            {currentQuestion === QUIZ_ONE.length - 1 ? "Finish!" : "Next"}
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        )}
      </div>
      
      <p className="text-center mt-4 text-gray-300 font-bold text-xs italic">
        "Keep going, you're doing great! 🌟"
      </p>
    </div>
  );
};

export default Quiz;
