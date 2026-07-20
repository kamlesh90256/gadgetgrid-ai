import { useEffect, useState } from "react";
import api from "../api/api";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await api.get("/products/ask", {
        params: {
          question: question,
        },
      });

      setAnswer(res.data.answer);
    } catch (err) {
      console.log(err);
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Shopping AI Assistant</h1>

      <hr />

      <h2>Ask AI</h2>

      <input
        type="text"
        placeholder="Ask anything..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "75%",
          padding: "10px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={askAI}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Ask AI
      </button>

      {loading && <p>Thinking...</p>}

      {answer && (
        <div
          style={{
            marginTop: "20px",
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>AI Answer</h3>
          <p>{answer}</p>
        </div>
      )}

      <hr />

      <h2>Products</h2>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid lightgray",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{product.name}</h3>

          <p>{product.description}</p>

          <b>Category:</b> {product.category}

          <br />

          <b>Price:</b> ₹{product.price}
        </div>
      ))}
    </div>
  );
}

export default ProductPage;