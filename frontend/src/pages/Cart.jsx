import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {

  const { cartItems, removeFromCart } = useCart();

  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price,
    0
  );

  return (

    <div className="p-10 min-h-screen">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          My Cart 🛒
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-purple-700 px-5 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          ← Back to Courses
        </button>

      </div>


      {cartItems.length === 0 ? (

        <div className="text-center text-white text-xl mt-20">
          No courses added yet.
        </div>

      ) : (

        <>

          {/* Cart Items */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {cartItems.map(item => (

              <div
                key={item._id}
                className="backdrop-blur-md bg-white/30 border border-white/40 p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300"
              >

                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-purple-800 font-semibold text-lg mb-3">
                  ₹ {item.price}
                </p>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition"
                >
                  Remove ❌
                </button>

              </div>

            ))}

          </div>


          {/* Total + Payment Section */}

          <div className="mt-10 backdrop-blur-md bg-white/30 border border-white/40 p-6 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Total Amount: ₹ {total}
            </h2>

            <button
              onClick={() => navigate("/payments")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition text-lg font-semibold"
            >
              Proceed to Payment →
            </button>

          </div>

        </>

      )}

    </div>

  );

}

export default Cart;