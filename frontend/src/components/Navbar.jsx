import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log(user);
  console.log("ROLE =", user?.role);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-3xl font-bold text-blue-400"
        >
          GADGETGRID AI
        </Link>

        <div className="flex gap-8 items-center">

          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          <Link to="/products" className="hover:text-blue-400 transition">
            Products
          </Link>

          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>

          {isAuthenticated ? (
  <>
    <span className="text-green-400 font-semibold">
      {user?.email}
    </span>

    <button
      onClick={handleLogout}
      className="hover:text-red-400"
    >
      Logout
    </button>

    <Link to="/cart">
      <FaShoppingCart size={22} />
    </Link>

    <Link
  to="/wishlist"
  className="text-white hover:text-red-400 flex items-center gap-2"
>
  <FaHeart />
  Wishlist
</Link>

    <Link to="/orders">
  Orders🛍️
</Link>

{user?.role === "admin" && (
  <Link
    to="/admin"
    className="text-yellow-400 hover:text-yellow-300 font-semibold"
  >
    Admin
  </Link>
)}


  </>
) : (
  <>
    <Link to="/login">Login</Link>

    <Link
      to="/register"
      className="bg-blue-600 px-4 py-2 rounded-lg"
    >
      Register
    </Link>
  </>

  
)}

        </div>
      </div>
    </nav>
  );
}