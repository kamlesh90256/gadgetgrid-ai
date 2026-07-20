import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const res = await api.post(
                "/users/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            login(res.data.access_token);

            alert("Login Successful 🚀");

            navigate("/");

        } catch (err) {

            alert("Invalid Email or Password");

            console.log(err);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-xl w-105"
            >

                <h2 className="text-3xl font-bold text-center mb-8">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-lg mb-5"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-lg mb-6"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>

            </form>

        </div>

    );

}