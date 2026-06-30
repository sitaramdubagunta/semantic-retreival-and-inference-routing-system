import { useState } from "react";
import PromptBox from "./PromptBox";

const API = "http://localhost:8000";

function ChatWindow() {
  const [messages, setMessages] = useState([]);

  async function sendMessage(prompt) {
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };

    // Empty assistant bubble
    const assistantId = Date.now() + 1;

    const assistantMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    if (!response.ok) {
      console.error("Failed");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop();

      for (const event of events) {
        if (!event.startsWith("data:")) continue;

        const token = event.replace("data:", "").trim();

        if (token === "[DONE]") {
          return;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: msg.content + token,
                }
              : msg
          )
        );
      }
    }
  }

  return (
    <main className="flex h-screen flex-1 flex-col bg-black">

      <div className="flex-1 overflow-y-auto px-8 py-8">

        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            Start a conversation.
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8">

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-white text-black"
                      : "border border-zinc-800 bg-[#111] text-white"
                  }`}
                >
                  {msg.content || (
                    <span className="animate-pulse text-zinc-500">
                      Thinking...
                    </span>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      <PromptBox onSend={sendMessage} />

    </main>
  );
}

export default ChatWindow;