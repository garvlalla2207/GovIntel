// src/components/ui/AIAssistant.jsx
import React, { useState } from 'react';
import { Bot, X, Paperclip, Send } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-[#FFFFFF] rounded-2xl shadow-[0_8px_30px_rgba(0,80,122,0.15)] border border-[#00507A]/10 flex flex-col overflow-hidden transition-all h-[500px]">
          {/* Header */}
          <div className="bg-[#00507A] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-[#966B9D]" />
              <h3 className="font-semibold text-sm">Intelligent Policy Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-[#C68080] transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            <div className="flex justify-start">
              <div className="bg-white border border-[#00507A]/10 text-gray-700 text-sm p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-[85%]">
                Hello! I can summarize bills, cross-reference manifesto promises, or analyze political outcomes. How can I assist you today?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#00507A] text-white text-sm p-3 rounded-tl-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-[85%]">
                Show me promises related to digital infrastructure.
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-[#966B9D] transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-[#00507A]/30 focus:ring-0 rounded-lg py-2 px-3 text-sm text-gray-800 outline-none"
            />
            <button className="p-2 bg-[#00507A] text-white rounded-lg hover:bg-[#00507A]/90 transition-colors shadow-[0_0_8px_rgba(150,107,157,0.4)]">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#00507A] text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,80,122,0.4)] hover:scale-105 transition-transform float-right"
      >
        <Bot size={28} />
      </button>
    </div>
  );
}