import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {

    if (!email || !password) {
      return alert("Please enter email and password");
    }

    try {

      const res = await axios.post("/auth/login", {
        email,
        password
      });

      login(res.data.user, res.data.token);

      // 🔥 ROLE BASED REDIRECT
      if (res.data.user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg p-8 w-96">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/40"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-white/40"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition"
        >
          Login
        </button>

      </div>

    </div>
  );
}