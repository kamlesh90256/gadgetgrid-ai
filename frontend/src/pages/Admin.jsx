import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Admin() {
  const [dashboard, setDashboard] = useState({
  products: 0,
  orders: 0,
  users: 0,
  revenue: 0,
});

const [showModal, setShowModal] = useState(false);

const [products, setProducts] = useState([]);

const [orders, setOrders] = useState([]);

const [users, setUsers] = useState([]);

const [currentUser, setCurrentUser] = useState(null);

const [recentOrders, setRecentOrders] = useState([]);

const [topProducts, setTopProducts] = useState([]);

const [productSearch, setProductSearch] = useState("");

const [userSearch, setUserSearch] = useState("");

const [orderSearch, setOrderSearch] = useState("");

const PRODUCTS_PER_PAGE = 5;

const [productPage, setProductPage] = useState(1);

const ORDERS_PER_PAGE = 5;
const [orderPage, setOrderPage] = useState(1);

const USERS_PER_PAGE = 5;
const [userPage, setUserPage] = useState(1);

const [analytics, setAnalytics] = useState({
  monthly_revenue: [],
  order_status: [],
});

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];


const [editingId, setEditingId] = useState(null);

const [isEditing, setIsEditing] = useState(false);

const [form, setForm] = useState({
  name: "",
  description: "",
  category: "",
  price: "",
  image_url: "",
});

const [selectedImage, setSelectedImage] = useState(null);
const [preview, setPreview] = useState("");


const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDashboard(res.data);

  } catch (err) {
    console.log(err);
  }
};

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAnalytics((prev) => ({
  ...prev,
  monthly_revenue: res.data.monthly_revenue || [],
}));

  } catch (err) {
    console.log(err);
  }
};

const fetchRecentOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/recent-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRecentOrders(res.data);
  } catch (err) {
    console.log(err);
  }
};

const fetchOrderStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/order-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAnalytics((prev) => ({
      ...prev,
      order_status: res.data,
    }));
  } catch (err) {
    console.log(err);
  }
};

const fetchTopProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/top-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTopProducts(res.data);
  } catch (err) {
    console.log(err);
  }
};

const fetchProducts = async () => {
  try {
    const res = await api.get("/products");

    setProducts(res.data);

  } catch (err) {
    console.log(err);
  }
};

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(res.data);
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (id) => {
  if (!window.confirm("Delete this product?")) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
    fetchDashboard();

  } catch (err) {
    console.log(err);
  }
};

const uploadImage = async () => {
  if (!selectedImage) return "";

  const data = new FormData();
  data.append("file", selectedImage);

  const res = await api.post("/upload/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.image_url;
};

const addProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    const imageUrl = await uploadImage();

await api.post(
  "/products",
  {
    ...form,
    image_url: imageUrl,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    fetchProducts();
    fetchDashboard();

    setShowModal(false);

    setForm({
  name: "",
  description: "",
  category: "",
  price: "",
  image_url: "",
});

setSelectedImage(null);
setPreview("");

  } catch (err) {
    console.log(err);
    alert("Failed to add product");
  }
};

const updateProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    let imageUrl = form.image_url;

if (selectedImage) {
  imageUrl = await uploadImage();
}

await api.put(
  `/products/${editingId}`,
  {
    ...form,
    image_url: imageUrl,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    fetchProducts();
    fetchDashboard();

    setShowModal(false);

    setIsEditing(false);
    setEditingId(null);

    setForm({
  name: "",
  description: "",
  category: "",
  price: "",
  image_url: "",
});

setSelectedImage(null);
setPreview("");

  } catch (err) {
    console.log(err);
    alert("Failed to update product");
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/admin/orders/${id}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();

  } catch (err) {
    console.log(err);
  }
};

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);

  } catch (err) {
    console.log(err);
  }
};

const updateUserRole = async (id, role) => {
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/admin/users/${id}?role=${role}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchUsers();

  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUsers();
    fetchDashboard();

  } catch (err) {
  console.log(err);

  alert(
    err.response?.data?.detail || "Failed to delete user"
  );
}
};

useEffect(() => {
  fetchDashboard();
  fetchProducts();
  fetchOrders();
  fetchUsers();
  fetchAnalytics();
  fetchRecentOrders();
  fetchOrderStatus();
  fetchTopProducts();
}, []);

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(productSearch.toLowerCase())
);

const lastProduct = productPage * PRODUCTS_PER_PAGE;
const firstProduct = lastProduct - PRODUCTS_PER_PAGE;

const currentProducts = filteredProducts.slice(
  firstProduct,
  lastProduct
);

const totalProductPages = Math.ceil(
  filteredProducts.length / PRODUCTS_PER_PAGE
);

const filteredUsers = users.filter((user) =>
  user.fullname.toLowerCase().includes(userSearch.toLowerCase()) ||
  user.email.toLowerCase().includes(userSearch.toLowerCase())
);
const lastUser = userPage * USERS_PER_PAGE;
const firstUser = lastUser - USERS_PER_PAGE;

const currentUsers = filteredUsers.slice(
  firstUser,
  lastUser
);

