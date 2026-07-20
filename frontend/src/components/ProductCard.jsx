import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const { token, isAuthenticated } = useAuth();

  const addToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/cart/",
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Unable to add product to cart.");
    }
  };

const addToWishlist = async () => {
  if (!isAuthenticated) {
    alert("Please login first.");
    navigate("/login");
    return;
  }

  try {
    await axios.post(
      "http://127.0.0.1:8000/wishlist/",
      {
        product_id: product.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("❤️ Added to Wishlist");
  } catch (err) {
    console.error(err);
  }
};  

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <img
  src={
    product.image_url
      ? `http://127.0.0.1:8000${product.image_url}`
      : "/no-image.png"
  }
  alt={product.name}
  className="w-full h-64 object-cover rounded-lg"
/>

      <div className="p-5">

        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-500 mt-2">
          {product.description}
        </p>

        <h3 className="text-2xl font-bold text-blue-600 mt-4">
          ₹{product.price}
        </h3>

        <Link
  to={`/product/${product.id}`}
  className="block mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center"
>
  View Product
</Link>
<button
  onClick={() => addToCart(product.id)}
  className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
>
  Add to Cart
</button>

<button
  onClick={addToWishlist}
  className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
>
  <FaHeart />
  Wishlist
</button>
      </div>

    </div>
  );
}