import React, { useState } from 'react';
import { FileText, Send, Sparkles, Loader2, ArrowLeft, Bot, User } from 'lucide-react';
// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from 'react-router-dom';

export default function DocumentWorkspace({ docId, onBack }) {
  const { id } = useParams(); // Accessible dynamic ID from URL parameters
  const navigate = useNavigate();

  // Simulated active document state
  const [document] = useState({
    id: docId || 1,
    title: 'Financial_Statement_Q2.pdf',
    size: '4.2 MB',
    uploadedAt: 'Jun 14, 2026'
  });

  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hello! I've fully indexed ${document.title}. Ask me any specific operational questions or click the generator button to compute an automated summary matrix.` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Trigger Summary Pipeline
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      // Simulated API round-trip delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummary("This asset covers fiscal Q2 benchmarks. Highlights indicate total top-line revenue expansions by 14.2% quarter-over-quarter, primary operational outlays shifting toward infrastructure modernization pipelines, and key risk exposures contained safely within traditional corporate targets.");
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Trigger Chat Message Pipeline
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSendingMessage(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `This is a simulated workspace reply analyzing your specific inquiry regarding: "${userMessage.text}". Everything checks out cleanly within compliance metrics.`
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      {/* <Navbar /> */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 p-10">
          
          {/* Workspace Back Controls & Header Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/documents')} // Direct path route stack pop
                className="p-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
              >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E5BA73]" />
                <h1 className="text-xl font-medium text-[#0B1B33] font-serif tracking-wide">{document.title}</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Size: {document.size} • Uploaded {document.uploadedAt}</p>
            </div>
          </div>

          {/* Interactive Core Panel Layout Splits */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            
            {/* Left Column: Summary Generation Widget Box Module */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-sm font-semibold text-[#0B1B33] tracking-wide">Document Digest Matrix</h3>
                <button
                  onClick={handleGenerateSummary}
                  disabled={generatingSummary}
                  className="flex items-center gap-2 bg-[#0B1B33] hover:bg-[#162a4a] text-white disabled:opacity-50 text-xs font-medium py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {generatingSummary ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#E5BA73]" />
                  )}
                  <span>Generate Summary</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-3">
                {summary ? (
                  <div className="bg-[#F4F6F8]/50 border border-slate-100 p-4 rounded-xl animate-fade-in font-serif italic text-slate-700">
                    {summary}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Sparkles className="w-6 h-6 text-slate-300 mb-2" />
                    <p className="text-xs font-medium max-w-[220px]">Click the action tool above to build deep-learning summary data blocks.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Complete Interactive Chat Stream Panel Component */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl flex flex-col min-h-0 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              
              {/* Context Chat Feed Stream Wrapper */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, idx) => {
                  const isAi = msg.role === 'assistant';
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 max-w-[85%] animate-fade-in ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isAi ? 'bg-[#0B1B33]/5 text-[#0B1B33]' : 'bg-[#E5BA73]/10 text-[#bfa065]'}`}>
                        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${isAi ? 'bg-[#F4F6F8] text-[#0B1B33] rounded-tl-none' : 'bg-[#0B1B33] text-white rounded-tr-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {sendingMessage && (
                  <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1B33]/5 text-[#0B1B33] flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-[#F4F6F8] text-slate-400 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 font-medium">
                      <Loader2 className="w-3 h-3 animate-spin text-[#E5BA73]" /> Agent is analyzing content...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Text Controller Input Submit Bar Form Component */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask questions regarding ${document.title}...`}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0B1B33] placeholder:text-slate-400 outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || sendingMessage}
                  className="w-10 h-10 bg-[#0B1B33] hover:bg-[#162a4a] text-white disabled:opacity-40 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}