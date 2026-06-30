import Navbar from "../components/Navbar";
import heroImage from "../assets/hero.png";

const models = [
  "GPT-OSS 120B",
  "GPT-OSS 20B",
  "Gemini 2.5 Pro",
  "Gemini 2.5 Flash",
  "Qwen 3 32B",
  "Qwen 3.6 27B",
  "Compound",
  "Whisper",
  "Llama Scout"
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-40 pb-12">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div className="order-2 lg:order-1">

            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
              Adaptive AI Infrastructure
            </p>

            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Adaptive
              <br />
              LLM Gateway
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
              Route every request to the best model based on complexity,
              latency and capability.
            </p>

            <button
              className="
              mt-10
              rounded-full
              border
              border-white/15
              px-8
              py-4
              transition
              hover:bg-white
              hover:text-black
              "
            >
              Launch Gateway →
            </button>

            <div className="mt-12 flex flex-wrap gap-3">

              {models.map((model) => (
                <span
                  key={model}
                  className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-4
                  py-2
                  text-sm
                  text-zinc-400
                  "
                >
                  {model}
                </span>
              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="order-1 flex justify-center lg:order-2">

            <img
              src={heroImage}
              alt=""
              draggable="false"
              className="
              w-full
              max-w-md
              lg:max-w-xl
              xl:max-w-2xl
              object-contain
              select-none
              "
            />

          </div>

        </div>

      </main>

    </div>
  );
};

export default Landing;