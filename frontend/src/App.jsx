import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  async function callBackend() {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();

    setMessage(data.message);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <button
        onClick={callBackend}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Call Backend
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;