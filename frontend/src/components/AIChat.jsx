import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api/api";

export default function AIChat() {

  const [mode, setMode] = useState("ask");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [products, setProducts] = useState([]);
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
    setAnswer("");

    try {
      const res = await api.get("/products/ask", {
        params: {
          question,
        },
      });

      setAnswer(res.data.answer);

    } catch (err) {
      console.log(err);
      setAnswer("Unable to get AI response.");
    }

    setLoading(false);
  };

  const compareProducts = async () => {

    if (!product1 || !product2) {
      alert("Please select both products.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {

      const res = await api.get("/products/compare", {
        params: {
          product1,
          product2,
        },
      });

      setAnswer(res.data.comparison);

    } catch (err) {
      console.log(err);
      setAnswer("Unable to compare products.");
    }

    setLoading(false);
  };

  return (

<div className="bg-white shadow-xl rounded-2xl p-8">

<h2 className="text-3xl font-bold mb-6">
🤖 Shopping AI Assistant
</h2>

<div className="flex gap-4 mb-8">

<button
onClick={() => {
setMode("ask");
setAnswer("");
}}
className={`px-6 py-3 rounded-lg font-semibold transition ${
mode==="ask"
? "bg-blue-600 text-white"
: "bg-gray-200 hover:bg-gray-300"
}`}
>
Ask AI
</button>

<button
onClick={()=>{
setMode("compare");
setAnswer("");
}}
className={`px-6 py-3 rounded-lg font-semibold transition ${
mode==="compare"
? "bg-green-600 text-white"
: "bg-gray-200 hover:bg-gray-300"
}`}
>
Compare Products
</button>

</div>

{mode==="ask" && (

<div>

<input
type="text"
placeholder="Ask anything about products..."
className="w-full border rounded-lg p-4 mb-4"
value={question}
onChange={(e)=>setQuestion(e.target.value)}
/>

<button
onClick={askAI}
className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
>
Ask AI
</button>

</div>

)}

{mode==="compare" && (

<div>

<select
className="w-full border rounded-lg p-4 mb-4"
value={product1}
onChange={(e)=>setProduct1(e.target.value)}
>

<option value="">
Select First Product
</option>

{products.map(product=>(
<option
key={product.id}
value={product.name}
>
{product.name}
</option>
))}

</select>

<select
className="w-full border rounded-lg p-4 mb-4"
value={product2}
onChange={(e)=>setProduct2(e.target.value)}
>

<option value="">
Select Second Product
</option>

{products.map(product=>(
<option
key={product.id}
value={product.name}
>
{product.name}
</option>
))}

</select>

<button
onClick={compareProducts}
className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
>
⚖️ Compare Products
</button>

</div>

)}

{loading && (
  <div className="flex items-center gap-2 text-blue-600 mt-5">
    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>

    {mode === "ask"
      ? "Thinking..."
      : "Comparing products..."}
  </div>
)}

{answer && (
<div className="mt-8 bg-white rounded-2xl shadow-lg border p-6">
  <h2 className="text-2xl font-bold mb-5">
    🤖 AI Product Comparison Report
  </h2>

  <div className="prose max-w-none overflow-x-auto">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {answer}
    </ReactMarkdown>
</div>
</div>

)}

</div>

);

}