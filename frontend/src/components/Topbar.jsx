import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Topbar({ title, search, setSearch }) {

  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <div className="bg-white/60 backdrop-blur-lg border-b px-10 py-4 flex justify-between items-center">

      {/* Page Title */}
      <h1 className="text-xl font-semibold">
        {title}
      </h1>

      <div className="flex items-center gap-6">

        {/* Search */}
        {search !== undefined && setSearch && (
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-100 outline-none"
          />
        )}

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          🛒 {cartItems.length}
        </button>

        {/* Notification */}
        <div className="cursor-pointer text-xl">🔔</div>

        {/* Profile Avatar */}
       <div
      className="w-10 h-10 rounded-full flex items-center justify-center 
      bg-gradient-to-r from-purple-600 to-blue-600 
      text-white font-bold text-lg cursor-pointer"
      onClick={() => navigate("/settings")}
       >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>

      </div>
    </div>
  );
}