import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar } from "react-icons/fa";


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [summary, setSummary] = useState("");
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
  fetchProduct();
  fetchReviews();
  fetchRecommendations();
}, [id]);

  const fetchRecommendations = async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/products/${id}/recommendations`
    );

    setRecommended(res.data);
  } catch (err) {
    console.error("Recommendation Error:", err);
    setRecommended([]);
  }
};

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/${id}`
      );

      setProduct(res.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    }
  };
const fetchReviews = async () => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/reviews/${id}`
    );

    setReviews(res.data);
  } catch (err) {
    console.error(err);
  }
};  

  const submitReview = async () => {
  if (!token) {
    alert("Please login first.");
    return;
  }

  try {
    await axios.post(
      "http://127.0.0.1:8000/reviews/",
      {
        product_id: Number(id),
        rating: Number(rating),
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Review Added ⭐");

    setComment("");
    setRating(5);

    fetchReviews();

  } catch (err) {
    console.error(err);
  }
};

  const addToCart = async () => {
    console.log("TOKEN =", token);
console.log("LOCAL STORAGE =", localStorage.getItem("token"));
  if (!token) {
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
    alert("Unable to add product.");
  }
};

const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

    
  if (!product) {
    return (
      <>
        <Navbar />
        <h1 className="text-center text-3xl mt-20">
          Loading...
        </h1>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6">

  <div className="bg-white shadow-xl rounded-2xl p-8">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

    <img
  src={
    product.image_url
      ? `http://127.0.0.1:8000${product.image_url}`
      : "/no-image.png"
  }
  alt={product.name}
  className="w-full h-112.5 object-contain bg-gray-100 rounded-xl p-4"
/>

<div className="flex flex-col">

  <h1 className="text-4xl font-bold">
    {product.name}
  </h1>

  <p className="text-gray-500 mt-3">
    {product.category}
  </p>

  <h2 className="text-3xl font-bold text-blue-600 mt-5">
    ₹{product.price.toLocaleString("en-IN")}
  </h2>

  <div className="flex items-center gap-1 mt-4 text-yellow-500">
    <FaStar />
    <FaStar />
    <FaStar />
    <FaStar />
    <FaStar />

    <span className="text-gray-600 ml-2">
      ({reviews.length} Reviews)
    </span>
  </div>

  <p className="mt-6 text-gray-700 leading-8">
    {product.description}
  </p>

  <div className="flex gap-4 mt-8">

    <button
      onClick={addToCart}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
    >
      🛒 Add to Cart
    </button>

    <button
      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg"
    >
      ❤️ Wishlist
    </button>

  </div>

</div>  

</div>   {/* Product Info */}
</div>   {/* Grid */}


<div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-5">

  
  <h3 className="text-xl font-bold mb-3">
    🤖 AI Summary
  </h3>

  <p className="text-gray-700 leading-7">
    {summary}
  </p>
</div>

<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    ⭐ {averageRating} ({reviews.length} Reviews))
  </h2>

  <select
  value={rating}
  onChange={(e) => setRating(Number(e.target.value))}
  className="border rounded p-2"
>
  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
  <option value={4}>⭐⭐⭐⭐ (4)</option>
  <option value={3}>⭐⭐⭐ (3)</option>
  <option value={2}>⭐⭐ (2)</option>
  <option value={1}>⭐ (1)</option>
</select>

  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    placeholder="Write your review..."
    className="border p-3 rounded w-full mt-3"
  />

  <button
    onClick={submitReview}
    className="mt-3 bg-blue-600 text-white px-5 py-2 rounded"
  >
    Submit Review
  </button>

  <div className="mt-8">

  {reviews.length === 0 ? (

    <div className="bg-gray-50 border rounded-xl p-6 text-center text-gray-500">
      No reviews yet. Be the first to review! ⭐
    </div>

  ) : (

    reviews.map((review) => (
      <div
        key={review.id}
        className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex text-yellow-500 text-xl">
            {"★".repeat(Math.floor(review.rating))}
            {"☆".repeat(5 - Math.floor(review.rating))}
          </div>

          <span className="text-sm text-gray-500">
            {review.rating}/5
          </span>
        </div>

        <p className="mt-4 text-gray-700 leading-7">
          {review.comment}
        </p>
      </div>
    ))

  )}

</div> 
  {/* Reviews */}

  <h2 className="text-2xl font-bold mt-12 mb-6">
  🔥 AI Recommended Products
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  {recommended.map((item) => (

    <div
      key={item.id}
      className="bg-white border rounded-xl p-4 shadow hover:shadow-lg"
    >

      <img
        src={`http://127.0.0.1:8000${item.image_url}`}
        alt={item.name}
        className="h-40 w-full object-contain"
      />

      <h3 className="font-bold mt-s3">
        {item.name}
      </h3>

      <p className="text-blue-600 font-bold">
        ₹{item.price}
      </p>

      <button
        onClick={() => navigate(`/product/${item.id}`)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
      >
        View
      </button>

    </div>

  ))}

</div>

</div>   {/* White Card */}

</div>   {/* max-w-7xl */}

<Footer />
    </>
  );
}