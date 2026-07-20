import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">

        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          About GADGETGRID AI
        </h1>

        <p className="text-gray-700 text-lg leading-8">
          <strong>GADGETGRID AI</strong> is an AI-powered product intelligence
          platform designed to simplify online shopping through intelligent
          recommendations, AI-assisted product comparisons, personalized search,
          and interactive shopping assistance. The platform combines modern web
          technologies with Generative AI to help users make informed purchasing
          decisions faster and more confidently.
        </p>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">
            🚀 Key Features
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-white shadow rounded-xl p-5">
              🤖 AI Shopping Assistant
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              🔍 Smart Product Search
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              ⚖️ AI Product Comparison
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              💡 AI Product Summaries
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              ⭐ Reviews & Ratings
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              ❤️ Wishlist Management
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              🛒 Shopping Cart & Orders
            </div>

            <div className="bg-white shadow rounded-xl p-5">
              🔐 JWT Authentication & Secure Payments
            </div>

          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">
            💻 Technology Stack
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">
                Frontend
              </h3>

              <p>
                React.js, Vite, Tailwind CSS, React Router, Axios
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">
                Backend
              </h3>

              <p>
                FastAPI, SQLAlchemy, Python
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">
                Database
              </h3>

              <p>
                PostgreSQL
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">
                Artificial Intelligence
              </h3>

              <p>
                Google Gemini API, RAG (Retrieval-Augmented Generation)
              </p>
            </div>

          </div>
        </div>

        <div className="mt-12 bg-gray-50 border rounded-xl p-6">

          <h2 className="text-3xl font-bold mb-4">
            🎯 Project Vision
          </h2>

          <p className="text-gray-700 leading-8">
            GADGETGRID AI aims to bridge the gap between traditional
            e-commerce and Artificial Intelligence by delivering a smarter,
            faster, and more personalized shopping experience. Users can
            explore products, receive AI-generated insights, compare
            specifications intelligently, and manage purchases through a
            seamless and modern interface.
          </p>

        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">

          <h2 className="text-3xl font-bold mb-4">
            👨‍💻 Developer
          </h2>

          <p className="text-gray-700 leading-8">
            Developed by <strong>Kamlesh Kumar Yadav</strong>, a Full-Stack
            Software Developer passionate about Artificial Intelligence,
            Backend Development, and modern web technologies. This project
            demonstrates practical implementation of AI-powered e-commerce
            solutions using React, FastAPI, PostgreSQL, JWT Authentication,
            and Google Gemini.
          </p>

        </div>

      </div>

      <Footer />
    </>
  );
}