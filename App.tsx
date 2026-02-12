
import React, { useState } from 'react';
import { 
  Sparkles,
  Map,
  PartyPopper,
  Gamepad2,
  Star,
  Zap,
  ChevronRight,
  MousePointer2,
  Trophy
} from 'lucide-react';
import Quiz from './components/Quiz';
import CoordinatePuzzle from './components/CoordinatePuzzle';
import { playSound } from './components/SoundUtils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'quiz' | 'puzzles'>('welcome');
  const [logoLoaded, setLogoLoaded] = useState(true);

  const handleTabChange = (tab: 'welcome' | 'quiz' | 'puzzles') => {
    playSound('pop');
    setActiveTab(tab);
  };

  const LogoTextFallback = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="text-xl md:text-3xl font-black tracking-tighter text-[#000000] uppercase">Million</span>
      <span className="text-xl md:text-3xl font-black tracking-tighter text-[#FC9009] uppercase -mt-1">Coders</span>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#fdf8ff] overflow-hidden font-['Fredoka',_sans-serif]">
      {/* Header - Million Coders Branding */}
      <header className="bg-white shadow-lg border-b-[4px] border-yellow-400 p-2 md:p-3 sticky top-0 z-40 rounded-b-[24px] shrink-0">
        <div className="max-w-screen-2xl mx-auto flex flex-row justify-between items-center px-2 md:px-6">
          
          {/* Million Coders Logo - Top Left */}
          <div 
            className="flex items-center cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0 py-1" 
            onClick={() => handleTabChange('welcome')}
          >
            {logoLoaded ? (
              <img 
                src="/Million-Coders-White-text.svg"
                alt="Million Coders" 
                className="h-12 md:h-20 w-auto block object-contain"
                onError={() => setLogoLoaded(false)}
              />
            ) : (
              <LogoTextFallback />
            )}
          </div>

          <nav className="flex bg-gray-100/50 p-1 rounded-[15px] md:rounded-[20px] gap-1 border-2 border-gray-100">
            <button 
              onClick={() => handleTabChange('welcome')}
              className={`flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-[12px] md:rounded-[15px] font-black transition-all whitespace-nowrap text-xs md:text-sm ${
                activeTab === 'welcome' ? 'bg-blue-500 shadow-md text-white scale-105' : 'text-gray-500 hover:bg-white'
              }`}
            >
              <Zap size={14} className="md:w-[18px]" />
              Welcome
            </button>
            <button 
              onClick={() => handleTabChange('puzzles')}
              className={`flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-[12px] md:rounded-[15px] font-black transition-all whitespace-nowrap text-xs md:text-sm ${
                activeTab === 'puzzles' ? 'bg-orange-500 shadow-md text-white scale-105' : 'text-gray-500 hover:bg-white'
              }`}
            >
              <Gamepad2 size={14} className="md:w-[18px]" />
              Play
            </button>
            <button 
              onClick={() => handleTabChange('quiz')}
              className={`flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-[12px] md:rounded-[15px] font-black transition-all whitespace-nowrap text-xs md:text-sm ${
                activeTab === 'quiz' ? 'bg-green-500 shadow-md text-white scale-105' : 'text-gray-500 hover:bg-white'
              }`}
            >
              <PartyPopper size={14} className="md:w-[18px]" />
              Quiz
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-2 md:py-4 max-w-screen-2xl overflow-hidden flex flex-col">
        {activeTab === 'welcome' && (
          <div className="h-full flex flex-col items-center justify-center gap-4 md:gap-6 animate-fadeInSlow opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="relative bg-white rounded-[40px] shadow-lg p-6 lg:p-12 border-b-[8px] border-blue-100 overflow-hidden text-center w-full max-w-4xl shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-12 -mb-12 blur-2xl opacity-40"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  {logoLoaded ? (
                    <img 
                      src="/Million-Coders-White-text.svg" 
                      className="w-28 h-28 md:w-56 md:h-56 drop-shadow-lg hover:scale-110 transition-transform duration-500 cursor-pointer animate-hero object-contain" 
                      alt="Million Coders" 
                    />
                  ) : (
                    <LogoTextFallback className="md:scale-150 py-10" />
                  )}
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-2 tracking-tight leading-none">
                  Ready to <span className="text-orange-500">Code?</span>
                </h2>
                <p className="text-sm md:text-xl text-gray-500 font-bold max-w-xl mb-8 leading-tight">
                  Master X and Y coordinates to solve every puzzle on the map. 
                  Become a <span className="text-blue-500">Coding Master</span> today!
                </p>
                
                <button 
                  onClick={() => handleTabChange('puzzles')}
                  className="group bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 md:px-10 md:py-5 rounded-[20px] md:rounded-[30px] font-black text-lg md:text-2xl shadow-[0_4px_0_#ea580c] md:shadow-[0_8px_0_#ea580c] hover:scale-105 active:scale-95 active:translate-y-1 transition-all flex items-center gap-3"
                >
                  START QUEST
                  <ChevronRight strokeWidth={4} className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-4xl shrink-0">
              <div className="bg-white p-3 md:p-4 rounded-[20px] md:rounded-[25px] shadow-md border-b-4 border-yellow-200 text-center">
                <div className="bg-yellow-50 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-yellow-500">
                  <Star fill="currentColor" className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h3 className="text-[10px] md:text-sm font-black text-gray-800 uppercase tracking-tight">1. Explore</h3>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-[20px] md:rounded-[25px] shadow-md border-b-4 border-blue-200 text-center">
                <div className="bg-blue-50 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500">
                  <MousePointer2 strokeWidth={3} className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h3 className="text-[10px] md:text-sm font-black text-gray-800 uppercase tracking-tight">2. Use Logic</h3>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-[20px] md:rounded-[25px] shadow-md border-b-4 border-green-200 text-center">
                <div className="bg-green-50 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                  <Trophy strokeWidth={3} className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h3 className="text-[10px] md:text-sm font-black text-gray-800 uppercase tracking-tight">3. Level Up!</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'puzzles' && (
          <div className="flex-1 flex flex-col gap-2 md:gap-4 animate-fadeIn overflow-hidden">
            <div className="text-center shrink-0">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-0.5 flex items-center justify-center gap-2">
                <Map className="text-orange-500 w-6 h-6 md:w-7 md:h-7" />
                Treasure Hunt!
              </h2>
            </div>
            <div className="flex-1 overflow-hidden min-h-0">
              <CoordinatePuzzle />
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="flex-1 py-2 animate-fadeIn flex flex-col overflow-hidden">
            <div className="text-center mb-2 shrink-0">
               <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-1 underline decoration-yellow-400 decoration-4 underline-offset-4">Party Quiz!</h2>
            </div>
            <div className="flex-1 overflow-y-auto pb-4 min-h-0">
              <Quiz />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white/50 border-t py-2 md:py-3 text-center text-gray-400 text-[8px] md:text-[10px] font-bold shrink-0">
        <p className="flex items-center justify-center gap-2">
          Made with <Sparkles className="text-yellow-400" size={10} /> for Million Coders!
        </p>
      </footer>
    </div>
  );
};

export default App;
