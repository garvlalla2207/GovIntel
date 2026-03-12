import React, { useState, useRef } from 'react';
import { Bot, X, Paperclip, Send, Loader2 } from 'lucide-react';
import api from '../../utils/axiosInstance';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! Upload a bill or document, and I will summarize it for you.' }
    ]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Add user message to UI
        setMessages(prev => [...prev, { role: 'user', text: `Uploaded: ${file.name}` }]);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/ai/summarize-doc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.success) {
                setMessages(prev => [...prev, { role: 'ai', text: res.summary }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: '❌ Failed to analyze document.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#00507A]/10 flex flex-col overflow-hidden h-[550px] animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-[#00507A] text-white p-5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Bot size={22} className="text-emerald-400" />
                            <h3 className="font-black text-xs uppercase tracking-widest">OSINT Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/30 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-4 text-sm shadow-sm max-w-[85%] ${
                                    m.role === 'user'
                                        ? 'bg-[#00507A] text-white rounded-2xl rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none'
                                }`}>
                                    {/* FIX: Move className to a wrapper div, NOT the ReactMarkdown component */}
                                    <div className="prose prose-sm prose-slate max-w-none break-words">
                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl border flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-[#00507A]" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI is reading...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".txt,.pdf,.doc,.docx"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-2.5 text-gray-400 hover:text-[#00507A] hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#00507A]/10"
                        />
                        <button className="p-3 bg-[#00507A] text-white rounded-xl shadow-lg hover:scale-105 transition-transform">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#00507A] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-white"
            >
                <Bot size={32} />
            </button>
        </div>
    );
}