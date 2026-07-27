import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUp, Bot, User, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RobotIcon } from './RobotIcon';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 1. Create a short burst of noise for the mechanical friction "click"
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 5000; // Higher frequency for a crisp, tiny snap
    filter.Q.value = 1.0;

    const noiseGain = ctx.createGain();
    
    // Envelope for the shutter: two fast peaks (sh-shak)
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    
    // Click 1 (shutter open)
    noiseGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    // Silence between
    noiseGain.gain.setValueAtTime(0, ctx.currentTime + 0.05);
    
    // Click 2 (shutter close)
    noiseGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.052);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Add a tiny mechanical 'thud' for realism
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.005);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Play both
    noiseSource.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    
    noiseSource.stop(ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);

  } catch (e) {
    // Ignore audio autoplay restrictions
  }
};

const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // High frequency short tick
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore
  }
};

const renderMessageContent = (content: string, role: 'user' | 'assistant') => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Split by one or more newlines to remove huge blank spaces
  const paragraphs = content.split(/\n+/);
  
  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((p, pIdx) => {
        if (!p.trim()) return null;
        const parts = p.split(urlRegex);
        return (
          <p key={pIdx} className="leading-[1.8]">
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                return (
                  <a 
                    key={i} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`underline font-medium hover:opacity-80 break-all ${role === 'assistant' ? 'text-[#E60000]' : 'text-white'}`}
                  >
                    {part}
                  </a>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

const DAILY_LIMIT = 10;

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(DAILY_LIMIT);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi! Choose your language / اختر لغتك:" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('ai_chat_limit');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setQuestionsLeft(Math.max(0, DAILY_LIMIT - parsed.count));
        } else {
          localStorage.setItem('ai_chat_limit', JSON.stringify({ date: today, count: 0 }));
        }
      } catch {
        localStorage.setItem('ai_chat_limit', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('ai_chat_limit', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleResetChat = () => {
    setMessages([{ role: 'assistant', content: "Hi! Choose your language / اختر لغتك:" }]);
    setLanguageSelected(false);
    setInput('');
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [messages.length, isOpen]);

  const handleSend = async (overrideMessage?: string) => {
    if (questionsLeft <= 0) return;

    const userMessage = overrideMessage || input.trim();
    if (!userMessage) return;

    // Update daily limit safely
    const today = new Date().toDateString();
    let currentCount = DAILY_LIMIT - questionsLeft;
    
    // Check if day changed while page was open
    try {
      const stored = localStorage.getItem('ai_chat_limit');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date !== today) {
          currentCount = 0;
        } else {
          currentCount = parsed.count;
        }
      }
    } catch (e) {
      // Ignore
    }

    const newCount = currentCount + 1;
    localStorage.setItem('ai_chat_limit', JSON.stringify({ date: today, count: newCount }));
    setQuestionsLeft(DAILY_LIMIT - newCount);

    if (!overrideMessage) setInput('');
    
    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    let aiMessage = "";

    try {
      // Call Supabase Edge Function
      // Use direct fetch to support Server-Sent Events (Streaming)
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If it's a JSON response, it might be an error or fallback response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (data.reply) {
          playNotificationSound();
          setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
          return;
        }
      }

      // Handle Streaming (Typewriter effect)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      // Add empty assistant message that will be populated
      playNotificationSound();
      setMessages([...newMessages, { role: 'assistant', content: "" }]);

      if (reader) {
        let buffer = "";
        
        const processLine = (line: string) => {
          if (line.trim().startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              // Extract just the JSON part, handling potential spaces
              const jsonStr = line.replace(/^data:\s*/, '');
              const data = JSON.parse(jsonStr);
              
              let chunkText = "";
              // OpenAI / Groq format
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                chunkText = data.choices[0].delta.content;
              }
              // Gemini format
              else if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                chunkText = data.candidates[0].content.parts[0].text;
              }

              if (chunkText) {
                aiMessage += chunkText;
                setMessages(currentMessages => {
                  const newArray = [...currentMessages];
                  newArray[newArray.length - 1] = { ...newArray[newArray.length - 1], content: aiMessage };
                  return newArray;
                });
              }
            } catch {
              // SSE parse error — skip malformed chunk
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            processLine(line);
          }
        }
        
        // Process any remaining text in the buffer if the stream ended without a trailing newline
        if (buffer.trim()) {
          processLine(buffer);
        }
      }
      
    } catch (error: unknown) {
      const err = error instanceof Error ? error : null;
      
      let errorMessage = "معلش يا هندسة، السيرفر فصل مني ثانية، ممكن تجرب تبعتلي تاني؟";
      
      if (err?.message?.includes('Gemini API Error')) {
        errorMessage = err.message;
      } else if (err?.message?.includes('RateLimit') || err?.message?.includes('429')) {
        errorMessage = "معلش يا هندسة، سيرفرات الذكاء الاصطناعي المجانية عليها ضغط عالمي فظيع دلوقتي (Rate Limited). جرب كمان شوية وهكون معاك طلقة!";
      }

      setMessages(currentMessages => {
        // If we already started streaming something, append the error
        if (aiMessage.length > 0) {
          const newArray = [...currentMessages];
          newArray[newArray.length - 1] = { 
            ...newArray[newArray.length - 1], 
            content: aiMessage + "\n\n[Error: " + errorMessage + "]" 
          };
          return newArray;
        }
        // Otherwise replace the placeholder
        return [...newMessages, { role: 'assistant', content: errorMessage }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLanguageSelect = (lang: 'ar' | 'en') => {
    playClickSound();
    setLanguageSelected(true);
    // Replace the initial language selection message with a natural, professional greeting
    const greeting = lang === 'ar' 
      ? "أهلاً بيك يا هندسة! أنا المساعد الذكي لمحمد غانم. إزاي أقدر أساعدك النهارده؟"
      : "Hello! I'm Mohamed's AI assistant. How can I help you today?";
    
    setMessages([{ role: 'assistant', content: greeting }]);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.1 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed bottom-24 right-4 sm:right-10 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[75vh] z-[100] bg-black/40 backdrop-blur-2xl border border-white/40 border-t-white/90 border-b-black/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            style={{ fontFamily: "'Inter', 'Cairo', sans-serif" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E60000]/20 flex items-center justify-center border border-[#E60000]/30">
                  <Bot className="w-4 h-4 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">AI Assistant</h3>
                  <p className="text-[#A0AAB2] text-xs">Always online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleResetChat}
                  title="New Chat / محادثة جديدة"
                  className="text-[#A0AAB2] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-[#A0AAB2] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 flex flex-col gap-4 custom-scrollbar"
              style={{ overflowAnchor: 'none' as any }}
            >
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-white/10' : 'bg-[#E60000]/20 border border-[#E60000]/30'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-[#E60000]" />}
                  </div>
                  <div 
                    dir="auto"
                    className={`p-3 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${msg.role === 'user' ? 'bg-red-600/50 border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_5px_15px_rgba(255,0,0,0.6),_inset_0_2px_5px_rgba(255,255,255,0.7),_inset_0_-4px_8px_rgba(150,0,0,0.8)] text-white rounded-tr-sm' : 'bg-black/40 border border-white/20 border-t-white/50 border-b-black/40 shadow-[0_5px_15px_rgba(0,0,0,0.4),_inset_0_1px_5px_rgba(255,255,255,0.2),_inset_0_-4px_8px_rgba(0,0,0,0.6)] text-[#D7E2EA] rounded-tl-sm'}`}
                  >
                    {renderMessageContent(msg.content, msg.role)}
                  </div>
                </div>
              ))}
              
              {!languageSelected && messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center gap-3 mt-2"
                >
                  <button
                    onClick={() => handleLanguageSelect('ar')}
                    className="px-6 py-2.5 bg-red-600/50 backdrop-blur-md border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_5px_15px_rgba(255,0,0,0.6),_inset_0_2px_5px_rgba(255,255,255,0.7),_inset_0_-4px_8px_rgba(150,0,0,0.8)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] hover:bg-red-500/60 hover:shadow-[0_10px_30px_rgba(255,0,0,1),_inset_0_4px_10px_rgba(255,255,255,0.9)] text-white rounded-xl text-sm transition-all font-medium"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className="px-6 py-2.5 bg-red-600/50 backdrop-blur-md border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_5px_15px_rgba(255,0,0,0.6),_inset_0_2px_5px_rgba(255,255,255,0.7),_inset_0_-4px_8px_rgba(150,0,0,0.8)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] hover:bg-red-500/60 hover:shadow-[0_10px_30px_rgba(255,0,0,1),_inset_0_4px_10px_rgba(255,255,255,0.9)] text-white rounded-xl text-sm transition-all font-medium"
                  >
                    English
                  </button>
                </motion.div>
              )}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-[#E60000]/20 flex items-center justify-center shrink-0 mt-1 border border-[#E60000]/30">
                    <Bot className="w-3 h-3 text-[#E60000]" />
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-white/20 border-t-white/50 border-b-black/40 shadow-[0_5px_15px_rgba(0,0,0,0.4),_inset_0_1px_5px_rgba(255,255,255,0.2),_inset_0_-4px_8px_rgba(0,0,0,0.6)] p-4 rounded-2xl rounded-tl-sm flex items-center gap-1">
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#A0AAB2] rounded-full" />
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#A0AAB2] rounded-full" />
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#A0AAB2] rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={questionsLeft <= 0 ? "Daily limit reached / نفذ رصيد الأسئلة" : (languageSelected ? "Ask me anything..." : "Select language first...")}
                  disabled={!languageSelected || isTyping || questionsLeft <= 0}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-[#A0AAB2] focus:outline-none focus:border-[#E60000]/50 focus:bg-white/10 resize-none h-[50px] custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={1}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || !languageSelected || questionsLeft <= 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-red-600/50 backdrop-blur-md border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_5px_15px_rgba(255,0,0,0.6),_inset_0_2px_5px_rgba(255,255,255,0.7),_inset_0_-4px_8px_rgba(150,0,0,0.8)] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500/60 hover:shadow-[0_15px_30px_rgba(255,0,0,1),_inset_0_4px_10px_rgba(255,255,255,0.9),_inset_0_-4px_8px_rgba(150,0,0,0.8)] hover:brightness-110 active:scale-95 disabled:active:scale-100"
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
              {languageSelected && (
                <div className="mt-2 text-center text-[10px] text-[#A0AAB2] font-medium opacity-70">
                  {questionsLeft > 0 
                    ? `${questionsLeft} questions remaining today`
                    : "You've reached your daily limit of 10 questions."}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group fixed right-6 sm:right-10 text-white rounded-full flex items-center justify-center z-[100] outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] duration-500 ease-in-out ${
          isOpen 
            ? 'bottom-10 sm:bottom-10 w-11 h-11' 
            : 'bottom-10 sm:bottom-10 w-14 h-14'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="w-full h-full flex items-center justify-center rounded-full bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)] group-hover:bg-red-500/60 group-hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] group-hover:brightness-110 transition-all duration-300"
            >
              <X className="w-5 h-5 [filter:drop-shadow(0px_0px_8px_rgba(255,255,255,0.9))]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full relative cursor-pointer"
            >
              {/* Responsive Wrapper for Wide Screens */}
              <div className="w-full h-full max-sm:scale-[0.85] sm:scale-95 md:scale-[1.1] lg:scale-[1.2] origin-bottom">
                <div className="w-full h-full scale-[1.6] -translate-y-[13px] origin-center relative z-10">
                  <RobotIcon />
                </div>
                {/* "Ask AI" Badge (Acts as the solid static pedestal) */}
                <div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] cursor-pointer z-0 transition-all duration-300 group-hover:bg-red-500/60 group-hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] group-hover:brightness-110"
                >
                  Ask AI
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};
