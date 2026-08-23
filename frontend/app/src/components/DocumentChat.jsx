import { useState } from "react";
import {Send, Loader2, Bot, User, Download} from "lucide-react";
import { documentsAPI, chatAPI } from "../services/api";
import Markdown from "./Markdown";

export default function DocumentChat({
  documentId,
  documentTitle
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello! I'm fully informed about ${documentTitle}. Ask me anything about this document.`
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      text: inputValue
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    setInputValue("");
    setSendingMessage(true);

    try {
      const data = await documentsAPI.chat(
        documentId,
        userMessage.text
      );

      console.log("Chat response:", data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer
        }
      ]);
    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages((prev) => [
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
      const blob = await chatAPI.downloadHistory(
        documentId
      );

      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");

      link.href = url;

      link.download =
        `${documentTitle.replace(/\.[^/.]+$/, "")}_chat_history.txt`;

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(
        "Failed to download chat history:",
        err
      );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col min-h-[550px] shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

        <h2 className="text-lg font-semibold text-[#0B1B33]">
          Document Chat
        </h2>

        <button
          onClick={handleDownloadHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B33] text-white hover:bg-[#293953] text-sm"
        >
          <Download className="w-4 h-4" />

          Download Chat History
        </button>

      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((msg, idx) => {
          const isAi = msg.role === "assistant";

          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] animate-fade-in ${
                isAi
                  ? "mr-auto"
                  : "ml-auto flex-row-reverse"
              }`}
            >

              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isAi
                    ? "bg-[#0B1B33]/5 text-[#0B1B33]"
                    : "bg-[#E5BA73]/10 text-[#bfa065]"
                }`}
              >
                {isAi ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message */}
              <div
                className={`p-3.5 rounded-2xl text-sm ${
                  isAi
                    ? "bg-[#F4F6F8] text-[#0B1B33] rounded-tl-none"
                    : "bg-[#0B1B33] text-white rounded-tr-none"
                }`}
              >
                {isAi ? (
                    <Markdown content={msg.text} />
                ) : (
                    <div className="leading-relaxed">
                        {msg.text}
                    </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Loading */}
        {sendingMessage && (
          <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">

            <div className="w-7 h-7 rounded-lg bg-[#0B1B33]/5 text-[#0B1B33] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>

            <div className="bg-[#F4F6F8] text-slate-400 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 font-medium">

              <Loader2 className="w-3 h-3 animate-spin text-[#E5BA73]" />

              Agent is analyzing content...

            </div>

          </div>
        )}

      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex gap-2"
      >

        <input
          type="text"
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          placeholder={`Ask questions regarding ${documentTitle}...`}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0B1B33] placeholder:text-slate-400 outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
        />

        <button
          type="submit"
          disabled={
            !inputValue.trim() ||
            sendingMessage
          }
          className="w-10 h-10 bg-[#0B1B33] hover:bg-[#162a4a] text-white disabled:opacity-40 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
}