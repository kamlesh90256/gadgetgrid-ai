export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-20">
      <p className="text-center text-sm text-gray-300">
        © {new Date().getFullYear()} GADGETGRID AI • Built with React, FastAPI, PostgreSQL & Gemini AI
      </p>
    </footer>
  );
}