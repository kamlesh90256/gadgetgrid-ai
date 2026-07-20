import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Wishlist() {

  const { token } = useAuth();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/wishlist/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setWishlist(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const removeWishlist = async (id) => {
  try {
    await axios.delete(
      `http://127.0.0.1:8000/wishlist/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchWishlist();

  } catch (err) {
    console.error(err);
  }
};

const moveToCart = async (wishlistItem) => {
  try {
    // Cart me add karo
    await axios.post(
      "http://127.0.0.1:8000/cart/",
      {
        product_id: wishlistItem.product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Wishlist se remove karo
    await axios.delete(
      `http://127.0.0.1:8000/wishlist/${wishlistItem.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("🛒 Moved to Cart");

    fetchWishlist();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-10">

        <h1 className="text-4xl font-bold mb-8">
          ❤️ My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <h2 className="text-gray-500">
            Your wishlist is empty.
          </h2>
        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {wishlist.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-5"
              >

                <img
                  src="https://placehold.co/400x250?text=Laptop"
                  alt={item.product.name}
                  className="rounded-lg"
                />

                <h2 className="text-xl font-bold mt-4">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.product.description}
                </p>

                <h3 className="text-blue-600 text-2xl font-bold mt-4">
                  ₹{item.product.price}
                </h3>

                <button
                  onClick={() => removeWishlist(item.id)}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          🗑 Remove
        </button>
        <button
  onClick={() => moveToCart(item)}
  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
>
  🛒 Move to Cart
</button>

        

              </div>

            ))}

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}