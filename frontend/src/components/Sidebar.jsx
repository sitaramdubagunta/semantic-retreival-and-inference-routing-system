import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const models = [
    "GPT-OSS 120B",
    "Gemini 2.5 Pro",
    "Qwen 3",
    "Compound",
    "Whisper",
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-zinc-900 bg-[#090909] p-6 lg:flex">

      {/* Logo */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          LLM Gateway
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Adaptive AI Router
        </p>
      </div>

      {/* New Chat */}
      <button
        className="
        mt-8
        rounded-xl
        border
        border-zinc-800
        bg-[#111]
        py-3
        text-white
        transition
        hover:bg-zinc-800
        "
      >
        + New Chat
      </button>

      {/* Available Models */}
      <div className="mt-10">

        <p className="mb-4 text-xs uppercase tracking-widest text-zinc-500">
          Available Models
        </p>

        <div className="space-y-2">

          {models.map((model) => (
            <div
              key={model}
              className="
              rounded-lg
              border
              border-zinc-800
              bg-[#111]
              px-4
              py-3
              text-sm
              text-zinc-300
              "
            >
              {model}
            </div>
          ))}

        </div>

      </div>

      {/* Bottom */}
      <div className="mt-auto space-y-4">

        <div className="rounded-xl border border-zinc-800 bg-[#111] p-4">

          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Gateway Status
          </p>

          <div className="mt-3 flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-green-500"></div>

            <span className="text-sm text-zinc-300">
              Online
            </span>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="
          w-full
          rounded-xl
          border
          border-red-900
          py-3
          text-red-400
          transition
          hover:bg-red-950/40
          "
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;