
import React, { useState, useRef, useEffect } from 'react';
// Use correct import for GoogleGenAI
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

const AITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Beep boop! I'm Codey, your robot helper. Need help with a block or a task?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Use the gemini-3-pro-preview model for reasoning and coding tasks as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMessage,
        config: {
          systemInstruction: "You are 'Codey', a friendly and encouraging robot tutor for kids aged 5-10 learning Scratch-style coding. Use simple language, fun emojis, and give helpful hints. Occasionally use robot-themed metaphors like 'rebooting' or 'calibrating'. If they ask about coordinates, explain X/Y simply like a map. Keep answers under 3 sentences.",
        }
      });

      const aiText = response.text || "Error 404: My brain module is spinning! Try asking again.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Signal lost! My circuits are a bit fuzzy. Check your internet!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border-4 border-yellow-400">
          <div className="bg-yellow-400 p-4 flex justify-between items-center text-white font-bold">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-full text-yellow-500">
                <Sparkles size={20} />
              </div>
              <span>Ask Codey!</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-yellow-500 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-4 h-96 overflow-y-auto bg-gray-50 flex flex-col gap-3"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border-2 border-yellow-100 rounded-bl-none shadow-sm'
                }`}>
                  <div className="flex items-center gap-1 mb-1 opacity-70 text-[10px] uppercase font-bold">
                    {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    {m.role === 'user' ? 'You' : 'Codey'}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-yellow-100 p-3 rounded-2xl rounded-bl-none animate-pulse text-xs">
                  Codey is calculating... 🤖
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-yellow-400 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <MessageCircle size={28} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
            Ask Codey
          </span>
        </button>
      )}
    </div>
  );
};

export default AITutor;
