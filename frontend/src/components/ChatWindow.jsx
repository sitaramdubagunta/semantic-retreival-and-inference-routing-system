import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import PromptBox from "./PromptBox";

const API = "http://localhost:8000";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(prompt) {
    const assistantId = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId - 1,
        role: "user",
        content: prompt,
      },
      {
        id: assistantId,
        role: "assistant",
        content: "",
        metadata: null,
      },
    ]);

    try {
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
        throw new Error("Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.startsWith("data:")) continue;

          const raw = event.slice(5).trim();

          if (raw === "[DONE]") {
            return;
          }

          let data;

          try {
            data = JSON.parse(raw);
          } catch {
            continue;
          }

          if (data.type === "token") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: msg.content + data.content,
                    }
                  : msg
              )
            );
          }

          if (data.type === "meta") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      metadata: {
                        provider: data.provider,
                        model: data.model,
                        latency: data.latency_ms,
                      },
                    }
                  : msg
              )
            );
          }
        }
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: "Something went wrong.",
              }
            : msg
        )
      );
    }
  }

  return (
    <main className="flex h-screen flex-1 flex-col bg-black">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-8 pb-40">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-white">
              Adaptive LLM Gateway
            </h1>
            <p className="mt-4 text-zinc-500">Ask anything.</p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-8">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%]">
                  <div
                    className={`
                      rounded-2xl
                      px-5
                      py-4
                      leading-7
                      break-words
                      overflow-x-auto
                      ${
                        msg.role === "user"
                          ? "bg-white text-black whitespace-pre-wrap"
                          : "border border-zinc-800 bg-[#111] text-zinc-200 prose prose-invert max-w-none"
                      }
                    `}
                  >
                    {msg.content.length === 0 ? (
                      <span className="animate-pulse text-zinc-500">
                        Thinking...
                      </span>
                    ) : msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg my-4"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code
                                className="bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          // Custom styles for parsed tables
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4 border border-zinc-800 rounded-lg">
                              <table className="w-full text-left border-collapse text-sm text-zinc-300">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-zinc-900 border-b border-zinc-800 text-white font-semibold">{children}</thead>,
                          th: ({ children }) => <th className="p-3">{children}</th>,
                          td: ({ children }) => <td className="p-3 border-t border-zinc-800">{children}</td>,
                          // Custom styles for typical layout options
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-5 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="mb-4 last:mb-0 text-zinc-300">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1 text-zinc-300">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-zinc-300">{children}</ol>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {msg.role === "assistant" && msg.metadata && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span className="rounded-full border border-zinc-800 px-3 py-1">
                        {msg.metadata.provider}
                      </span>
                      <span className="rounded-full border border-zinc-800 px-3 py-1">
                        {msg.metadata.model}
                      </span>
                      <span className="rounded-full border border-zinc-800 px-3 py-1">
                        {msg.metadata.latency} ms
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <PromptBox onSend={sendMessage} />
    </main>
  );
}

export default ChatWindow;