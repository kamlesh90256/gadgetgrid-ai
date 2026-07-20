import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/products/"
      );

      setProducts(res.data);
      setFilteredProducts(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-6">
          🛍 Products
        </h1>

        <SearchBar
          products={products}
          setFilteredProducts={setFilteredProducts}
        />

        <p className="text-red-500 mt-4 mb-6">
          Total Products : {filteredProducts.length}
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {filteredProducts.map((product) => (

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