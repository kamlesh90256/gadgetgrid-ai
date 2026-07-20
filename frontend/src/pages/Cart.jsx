import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const removeItem = async (cartId) => {
  try {
    await axios.delete(
      `http://127.0.0.1:8000/cart/${cartId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCart();

  } catch (err) {
    console.error(err);
    alert("Unable to remove item.");
  }
};

const changeQuantity = async (cartId, newQuantity) => {
  if (newQuantity < 1 || newQuantity > 10) return;

  try {
    await axios.put(
      `http://127.0.0.1:8000/cart/${cartId}?quantity=${newQuantity}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCart();

  } catch (err) {
    console.error(err);
    alert("Unable to update quantity.");
  }
};

const total = cartItems.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
);
const handlePayment = async () => {
  
  console.log("KEY =", import.meta.env.VITE_RAZORPAY_KEY_ID);

  try {
    // Backend se Razorpay Order lo
    const { data } = await axios.post(
  "http://127.0.0.1:8000/payment/create-order",
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: data.amount,
  currency: data.currency,
  order_id: data.id,

  name: "GADGETGRID AI",
  description: "Product Purchase",

  prefill: {
    name: "Kamlesh Kumar Yadav",
    email: "yoyokamleshyadav7@gmail.com",
  },

  handler: async function (response) {

  try {

    await axios.post(
      "http://127.0.0.1:8000/payment/verify",
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await placeOrder();


    alert("🎉 Payment Successful");

    window.location.href = "/orders";

  } catch (err) {

    console.error(err);

    alert("❌ Payment Verification Failed");
  }

},

  modal: {
    ondismiss: function () {
      alert("Payment Cancelled");
    },
  },

  theme: {
    color: "#2563eb",
  },
};

    const razor = new window.Razorpay(options);
    razor.open();

  } catch (err) {
    console.error(err);
    alert("Unable to start payment.");
  }
};

const placeOrder = async () => {
  try {
    await axios.post(
      "http://127.0.0.1:8000/orders/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCart();

  } catch (err) {
    console.error(err);
    alert("Unable to place order.");
  }
};

  return (
  <>
    <Navbar />

    <div className="max-w-7xl mx-auto py-10 px-6 flex gap-8">

      {/* Left Side */}
      <div className="flex-1">

        <h1 className="text-4xl font-bold mb-8">
          🛒 My Cart
        </h1>

        {cartItems.length === 0 ? (
          <h2 className="text-center text-2xl text-gray-500">
            Your cart is empty.
          </h2>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center mb-6"
            >
              <div>
                <img
                  src="https://placehold.co/180x120?text=Laptop"
                  alt={item.product.name}
                  className="bg-white shadow-lg rounded-xl p-6 flex gap-6 items-center"
                />

                <h2 className="text-2xl font-bold">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.product.description}
                </p>

                <h3 className="text-blue-600 text-xl font-bold mt-3">
                  ₹{item.product.price.toLocaleString("en-IN")}
                </h3>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() =>
                      changeQuantity(item.id, item.quantity - 1)
                    }
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                  >
                    -
                  </button>

                  <span className="font-bold text-lg">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      changeQuantity(item.id, item.quantity + 1)
                    }
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))
        )}

      </div>

      {/* Right Side */}
      <div className="w-80 bg-white shadow-lg rounded-xl p-6 h-fit sticky top-24">

        <h2 className="text-2xl font-bold mb-6">
          Order Summary
        </h2>

        

        <div className="flex justify-between">
          <span>Items</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="flex justify-between mt-3">
          <span>Delivery</span>
          <span className="text-green-600">
            FREE
          </span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>
  ₹{total.toLocaleString("en-IN")}
</span>
        </div>

       <button
  onClick={handlePayment}
  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
>
  💳 Proceed to Payment
</button>

      </div>

    </div>

    <Footer />
  </>
);
}