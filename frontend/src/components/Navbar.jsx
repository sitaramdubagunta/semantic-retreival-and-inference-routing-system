import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">

      <div
        className="
        flex
        w-full
        max-w-3xl
        items-center
        justify-between
        rounded-full
        border
        border-white/10
        bg-black/70
        px-7
        py-4
        backdrop-blur-xl
        "
      >

        <Link
          to="/"
          className="text-lg font-semibold"
        >
          LLM Gateway
        </Link>

        <div className="hidden items-center gap-8 md:flex">

          <a
            href="https://github.com"
            className="text-zinc-400 hover:text-white transition"
          >
            GitHub
          </a>

          <Link
            to="/auth"
            className="text-zinc-400 hover:text-white transition"
          >
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;