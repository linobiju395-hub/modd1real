
import { Play, RotateCcw, Maximize, Trophy, ChevronRight, Sparkles, Puzzle, Check, Home, PartyPopper } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { SpriteState, PuzzleLevel } from '../types';
import { PUZZLES } from '../constants';
import { playSound } from './SoundUtils';

const CoordinatePuzzle: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = PUZZLES[currentLevelIdx];
  const [inputX, setInputX] = useState<string>("0");
  const [inputY, setInputY] = useState<string>("0");
  const [sprite, setSprite] = useState<SpriteState>({
    x: currentLevel.startX,
    y: currentLevel.startY,
    rotation: 0,
    costume: '', 
    visible: true
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>((() => {
    const saved = localStorage.getItem('cq_completed_levels');
    return saved ? JSON.parse(saved) : [];
  })());
  const [isGameFinished, setIsGameFinished] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const COORD_LIMIT = 50;
  const WIN_TOLERANCE = 10; 

  useEffect(() => {
    localStorage.setItem('cq_completed_levels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  useEffect(() => {
    resetLevel();
  }, [currentLevelIdx]);

  const resetLevel = () => {
    setSprite({
      x: currentLevel.startX,
      y: currentLevel.startY,
      rotation: 0,
      costume: '',
      visible: true
    });
    setInputX(currentLevel.startX.toString());
    setInputY(currentLevel.startY.toString());
    setShowSuccess(false);
    setFeedback('');
    setIsShaking(false);
  };

  const handleCoordinateInput = (val: string, setter: (v: string) => void) => {
    if (val === "" || val === "-") {
      setter(val);
      return;
    }
    
    const num = parseInt(val);
    if (!isNaN(num)) {
      const clamped = Math.max(-COORD_LIMIT, Math.min(COORD_LIMIT, num));
      setter(clamped.toString());
    }
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFeedback('');
    setIsShaking(false);
    playSound('pop');

    const targetX = Math.max(-COORD_LIMIT, Math.min(COORD_LIMIT, parseInt(inputX) || 0));
    const targetY = Math.max(-COORD_LIMIT, Math.min(COORD_LIMIT, parseInt(inputY) || 0));

    playSound('whoosh');
    setSprite(s => ({ ...s, x: targetX, y: targetY }));

    await new Promise(r => setTimeout(r, 850));

    const dx = targetX - currentLevel.targetX;
    const dy = targetY - currentLevel.targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= WIN_TOLERANCE) { 
      setSprite(s => ({ ...s, x: currentLevel.targetX, y: currentLevel.targetY }));
      playSound('success');
      setShowSuccess(true);
      if (!completedLevels.includes(currentLevel.id)) {
        setCompletedLevels(prev => [...prev, currentLevel.id]);
      }
    } else {
      playSound('click');
      if (distance < 20) {
        setFeedback("So close! Just a tiny adjustment... 🤏");
      } else {
        setFeedback("Try another number to get closer! 🧐");
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
    
    setIsRunning(false);
  };

  const nextLevel = () => {
    playSound('pop');
    if (currentLevelIdx < PUZZLES.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  const restartGame = () => {
    playSound('pop');
    setCompletedLevels([]);
    setCurrentLevelIdx(0);
    setIsGameFinished(false);
    localStorage.removeItem('cq_completed_levels');
  };

  if (isGameFinished) {
    return (
      <div className="bg-white p-8 rounded-[40px] shadow-xl text-center max-w-xl mx-auto border-b-[8px] border-orange-400 animate-fadeIn h-full flex flex-col items-center justify-center">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-8 rounded-full text-orange-500 shadow-inner relative">
             <Trophy size={80} className="relative z-10" />
             <div className="absolute inset-0 animate-ping opacity-20">
                <Trophy size={80} className="text-orange-400" />
             </div>
          </div>
        </div>
        <h2 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">MASTER CODER!</h2>
        <p className="text-xl text-gray-500 mb-8 font-medium">
          You placed all the puzzle pieces perfectly! 🚀
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            <Home size={24} />
            Home
          </button>
          <button 
            onClick={restartGame}
            className="bg-white border-4 border-orange-400 text-orange-500 px-8 py-4 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={24} />
            Reset
          </button>
        </div>
      </div>
    );
  }

  const getXPos = (val: number) => `calc(50% + ${val / COORD_LIMIT * 50}%)`;
  const getYPos = (val: number) => `calc(50% - ${val / COORD_LIMIT * 50}%)`;

  const getPieceBgStyle = () => {
    const bgX = 50 - (sprite.x / COORD_LIMIT * 50);
    const bgY = 50 + (sprite.y / COORD_LIMIT * 50);
    
    return {
      backgroundImage: `url(${currentLevel.backgroundImage})`,
      backgroundSize: '1000% 1000%', 
      backgroundPosition: `${bgX}% ${bgY}%`
    };
  };

  return (
    <div className="h-full flex flex-col gap-2 md:gap-4 max-w-full mx-auto overflow-hidden">
      {/* Level Selector */}
      <div className="flex justify-center shrink-0">
        <div className="bg-[#0b1021] border border-white/10 p-1 rounded-full flex flex-wrap justify-center gap-1.5 md:gap-2 shadow-lg overflow-x-auto scrollbar-hide">
          {PUZZLES.map((puzzle, idx) => {
            const isCompleted = completedLevels.includes(puzzle.id);
            const isActive = currentLevelIdx === idx;
            return (
              <button
                key={puzzle.id}
                onClick={() => { playSound('pop'); setCurrentLevelIdx(idx); }}
                className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-300 transform active:scale-90 ${isActive ? 'bg-[#5c4fff] text-white shadow-[0_0_15px_rgba(92,79,255,0.4)] scale-110' : isCompleted ? 'bg-[#132a2c] text-[#2cc68a]' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
              >
                {isCompleted && !isActive ? <Check size={14} strokeWidth={4} /> : puzzle.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr] gap-4 md:gap-6 items-start overflow-hidden min-h-0">
        
        {/* Sidebar */}
        <div className="flex flex-col gap-3 md:gap-4 h-full overflow-hidden">
          {/* Info Card */}
          <div className="bg-white p-3 md:p-4 rounded-[20px] md:rounded-[30px] shadow-md border-b-4 border-yellow-200 shrink-0">
            <div className="flex items-center gap-1.5 mb-0.5 text-yellow-600 font-black uppercase text-[7px] md:text-[10px] tracking-widest">
              <Trophy size={10} className="md:w-[14px]" /> Puzzle {currentLevel.id} / {PUZZLES.length}
            </div>
            <h3 className="text-sm md:text-lg font-black text-gray-800 mb-0.5 tracking-tight leading-none">{currentLevel.title}</h3>
            <p className="text-gray-500 text-[8px] md:text-xs italic font-medium leading-tight">
              "{currentLevel.description}"
            </p>
          </div>

          {/* Blocks Area */}
          <div className="bg-blue-50 p-3 md:p-5 rounded-[25px] md:rounded-[35px] shadow-inner border-[3px] md:border-[4px] border-blue-100 relative flex flex-col gap-2 md:gap-3 flex-1 overflow-hidden min-h-0">
            <h4 className="font-black text-blue-600 flex items-center justify-between uppercase text-[7px] md:text-[10px] tracking-tighter shrink-0">
              <span className="flex items-center gap-1">
                <Sparkles size={10} className="md:w-[14px]" /> Blocks
              </span>
              <button 
                onClick={() => { playSound('pop'); resetLevel(); }} 
                className="text-blue-400 hover:text-red-500 p-0.5 md:p-1 rounded-full hover:bg-white transition-all shadow-sm flex items-center gap-1 text-[6px] md:text-[8px] font-black"
              >
                <RotateCcw size={8} className="md:w-[12px]" /> RESET
              </button>
            </h4>
            
            <div className={`flex-1 flex flex-col gap-3 md:gap-4 overflow-y-auto min-h-0 scrollbar-hide transition-transform ${isShaking ? 'animate-shake' : ''}`}>
              {/* X Input Group */}
              <div className="flex items-center gap-3 md:gap-4 font-black group">
                <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-lg border-b-4 border-blue-800 text-sm md:text-xl shrink-0 transition-transform group-hover:scale-110">X</div>
                <div className="flex-1 relative">
                  <input 
                    type="number"
                    value={inputX}
                    min="-50"
                    max="50"
                    onChange={(e) => handleCoordinateInput(e.target.value, setInputX)}
                    className="w-full bg-white text-blue-700 rounded-xl md:rounded-2xl px-2 py-1 md:py-3 focus:ring-4 ring-yellow-400 outline-none text-center font-black shadow-md border-b-4 border-gray-200 text-base md:text-2xl"
                  />
                </div>
              </div>

              {/* Y Input Group */}
              <div className="flex items-center gap-3 md:gap-4 font-black group">
                <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl md:rounded-2xl shadow-lg border-b-4 border-indigo-800 text-sm md:text-xl shrink-0 transition-transform group-hover:scale-110">Y</div>
                <div className="flex-1 relative">
                  <input 
                    type="number"
                    value={inputY}
                    min="-50"
                    max="50"
                    onChange={(e) => handleCoordinateInput(e.target.value, setInputY)}
                    className="w-full bg-white text-blue-700 rounded-xl md:rounded-2xl px-2 py-1 md:py-3 focus:ring-4 ring-yellow-400 outline-none text-center font-black shadow-md border-b-4 border-gray-200 text-base md:text-2xl"
                  />
                </div>
              </div>
              
              {feedback && (
                <div className="bg-white p-2 rounded-lg border-2 border-red-200 shadow-sm animate-bounce shrink-0">
                  <p className="text-[7px] md:text-[10px] text-red-600 font-black text-center uppercase leading-none">{feedback}</p>
                </div>
              )}
            </div>

            <button
              onClick={runCode}
              disabled={isRunning}
              className={`w-full py-2.5 md:py-4 rounded-[15px] md:rounded-[30px] font-black text-sm md:text-xl text-white shadow-lg flex items-center justify-center gap-2 md:gap-3 transition-all transform hover:scale-[1.02] active:scale-95 border-b-[4px] md:border-b-[8px] shrink-0 ${isRunning ? 'bg-gray-400 border-gray-500' : 'bg-green-500 border-green-700 hover:bg-green-600'}`}
            >
              <Play size={18} className="md:w-[28px]" fill="currentColor" />
              {isRunning ? 'WATCHING...' : 'RUN CODE'}
            </button>
          </div>
        </div>

        {/* Stage Area */}
        <div className="flex flex-col gap-3 md:gap-4 h-full overflow-hidden min-h-0 items-center">
          <div className="relative w-full max-w-[85vh] flex-1 min-h-0 pr-6 pl-2 pt-6 pb-2">
            
            {/* Y Axis External Label */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-indigo-600 font-black text-lg md:text-2xl drop-shadow-sm select-none">Y</div>
            
            {/* X Axis External Label */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 font-black text-lg md:text-2xl drop-shadow-sm select-none">X</div>

            <div ref={stageRef} className="bg-black rounded-[20px] md:rounded-[45px] shadow-2xl border-[6px] md:border-[8px] border-gray-800 aspect-video lg:aspect-[4/3] relative overflow-hidden select-none w-full h-full ring-1 ring-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentLevel.backgroundImage})` }} />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              
              {/* Grid Lines */}
              <div className="absolute inset-0 pointer-events-none">
                 {/* Grid Center Lines */}
                 <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.6)] transform -translate-y-1/2" />
                 <div className="absolute left-1/2 top-0 h-full w-[3px] bg-white opacity-40 shadow-[0_0_15px_rgba(255,255,255,0.6)] transform -translate-x-1/2" />

                 {/* Coordinate Numeric Markers */}
                 <div className="absolute left-2 top-1/2 translate-y-2 text-white/60 text-[8px] md:text-sm font-black">-50</div>
                 <div className="absolute right-2 top-1/2 translate-y-2 text-white/60 text-[8px] md:text-sm font-black">50</div>
                 <div className="absolute left-1/2 -translate-x-4 top-1/2 translate-y-2 text-white/60 text-[8px] md:text-sm font-black">0</div>
                 <div className="absolute left-1/2 translate-x-2 top-2 text-white/60 text-[8px] md:text-sm font-black">50</div>
                 <div className="absolute left-1/2 translate-x-2 bottom-2 text-white/60 text-[8px] md:text-sm font-black">-50</div>
              </div>

              {/* Target Slot */}
              <div className="absolute flex flex-col items-center z-0" style={{ left: getXPos(currentLevel.targetX), top: getYPos(currentLevel.targetY), transform: 'translate(-50%, -50%)' }}>
                <div className="w-[45px] h-[45px] md:w-[100px] md:h-[100px] bg-black/80 rounded-[10px] md:rounded-[25px] border-[2px] md:border-[4px] border-dashed border-white/40 flex items-center justify-center backdrop-blur-lg">
                   <Puzzle className="text-white/10 w-5 md:w-[50px]" />
                </div>
              </div>

              {/* User Sprite Piece */}
              <div className="absolute flex flex-col items-center z-10 transition-all duration-[800ms] cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ left: getXPos(sprite.x), top: getYPos(sprite.y), transform: `translate(-50%, -50%) ${isRunning ? 'scale(1.1)' : 'scale(1)'}` }}>
                <div className="w-[45px] h-[45px] md:w-[100px] md:h-[100px] rounded-[10px] md:rounded-[25px] border-[2px] md:border-[4px] border-white bg-no-repeat overflow-hidden relative shadow-xl" style={getPieceBgStyle()}>
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent pointer-events-none" />
                </div>
                {!isRunning && !showSuccess && (
                   <div className="mt-1 md:mt-2 bg-blue-600/90 backdrop-blur-md text-white text-[5px] md:text-[8px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-black shadow-lg border border-white/40 whitespace-nowrap tracking-wider uppercase">
                     (X:{Math.round(sprite.x)} Y:{Math.round(sprite.y)})
                   </div>
                )}
              </div>

              {/* Win Overlay */}
              {showSuccess && (
                <div className="absolute inset-0 bg-green-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 md:p-8 text-center animate-fadeIn z-30">
                  <div className="bg-white p-2 md:p-6 rounded-full text-green-600 mb-1 md:mb-6 shadow-xl animate-bounce border-[2px] md:border-[6px] border-green-100"><Trophy size={20} className="md:w-[60px]" /></div>
                  <h2 className="text-xl md:text-5xl font-black mb-0.5 md:mb-2 tracking-tighter uppercase">Bingo!</h2>
                  <p className="text-[10px] md:text-xl opacity-90 mb-2 md:mb-8 font-black">You reached X:{currentLevel.targetX} Y:{currentLevel.targetY}</p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <button onClick={resetLevel} className="bg-green-800 text-white px-4 py-2 md:px-8 md:py-3 rounded-[12px] md:rounded-[25px] font-black text-[10px] md:text-lg hover:bg-green-900 transition-all flex items-center gap-1.5 border-b-[3px] md:border-b-[6px] border-green-950 shadow-md uppercase">Reset</button>
                    <button onClick={nextLevel} className="bg-white text-green-700 px-5 py-2 md:px-10 md:py-3 rounded-[12px] md:rounded-[25px] font-black text-[10px] md:text-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-1.5 border-b-[3px] md:border-b-[6px] border-gray-200 uppercase">{currentLevelIdx === PUZZLES.length - 1 ? 'FINISH!' : 'NEXT PUZZLE'}{currentLevelIdx === PUZZLES.length - 1 ? <PartyPopper size={14} className="md:w-[24px]" /> : <ChevronRight size={14} className="md:w-[24px]" strokeWidth={4} />}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0 w-full max-w-[85vh]">
             <div className="bg-white/80 backdrop-blur-sm p-2 md:p-4 rounded-[15px] md:rounded-[30px] border-2 border-white shadow-md flex items-center justify-between">
               <div className="text-left">
                  <div className="text-[5px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Winning Zone</div>
                  <div className="text-[10px] md:text-lg font-black text-blue-500 tracking-tight">±10 Units</div>
               </div>
               <div className="text-blue-100"><Trophy size={16} className="md:w-[28px]" /></div>
             </div>
             <div className="bg-[#0b1021] p-2 md:p-4 rounded-[15px] md:rounded-[30px] border-2 border-white/10 shadow-xl flex items-center justify-between text-right">
               <div className="text-green-500/20"><Sparkles size={16} className="md:w-[28px]" /></div>
               <div className="text-right">
                  <div className="text-[5px] md:text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Current</div>
                  <div className="text-[11px] md:text-xl font-black text-green-400 font-mono tracking-tighter tabular-nums">X:{inputX || 0} Y:{inputY || 0}</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatePuzzle;