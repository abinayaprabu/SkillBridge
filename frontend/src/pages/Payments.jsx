import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "../utils/axios";

export default function Payments() {

  const { cartItems, clearCart } = useCart();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );

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
      const response = await axios.get(
        `/payments/invoice/${paymentId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

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

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        "/payments/create-order",
        { amount: total }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SkillBridge",
        description: "Course Purchase",
        order_id: data.orderId,

        handler: async function (response) {

          try {

            await axios.post(
              "/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: total,
                courses: cartItems.map(item => ({
                  title: item.title,
                  price: item.price
                }))
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            );

            clearCart();
            await fetchPayments();

            alert("Payment Successful 🎉");

          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#7c3aed",
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded.");
        return;
      }

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="p-10 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Payments 💳
      </h1>

      {cartItems.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="font-bold mb-4">Checkout</h2>

          <p className="mb-4 font-semibold">
            Total: ₹ {total}
          </p>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:scale-105 transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Payment History
      </h2>

      {history.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        history.map((payment) => (
          <div
            key={payment._id}
            className="bg-white p-6 rounded-xl shadow mb-6"
          >
            <p><strong>Amount:</strong> ₹ {payment.amount}</p>
            <p><strong>Status:</strong> {payment.status}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(payment.createdAt).toLocaleString()}
            </p>

            {payment.courses?.length > 0 && (
              <ul className="mt-2 list-disc ml-6">
                {payment.courses.map((course, index) => (
                  <li key={index}>
                    {course.title} — ₹ {course.price}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => downloadInvoice(payment._id)}
              className="mt-4 bg-purple-600 text-white px-5 py-2 rounded hover:scale-105 transition"
            >
              🧾 Download Invoice
            </button>

          </div>
        ))
      )}

    </div>
  );
}