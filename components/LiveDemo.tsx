
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Palette, Sparkles, MousePointer2, Move, Navigation, CheckCircle2, Trophy, RefreshCcw, Languages, Repeat, Heart } from 'lucide-react';
import { LessonId } from '../types';
import { COSTUMES, BACKGROUNDS } from '../constants';
import { playSound } from './SoundUtils';

interface LiveDemoProps {
  lessonId: LessonId;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ lessonId }) => {
  const [sprite, setSprite] = useState({ 
    x: 0, 
    y: 0, 
    rotation: 0, 
    costume: COSTUMES[0],
    flipped: false,
    meowing: false
  });
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const COORD_LIMIT = 240;

  const getCorrectCostumeForBg = (background: string) => {
    const bgIndex = BACKGROUNDS.indexOf(background);
    return COSTUMES[bgIndex];
  };

  useEffect(() => {
    setSprite({ x: 0, y: 0, rotation: 0, costume: COSTUMES[0], flipped: false, meowing: false });
    setMessage('');
    setIsLevelComplete(false);
  }, [lessonId]);

  useEffect(() => {
    if (lessonId === LessonId.COSTUME_1_2) {
      const correctCostume = getCorrectCostumeForBg(bg);
      if (sprite.costume === correctCostume && !isLevelComplete) {
        setIsLevelComplete(true);
        playSound('success');
      }
    }
  }, [sprite.costume, bg, lessonId]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lessonId !== LessonId.STAGE_1_3 || isLevelComplete) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * (COORD_LIMIT * 2) - COORD_LIMIT);
    const y = Math.round((1 - (e.clientY - rect.top) / rect.height) * (COORD_LIMIT * 2) - COORD_LIMIT);
    playSound('pop');
    setSprite(s => ({ ...s, x, y }));
    setMessage(`Teleported to X:${x} Y:${y}!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * (COORD_LIMIT * 2) - COORD_LIMIT);
    const y = Math.round((1 - (e.clientY - rect.top) / rect.height) * (COORD_LIMIT * 2) - COORD_LIMIT);
    setMousePos({ x, y });
  };

  const runAction = (type: string) => {
    if (isLevelComplete && type !== 'reset') return;
    
    switch (type) {
      case 'move':
        playSound('click');
        setSprite(s => ({ ...s, x: Math.min(COORD_LIMIT, s.x + 10) }));
        break;
      case 'turn':
        playSound('click');
        setSprite(s => ({ ...s, rotation: s.rotation + 15 }));
        break;
      case 'flip':
        playSound('click');
        setSprite(s => ({ ...s, flipped: !s.flipped }));
        break;
      case 'meow':
        if (sprite.meowing) return;
        playSound('pop');
        // Removed text meow message
        setSprite(s => ({ ...s, meowing: true, flipped: false, rotation: 0 }));
        setTimeout(() => {
          setSprite(s => ({ ...s, meowing: false }));
        }, 1500);
        break;
      case 'reset':
        playSound('pop');
        setSprite({ x: 0, y: 0, rotation: 0, costume: COSTUMES[0], flipped: false, meowing: false });
        setBg(BACKGROUNDS[0]);
        setIsLevelComplete(false);
        break;
      case 'costume':
        playSound('pop');
        setSprite(s => {
          const nextIdx = (COSTUMES.indexOf(s.costume) + 1) % COSTUMES.length;
          return { ...s, costume: COSTUMES[nextIdx] };
        });
        break;
      case 'bg':
        playSound('whoosh');
        setBg(prevBg => {
          const nextIdx = (BACKGROUNDS.indexOf(prevBg) + 1) % BACKGROUNDS.length;
          return BACKGROUNDS[nextIdx];
        });
        break;
    }
  };

  const getXPercent = (val: number) => `calc(50% + ${val / COORD_LIMIT * 50}%)`;
  const getYPercent = (val: number) => `calc(50% - ${val / COORD_LIMIT * 50}%)`;

  return (
    <div className="my-10 flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          {lessonId === LessonId.COSTUME_1_2 ? 'Mission: Match the Piece!' : 'Interactive Try-It!'}
        </h4>
        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Range: -240 to 240
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 flex flex-col gap-2">
          {lessonId === LessonId.MOVE_1_1 && (
            <>
              <button onClick={() => runAction('move')} className="bg-blue-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md">
                <Move size={20} /> Move 10 units
              </button>
              <button onClick={() => runAction('turn')} className="bg-indigo-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md">
                <RotateCcw size={20} /> Turn 15°
              </button>
            </>
          )}

          {lessonId === LessonId.COSTUME_1_2 && (
            <>
              <div className="bg-purple-50 p-4 rounded-2xl mb-2 border border-purple-100">
                <p className="text-[10px] font-black text-purple-600 uppercase mb-2">Goal</p>
                <p className="text-xs text-purple-800 leading-tight">Match the <b>Missing Piece</b> to the right <b>Stage</b>!</p>
              </div>
              <button 
                onClick={() => runAction('flip')} 
                className="bg-orange-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Repeat size={20} /> Turn Around
              </button>
              <button 
                onClick={() => runAction('meow')} 
                className="bg-yellow-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Languages size={20} /> Meow!
              </button>
              <button 
                onClick={() => runAction('costume')} 
                disabled={isLevelComplete}
                className="bg-purple-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:scale-100"
              >
                <Palette size={20} /> Next Piece
              </button>
              <button 
                onClick={() => runAction('bg')} 
                disabled={isLevelComplete}
                className="bg-pink-500 text-white p-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:scale-100"
              >
                <Navigation size={20} /> Switch Stage
              </button>
            </>
          )}

          {lessonId === LessonId.STAGE_1_3 && (
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 text-sm italic">
              <div className="flex items-center gap-2 mb-2 text-blue-500 not-italic font-bold uppercase text-[10px]">
                <MousePointer2 size={14} /> Stage Explorer
              </div>
              Move mouse to see X/Y (max 240). Click to teleport the sprite!
            </div>
          )}

          <button onClick={() => runAction('reset')} className="mt-auto border-2 border-gray-200 text-gray-400 p-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <RefreshCcw size={16} /> Reset
          </button>
        </div>

        <div className="lg:col-span-3">
          <div 
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800 cursor-crosshair bg-slate-900 group"
            onMouseMove={handleMouseMove}
            onClick={handleStageClick}
            style={{ 
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-mono text-xs border border-white/20 z-20">
              Mouse: X: {mousePos.x} Y: {mousePos.y}
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transform -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transform -translate-x-1/2" />
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10% 10%' }} />
            </div>

            <div 
              className={`absolute transition-all duration-300 ease-out flex flex-col items-center ${sprite.meowing ? 'animate-meow' : ''}`}
              style={{ 
                left: getXPercent(sprite.x), 
                top: getYPercent(sprite.y),
                transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg) scaleX(${sprite.flipped ? -1 : 1})`,
                zIndex: 10
              }}
            >
              {message && (
                <div className="absolute -top-12 bg-white text-gray-800 px-4 py-1.5 rounded-full font-bold text-sm shadow-xl border-2 border-blue-500 animate-bounce whitespace-nowrap z-30" style={{ transform: `scaleX(${sprite.flipped ? -1 : 1})` }}>
                  {message}
                </div>
              )}
              {sprite.meowing && (
                <div className="absolute -top-20 text-red-500 animate-heart z-40">
                  <Heart fill="currentColor" size={32} />
                </div>
              )}
              <div className="relative">
                <img 
                  src={sprite.costume} 
                  className={`w-20 h-20 sm:w-28 sm:h-28 transition-all drop-shadow-2xl ${isLevelComplete ? 'scale-125 brightness-110 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'filter brightness-105'} ${sprite.meowing ? 'animate-wag' : ''}`} 
                  alt="Live Sprite"
                  style={{ 
                    filter: `drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(0 -3px 0 white) drop-shadow(0 5px 15px rgba(0,0,0,0.3))`
                  }}
                />
              </div>
            </div>

            {isLevelComplete && (
              <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 text-center animate-fadeIn z-30">
                <div className="bg-white p-4 rounded-full text-green-600 mb-4 shadow-2xl animate-bounce">
                  <Trophy size={48} />
                </div>
                <h2 className="text-4xl font-black mb-1 tracking-tight">LEVEL COMPLETE!</h2>
                <p className="text-lg opacity-90 mb-6 font-medium">The piece matches the stage perfectly!</p>
                <button 
                  onClick={() => runAction('reset')}
                  className="bg-white text-green-600 px-8 py-3 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                >
                  Play Again
                  <RefreshCcw size={20} />
                </button>
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm text-white/50 text-[10px] px-2 py-1 rounded border border-white/10 font-bold uppercase tracking-widest">
              Live Stage Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDemo;