const totalUserPages = Math.ceil(
  filteredUsers.length / USERS_PER_PAGE
);

const filteredOrders = orders.filter((order) =>
  order.id.toString().includes(orderSearch) ||
  order.status.toLowerCase().includes(orderSearch.toLowerCase()) ||
  order.user_id.toString().includes(orderSearch)
);
const lastOrder = orderPage * ORDERS_PER_PAGE;
const firstOrder = lastOrder - ORDERS_PER_PAGE;

const currentOrders = filteredOrders.slice(
  firstOrder,
  lastOrder
);

const totalOrderPages = Math.ceil(
  filteredOrders.length / ORDERS_PER_PAGE
);
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          👨‍💼 Admin Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Manage products, orders and users.
        </p>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Products
            </h3>

            <p className="text-4xl font-bold mt-3 text-blue-600">
               {dashboard.products}
            </p> 
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Orders
            </h3>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {dashboard.orders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Users
            </h3>

            <p className="text-4xl font-bold mt-3 text-purple-600">
              {dashboard.users}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Revenue
            </h3>

            <p className="text-4xl font-bold mt-3 text-red-600">
              ₹{dashboard.revenue}
            </p>
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">

  <h2 className="text-2xl font-bold mb-6">
    Revenue Analytics
  </h2>

  <ResponsiveContainer width="100%" height={300}>
  <BarChart
  data={topProducts}
  layout="vertical"
  margin={{
    top: 20,
    right: 30,
    left: 30,
    bottom: 10,
  }}
>

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Bar
  dataKey="sold"
  fill="#3B82F6"
  radius={[0, 8, 8, 0]}
/>

    </BarChart>
  </ResponsiveContainer>

</div>

<div className="bg-white rounded-xl shadow-lg p-6 mt-8">
  <h2 className="text-2xl font-bold mb-5">
    Recent Orders
  </h2>

  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left py-3">Order ID</th>
        <th className="text-left">User</th>
        <th className="text-left">Total</th>
        <th className="text-left">Status</th>
        <th className="text-left">Date</th>
      </tr>
    </thead>

    <tbody>
      {recentOrders.map((order) => (
        <tr key={order.id} className="border-b">
          <td>#{order.id}</td>
          <td>{order.user}</td>
          <td>₹{order.total}</td>
          <td>{order.status}</td>
          <td>{new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="bg-white rounded-xl shadow-lg p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">
    Order Status Distribution
  </h2>

  <ResponsiveContainer width="100%" height={350}>

    <PieChart>

      <Pie
  data={analytics.order_status}
  dataKey="count"
  nameKey="status"
  outerRadius={120}
  label={({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`
  }
>

        {analytics.order_status.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}

      </Pie>

      <Tooltip
  formatter={(value) => [`${value} Orders`, "Count"]}
/>

      <Legend
  verticalAlign="bottom"
  align="center"
/>

    </PieChart>

  </ResponsiveContainer>

</div>

<div className="bg-white rounded-xl shadow-lg p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">
    Top Selling Products
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={topProducts}
      layout="vertical"
    >

      <XAxis type="number" />

      <YAxis
        dataKey="product"
        type="category"
        width={150}
      />

      <Tooltip />

      <Bar
        dataKey="sold"
        fill="#3B82F6"
      />

    </BarChart>
  </ResponsiveContainer>

</div>

        {/* Product Section */}

        <div className="bg-white shadow-lg rounded-xl p-6 mt-10">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <input
  type="text"
  placeholder="Search products..."
  value={productSearch}
  onChange={(e) => setProductSearch(e.target.value)}
  className="border rounded-lg px-4 py-2 w-64"
/>



            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
               + Add Product
            </button>

          </div>

          <table className="w-full border-collapse">

            <thead>

  <tr className="border-b">

    <th className="text-left py-3">
      Image
    </th>

    <th className="text-left py-3">
      Name
    </th>

    <th className="text-left">
      Category
    </th>

    <th className="text-left">
      Price
    </th>

    <th className="text-center">
      Actions
    </th>

  </tr>

</thead>

            <tbody>
  {products.length === 0 ? (
    <tr>
      <td className="py-4">No products yet</td>
      <td>-</td>
      <td>-</td>
      <td className="text-center">-</td>
    </tr>
  ) : (
    currentProducts.map((product) => (
      <tr key={product.id} className="border-b">

  <td className="py-3">
    <img
      src={
        product.image_url
          ? `http://127.0.0.1:8000${product.image_url}`
          : "https://via.placeholder.com/60"
      }
      alt={product.name}
      className="w-16 h-16 object-cover rounded-lg border"
    />
  </td>

  <td className="py-4">
    {product.name}
  </td>

  <td>
    {product.category}
  </td>

  <td>
    ₹{product.price}
  </td>

  <td className="text-center space-x-3">

    <button
      onClick={() => {
        setIsEditing(true);
        setEditingId(product.id);

        setForm({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          image_url: product.image_url,
        });

        setPreview(
          product.image_url
            ? `http://127.0.0.1:8000${product.image_url}`
            : ""
        );

        setSelectedImage(null);

        setShowModal(true);
      }}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>

    <button
      onClick={() => deleteProduct(product.id)}
      className="text-red-600 hover:text-red-800"
    >
      Delete
    </button>

  </td>

</tr>
    ))
  )}
</tbody>

          </table>

          <div className="flex justify-center gap-3 mt-6">

  <button
    disabled={productPage === 1}
    onClick={() => setProductPage(productPage - 1)}
    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {productPage} of {totalProductPages}
  </span>

  <button
    disabled={
      lastProduct >= filteredProducts.length
    }
    onClick={() => setProductPage(productPage + 1)}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

        </div>

        {/* Orders Section */}

<div className="bg-white shadow-lg rounded-xl p-6 mt-10">

  <div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    Orders
  </h2>

  <input
    type="text"
    placeholder="Search orders..."
    value={orderSearch}
    onChange={(e) => setOrderSearch(e.target.value)}
    className="border rounded-lg px-4 py-2"
  />

</div>

  <table className="w-full border-collapse">

    <thead>
      <tr className="border-b">
        <th className="text-left py-3">Order ID</th>
        <th className="text-left">User</th>
        <th className="text-left">Total</th>
        <th className="text-left">Status</th>
      </tr>
    </thead>

    <tbody>

      {orders.length === 0 ? (

        <tr>
          <td colSpan="4" className="py-4 text-center">
            No orders found
          </td>
        </tr>

      ) : (

        currentOrders.map((order) => (

          <tr key={order.id} className="border-b">

            <td className="py-3">
              #{order.id}
            </td>

            <td>
              {order.user_id}
            </td>

            <td>
              ₹{order.total}
            </td>

            <td>
  <select
    value={order.status}
    onChange={(e) =>
      updateOrderStatus(order.id, e.target.value)
    }
    className="border rounded px-2 py-1"
  >
    <option value="Pending">Pending</option>
    <option value="Paid">Paid</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>

          </tr>

        ))

      )}

    </tbody>

  </table>

  <div className="flex justify-center gap-3 mt-6">

  <button
    disabled={orderPage === 1}
    onClick={() => setOrderPage(orderPage - 1)}
    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {orderPage} of {totalOrderPages}
  </span>

  <button
    disabled={lastOrder >= filteredOrders.length}
    onClick={() => setOrderPage(orderPage + 1)}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

</div>


      
      {/* Users Section */}

<div className="bg-white shadow-lg rounded-xl p-6 mt-10">
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold">Users</h2>

  <input
    type="text"
    placeholder="Search users..."
    value={userSearch}
    onChange={(e) => setUserSearch(e.target.value)}
    className="border rounded-lg px-4 py-2"
  />
</div>

  <table className="w-full border-collapse">

    <thead>

      <tr className="border-b">

        <th className="text-left py-3">Name</th>

        <th className="text-left">Email</th>

        <th className="text-left">Role</th>

        <th className="text-center">Action</th>

      </tr>

    </thead>

    <tbody>

      {users.length === 0 ? (

        <tr>
          <td colSpan="4" className="text-center py-5">
            No users found
          </td>
        </tr>

      ) : (

        currentUsers.map((user) => (

          <tr key={user.id} className="border-b">

            <td className="py-3">
              {user.fullname}
            </td>

            <td>
              {user.email}
            </td>

            <td>

              <select
                value={user.role}
                onChange={(e) =>
                  updateUserRole(
                    user.id,
                    e.target.value
                  )
                }
                className="border rounded px-2 py-1"
              >

                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </td>

            <td className="text-center">

              {user.role !== "admin" && (
  <button
    onClick={() => deleteUser(user.id)}
    className="text-red-600 hover:text-red-800"
  >
    Delete
  </button>
)}

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

  <div className="flex justify-center gap-3 mt-6">

  <button
    disabled={userPage === 1}
    onClick={() => setUserPage(userPage - 1)}
    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {userPage} of {totalUserPages}
  </span>

  <button
    disabled={lastUser >= filteredUsers.length}
    onClick={() => setUserPage(userPage + 1)}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    Next
  </button>

</div>

</div>
       



      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white rounded-xl shadow-xl p-6 w-125">

      <h2 className="text-2xl font-bold mb-5">
        Add Product
      </h2>

      <input
        type="text"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="w-full border p-3 rounded mb-4"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        className="w-full border p-3 rounded mb-6"
      />

      <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  }}
  className="w-full border p-3 rounded mb-4"
/>

{preview && (
  <img
    src={preview}
    alt="Preview"
    className="w-40 h-40 object-cover rounded-lg border mb-4"
  />
)}

      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
  setShowModal(false);

  setIsEditing(false);
  setEditingId(null);

  setForm({
    name: "",
    description: "",
    category: "",
    price: "",
  });
}}
          className="px-5 py-2 rounded bg-gray-300"
        >
          Cancel
        </button>

        <button
  onClick={() => {
    if (isEditing) {
      updateProduct();
    } else {
      addProduct();
    }
  }}
  className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
>
  {isEditing ? "Update" : "Save"}
</button>

      </div>

    </div>

  </div>
)}

      <Footer />
    </>
  );
}