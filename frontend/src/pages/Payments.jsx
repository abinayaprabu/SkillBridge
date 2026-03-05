import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "../utils/axios"; // Ensure this is your custom instance

export default function Payments() {
  const { cartItems, clearCart } = useCart();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get("/payments/my-payments");
      setHistory(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const downloadInvoice = async (paymentId) => {
    try {
      const response = await axios.get(`/payments/invoice/${paymentId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download invoice");
    }
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");
    
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to continue");

    try {
      setLoading(true);

      // 1. Create Order
      const { data } = await axios.post("/payments/create-order", { amount: total });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SkillBridge",
        description: "Course Purchase",
        order_id: data.orderId,
        // Using arrow function here to preserve 'this' context if needed
        handler: async (response) => {
          try {
            // 2. Verify Payment - This is where your 401 was happening
            // The custom axios instance will now attach the token from localStorage
            await axios.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: total,
              courses: cartItems.map((item) => ({
                title: item.title,
                price: item.price,
              })),
            });

            clearCart();
            fetchPayments();
            alert("Payment Successful 🎉");
          } catch (err) {
            console.error("Verification Error:", err.response?.data || err.message);
            alert("Verification failed. Please contact support if money was deducted.");
          }
        },
        theme: { color: "#7c3aed" },
        modal: {
            ondismiss: function() { setLoading(false); }
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      alert(error.response?.data?.message || "Could not initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Payments 💳</h1>

      {cartItems.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow mb-10 border-l-4 border-purple-600">
          <h2 className="font-bold mb-4">Checkout Summary</h2>
          <p className="mb-4 font-semibold text-xl">Total: ₹ {total}</p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-all disabled:bg-gray-400"
          >
            {loading ? "Initializing..." : "Proceed to Pay"}
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Payment History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 italic">No transaction history found.</p>
      ) : (
        <div className="grid gap-6">
          {history.map((payment) => (
            <div key={payment._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-purple-700">₹ {payment.amount}</p>
                  <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${payment.status === 'captured' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => downloadInvoice(payment._id)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border"
                >
                  Download Invoice
                </button>
              </div>
              {payment.courses?.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-2">Purchased Items:</p>
                  <ul className="text-sm space-y-1">
                    {payment.courses.map((course, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{course.title}</span>
                        <span className="font-medium">₹{course.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}