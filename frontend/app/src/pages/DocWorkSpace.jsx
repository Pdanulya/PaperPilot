import React, { useState, useEffect } from 'react';
import { FileText, Send, Sparkles, Loader2, ArrowLeft, Bot, User } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from 'react-router-dom';
import { documentsAPI, chatAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import Markdown from "../components/Markdown";

export default function DocumentWorkspace({ docId, onBack }) {
  const { id } = useParams(); // Accessible dynamic ID from URL parameters
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const [document, setDocument] = useState(null); // Load the document
  const [loading, setLoading] = useState(true);
  const { showToast } = useApp();
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const data = await documentsAPI.getOne(id);
      console.log(data);
      setDocument(data);

      setMessages([
        {
          role: "assistant",
          text: `Hello! I'm fully informed about ${data.title}. Ask me anything about this document.`
        }
      ]);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Document not found.
      </div>
    );
  }

  // Trigger Summary Pipeline
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);

    try {
      const data = await documentsAPI.summary(id);

      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Trigger Chat Message Pipeline
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);

    setInputValue("");
    setSendingMessage(true);

    try {
      const data = await documentsAPI.chat(id, userMessage.text);

      console.log("Chat response:", data);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.answer
        }
      ]);

    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't process your question. Please try again."
        }
      ]);

    } finally {
      setSendingMessage(false);
    }
  };

  const handleDownloadHistory = async () => {
  try {
    const blob = await chatAPI.downloadHistory(id);

    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement("a");

    link.href = url;
    link.download = `${document.title.replace(/\.[^/.]+$/, "")}_chat_history.txt`;

    window.document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download chat history:", err);
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
              <div className="flex items-center gap-3">

                  <FileText className="text-[#E5BA73]" />

                  <div>

                      <h1 className="text-2xl font-serif">

                          {document.title}

                      </h1>

                      <p className="text-sm text-slate-500">

                          {document.file_type.toUpperCase()} • Uploaded {new Date(document.uploaded_at).toLocaleDateString()}

                      </p>

                  </div>

              </div>
            </div>
          </div>

          {/* Interactive Core Panel Layout Splits */}
          <div className="flex-1 flex flex-col gap-6 min-h-0">

            {/* <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
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
            </div> */}
            {/* ================= DOCUMENT VIEWER ================= */}

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                  <h2 className="text-lg font-semibold text-[#0B1B33] mb-4">
                      Document
                  </h2>

                  <div
                      className={`${
                          expanded ? "" : "max-h-[450px]"
                      } overflow-hidden`}
                  >

                      <pre className="whitespace-pre-wrap leading-7 text-sm text-slate-700 font-sans">
                         {document.raw_text || "No text extracted from this document."}
                      </pre>

                  </div>

                  <div className="flex justify-center mt-5">

                      <button
                          onClick={() => setExpanded(!expanded)}
                          className="text-[#0B1B33] font-medium hover:underline"
                      >
                          {expanded ? "Show Less" : "Read More"}
                      </button>

                  </div>

              </div>
                         
              {/* Left Column: Summary Generation Widget Box Module */}

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-[#0B1B33]">
                        Summary
                    </h2>

                    <button
                        onClick={handleGenerateSummary}
                        disabled={generatingSummary}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B33] text-white hover:bg-[#293953]"
                    >
                        {generatingSummary
                            ? <Loader2 className="w-4 h-4 animate-spin"/>
                            : <Sparkles className="w-4 h-4 text-[#E5BA73]"/>
                        }
                        Generate Summary
                    </button>
                </div>
                {summary ? (
                    <Markdown content={summary} />
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        Click "Generate Summary" to create an AI summary.
                    </div>
                )}
            </div>

            {/* Right Column: Complete Interactive Chat Stream Panel Component */}
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col min-h-[550px] shadow-sm">

              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-[#0B1B33]">
                  Document Chat 
                </h2>

                <button
                  onClick={handleDownloadHistory}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B33] text-white hover:bg-[#293953]"
                >
                  Download Chat History
                </button>
              </div>

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