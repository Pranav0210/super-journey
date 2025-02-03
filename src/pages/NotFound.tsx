import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#161D6F]">
      <svg
        className="w-64 h-64 mb-8"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="96" stroke="#161D6F" strokeWidth="8" />
        <path
          d="M60 60L140 140M140 60L60 140"
          stroke="#161D6F"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      {/* <Link
        to="/"
        className="px-6 py-3 bg-[#161D6F] text-white rounded-md hover:bg-opacity-90 transition-colors"
      >
        Go Home
      </Link> */}
    </div>
  );
}
