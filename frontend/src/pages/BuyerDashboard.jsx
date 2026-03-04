import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function BuyerDashboard() {

  const { user } = useAuth();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get("/skills");
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-purple-200 to-blue-200">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Welcome, {user?.name} 👋
        </h1>

        <button
          onClick={() => navigate("/cart")}
          className="bg-white px-6 py-2 rounded-xl shadow"
        >
          🛒 Cart ({cartItems.length})
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">
        🚀 Available Courses
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map(skill => {
          const inCart = cartItems.some(
            item => item._id === skill._id
          );

          return (
            <div key={skill._id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-xl">{skill.title}</h3>
              <p>{skill.description}</p>
              <p className="font-bold mt-2">₹ {skill.price}</p>

              {inCart ? (
                <button
                  onClick={() => removeFromCart(skill._id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => addToCart(skill)}
                  className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}