import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useCart } from "../context/CartContext";
import Topbar from "../components/Topbar";

export default function BrowseSkills() {

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("/skills");
        setSkills(res.data);
      } catch (error) {
        console.error("Error fetching skills", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      {/* 🔥 Pass Dynamic Title */}
      <Topbar
        title="Browse Skills"
        search={search}
        setSearch={setSearch}
      />

      <div className="p-10">

        <h1 className="text-3xl font-bold mb-6">
          Browse Skills
        </h1>

        {loading ? (
          <p>Loading skills...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {skills
              .filter((skill) =>
                skill.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((skill) => {

                const inCart = cartItems.some(
                  item => item._id === skill._id
                );

                return (
                  <div
                    key={skill._id}
                    className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/40"
                  >

                    <h2 className="text-xl font-semibold text-gray-800">
                      {skill.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {skill.description}
                    </p>

                    <p className="mt-3 font-medium">
                      Duration: {skill.duration}
                    </p>

                    <p className="mt-1 font-bold text-lg">
                      ₹ {skill.price}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Seller: {skill.user?.name}
                    </p>

                    {inCart ? (
                      <button
                        onClick={() => removeFromCart(skill._id)}
                        className="mt-4 px-4 py-2 rounded-lg text-white bg-red-500 hover:scale-105 transition"
                      >
                        Remove ❌
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(skill)}
                        className="mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
                      >
                        Add to Cart 🛒
                      </button>
                    )}

                  </div>
                );
              })}

          </div>
        )}

      </div>
    </>
  );
}