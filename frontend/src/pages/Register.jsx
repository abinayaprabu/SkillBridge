import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      const res = await axios.post("/auth/register", form);

      login(res.data.user, res.data.token);

      if (res.data.user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg p-8 w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input name="name" placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/40"
          onChange={handleChange}
        />

        <input name="email" placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/40"
          onChange={handleChange}
        />

        <input name="password" type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/40"
          onChange={handleChange}
        />

        <input name="confirmPassword" type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/40"
          onChange={handleChange}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-white/40"
        >
          <option value="buyer">Buyer</option>
          <option value="instructor">Instructor</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600"
        >
          Register
        </button>

      </div>
    </div>
  );
}