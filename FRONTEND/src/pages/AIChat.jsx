import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api";

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Zidi financial assistant. Ask me anything about your business finances.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const data = await api.post("/api/ai/chat", { message: input });

    const aiMessage = {
      role: "assistant",
      content: data.reply || "Sorry I couldn't process that. Please try again.",
    };
    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        <h1 className="text-2xl font-bold text-white mb-6">AI Assistant</h1>

        {/* Messages */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 overflow-y-auto flex flex-col gap-4 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-400 px-4 py-3 rounded-2xl text-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AIChat;
