import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AIChat from "../components/AIChat";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
  axios
    .get("http://127.0.0.1:8000/products/")
    .then((res) => {
      console.log("Products:", res.data);   // 👈 Add this
      setProducts(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

  return (
    <>
      <Navbar />

      <Hero />

      <AIChat />

      <div className="max-w-7xl mx-auto px-6 py-10">

  <h2 className="text-3xl font-bold mb-6">Products</h2>

  <p className="text-red-600">
    Total Products: {products.length}
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))}
  </div>

</div>

      <Footer />
    </>
  );
}

export default Home;