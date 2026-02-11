
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, ArrowUpRight, Maximize, Palette, Trash2, X as CloseIcon, Move, Sparkles, MessageCircle, Dog, Cat, Bird } from 'lucide-react';
import { CodeBlock, SpriteState, BlockType } from '../types';
import { COSTUMES, BACKGROUNDS } from '../constants';
import { playSound } from './SoundUtils';

const Playground: React.FC = () => {
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [sprite, setSprite] = useState<SpriteState>({
    x: 0,
    y: 0,
    rotation: 0,
    costume: COSTUMES[0],
    visible: true
  });
  const [currentBg, setCurrentBg] = useState(BACKGROUNDS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');

  const availableBlocks: { type: BlockType; label: string; icon: any; color: string }[] = [
    { type: 'move', label: 'Walk 🏃‍♂️', icon: ArrowRight, color: 'bg-blue-500' },
    { type: 'turn', label: 'Spin 🌀', icon: RotateCcw, color: 'bg-blue-600' },
    { type: 'goto', label: 'Jump to Middle ✨', icon: Maximize, color: 'bg-indigo-500' },
    { type: 'glide', label: 'Smooth Slide ⛸️', icon: ArrowUpRight, color: 'bg-indigo-700' },
    { type: 'next_costume', label: 'New Outfit 👕', icon: Palette, color: 'bg-purple-500' },
    { type: 'say', label: 'Say Hello 👋', icon: MessageCircle, color: 'bg-pink-500' }
  ];

  const addBlock = (type: BlockType) => {
    playSound('pop');
    const newBlock: CodeBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    playSound('click');
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMessage('');

    for (const block of blocks) {
      // Small pause between commands for visibility
      await new Promise(r => setTimeout(r, 100));
      
      switch (block.type) {
        case 'move':
          playSound('click');
          setSprite(s => ({
            ...s,
            x: Math.min(150, Math.max(-150, s.x + Math.cos(s.rotation * Math.PI / 180) * 30)),
            y: Math.min(100, Math.max(-100, s.y + Math.sin(s.rotation * Math.PI / 180) * 30))
          }));
          await new Promise(r => setTimeout(r, 400));
          break;
        case 'turn':
          playSound('click');
          setSprite(s => ({ ...s, rotation: (s.rotation + 30) % 360 }));
          await new Promise(r => setTimeout(r, 400));
          break;
        case 'goto':
          playSound('pop');
          setSprite(s => ({ ...s, x: 0, y: 0 }));
          await new Promise(r => setTimeout(r, 400));
          break;
        case 'glide':
          playSound('whoosh');
          // Smooth glide to a random location or corner
          setSprite(s => ({ ...s, x: 80, y: 80 }));
          await new Promise(r => setTimeout(r, 850)); // Match CSS transition
          break;
        case 'next_costume':
          playSound('pop');
          setSprite(s => {
            const currentIdx = COSTUMES.indexOf(s.costume);
            const nextIdx = (currentIdx + 1) % COSTUMES.length;
            return { ...s, costume: COSTUMES[nextIdx] };
          });
          await new Promise(r => setTimeout(r, 400));
          break;
        case 'say':
          playSound('pop');
          setMessage('Hi Friends! 🌈');
          await new Promise(r => setTimeout(r, 1500));
          setMessage('');
          break;
      }
    }
    playSound('success');
    setIsRunning(false);
  };

  const resetAll = () => {
    playSound('pop');
    setSprite({ x: 0, y: 0, rotation: 0, costume: COSTUMES[0], visible: true });
    setBlocks([]);
    setMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
      {/* Block Palette */}
      <div className="w-full lg:w-1/4 bg-white p-6 rounded-[35px] shadow-xl border-b-[8px] border-gray-100 flex flex-col gap-6">
        <div>
          <h3 className="font-black text-gray-700 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Sparkles size={18} className="text-yellow-400" /> Magic Blocks
          </h3>
          <div className="flex flex-col gap-2">
            {availableBlocks.map((b) => (
              <button
                key={b.type}
                onClick={() => addBlock(b.type)}
                className={`${b.color} text-white px-5 py-3 rounded-2xl flex items-center gap-4 font-black hover:scale-105 active:scale-95 transition-all text-sm shadow-lg border-b-4 border-black/10`}
              >
                <b.icon size={18} />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black text-gray-700 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Palette size={18} className="text-purple-400" /> Choose Friend
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {COSTUMES.map((c, i) => (
              <button 
                key={i}
                onClick={() => {
                  playSound('pop');
                  setSprite(s => ({ ...s, costume: c }));
                }}
                className={`p-1 bg-white rounded-xl border-2 transition-all ${sprite.costume === c ? 'border-purple-500 scale-110 shadow-md' : 'border-gray-100 hover:border-purple-200'}`}
              >
                <img src={c} className="w-full h-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Script Area */}
      <div className="w-full lg:w-1/4 bg-blue-50 p-6 rounded-[35px] shadow-inner border-4 border-blue-100 overflow-y-auto relative flex flex-col min-h-[500px]">
        <h3 className="font-black text-blue-600 mb-6 flex items-center justify-between uppercase text-sm tracking-widest">
          <span>My Code List</span>
          <button onClick={resetAll} className="text-red-400 hover:text-red-600 transition-colors bg-white p-2 rounded-full shadow-sm">
            <RotateCcw size={18} />
          </button>
        </h3>
        
        <div className="flex flex-col gap-2 flex-1">
          {blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-blue-300 gap-4">
               <Move size={48} className="animate-bounce" />
               <p className="font-bold text-center leading-tight">Tap blocks to<br/>make them appear!</p>
            </div>
          )}
          {blocks.map((b, idx) => {
            const config = availableBlocks.find(ab => ab.type === b.type)!;
            return (
              <div 
                key={b.id} 
                className={`${config.color} text-white p-4 rounded-2xl flex justify-between items-center shadow-lg border-b-4 border-black/10 animate-slideIn`}
              >
                <div className="flex items-center gap-3 font-black">
                  <span className="bg-white/20 w-7 h-7 flex items-center justify-center rounded-full text-[10px]">{idx + 1}</span>
                  {config.label}
                </div>
                <button onClick={() => removeBlock(b.id)} className="bg-white/20 p-1.5 rounded-lg hover:bg-white/40">
                  <CloseIcon size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <button 
          onClick={runCode}
          disabled={isRunning || blocks.length === 0}
          className={`mt-6 w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-2xl transition-all shadow-2xl transform hover:scale-105 active:scale-95 border-b-8 ${
            isRunning || blocks.length === 0 
              ? 'bg-gray-300 border-gray-400 text-gray-500 opacity-50' 
              : 'bg-green-500 border-green-700 text-white'
          }`}
        >
          <Play size={28} fill="currentColor" />
          {isRunning ? 'WATCHING...' : 'START!'}
        </button>
      </div>

      {/* Stage */}
      <div className="w-full lg:w-2/4 flex flex-col gap-6">
        <div 
          className="relative bg-white rounded-[50px] shadow-2xl border-8 border-gray-800 overflow-hidden flex-1 aspect-[4/3]"
          style={{ 
            backgroundImage: `url(${currentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          
          {/* Coordinates Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            <div className="w-full h-[2px] bg-white shadow-[0_0_8px_white]"></div>
            <div className="h-full w-[2px] bg-white shadow-[0_0_8px_white]"></div>
          </div>

          {/* Sprite Piece with Smooth Glide Transition */}
          <div 
            className="absolute transition-all duration-[800ms] cubic-bezier(0.34, 1.56, 0.64, 1) ease-out flex flex-col items-center"
            style={{ 
                left: `calc(50% + ${sprite.x}px)`, 
                top: `calc(50% - ${sprite.y}px)`,
                transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg)` 
            }}
          >
            {message && (
              <div className="absolute -top-16 bg-white border-4 border-pink-400 rounded-[25px] px-6 py-2 text-xl font-black shadow-2xl animate-bounce text-pink-500 whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-t-white">
                {message}
              </div>
            )}
            <img 
              src={sprite.costume} 
              alt="Codey" 
              className="w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-300"
              style={{ 
                filter: `drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(0 -3px 0 white) drop-shadow(0 10px 20px rgba(0,0,0,0.3))`
              }}
            />
          </div>
        </div>

        {/* Backdrop Swapper - Nature Gallery */}
        <div className="bg-white p-4 rounded-[30px] shadow-lg border-b-4 border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
               <Bird size={12} /> Travel the Nature World
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                {BACKGROUNDS.map((bg, i) => (
                    <button 
                        key={i} 
                        onClick={() => {
                            playSound('pop');
                            setCurrentBg(bg);
                        }}
                        className={`min-w-[70px] h-16 rounded-2xl border-4 overflow-hidden transition-all shrink-0 ${currentBg === bg ? 'border-blue-500 scale-105 shadow-xl' : 'border-white hover:border-blue-100'}`}
                    >
                        <img src={bg} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
