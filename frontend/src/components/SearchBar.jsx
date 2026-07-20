import { useState } from "react";

export default function SearchBar({
  products,
  setFilteredProducts,
}) {

  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search products..."
      className="w-full border rounded-lg p-3 mb-6"
    />
  );
}