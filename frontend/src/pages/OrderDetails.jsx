import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [token, id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setOrder(res.data);
    } catch (err) {
      console.log(err.response?.status);
      console.log(err.response?.data);
      console.error(err);
    }
  };

  // Loading Screen
  if (!order) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold">
            Loading...
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-8">
          📦 Order #{order.id}
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6">

          <p className="text-gray-500 mb-6">
            {new Date(order.created_at).toLocaleString()}
          </p>

          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="border-b py-5"
            >
              <h2 className="text-2xl font-bold">
                {item.product.name}
              </h2>

              <p className="mt-2">
                Quantity : {item.quantity}
              </p>

              <p>
                Price : ₹{item.price}
              </p>
            </div>
          ))}

          <h2 className="text-3xl font-bold text-blue-600 mt-8">
            Total : ₹{order.total.toLocaleString("en-IN")}
          </h2>

        </div>
      </div>

      <Footer />
    </>
  );
}