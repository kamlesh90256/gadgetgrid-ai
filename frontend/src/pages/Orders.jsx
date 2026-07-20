import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Orders() {

  const { token } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/orders/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (

          <h2>No Orders Found.</h2>

        ) : (

          orders.map((order) => (

            <div
              key={order.id}
              className="bg-white shadow rounded-xl p-6 mb-5"
            >
              <Link
  to={`/orders/${order.id}`}
  className="text-xl font-bold text-blue-600"
>
  Order #{order.id}
</Link>

              <p className="mt-2">
                Total :
                ₹{order.total.toLocaleString("en-IN")}
              </p>

              <p className="text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>

            </div>

          ))

        )}

      </div>

      <Footer />
    </>
  );
}