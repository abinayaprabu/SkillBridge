import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "../utils/axios";

export default function Payments() {

  const { cartItems, clearCart } = useCart();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {

      const { data } = await axios.get("/payments/my-payments");
      setHistory(data);

    } catch (error) {
      console.error("Fetch Payments Error:", error);
    }
  };

  const downloadInvoice = async (paymentId) => {
    try {

      const response = await axios.get(`/payments/invoice/${paymentId}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${paymentId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {

      console.error("Invoice Download Error:", error);
      alert("Failed to download invoice");

    }
  };

  const handlePayment = async () => {

    if (!cartItems.length) return alert("Cart is empty");

    try {

      setLoading(true);

      // Create order
      const { data } = await axios.post("/payments/create-order", {
        amount: total
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "SkillBridge",
        description: "Course Purchase",
        order_id: data.orderId,

        handler: async function (response) {

          try {

            await axios.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: total,
              courses: cartItems.map((item) => ({
                title: item.title,
                price: item.price
              }))
            });

            clearCart();
            fetchPayments();

            alert("Payment Successful 🎉");

          } catch (err) {

            console.error("Verification Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Payment verification failed");

          }

        },

        theme: {
          color: "#7c3aed"
        },

        modal: {
          ondismiss: () => setLoading(false)
        }

      };

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {

      console.error("Payment Error:", error);
      alert(error.response?.data?.message || "Payment initiation failed");

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

          <p className="mb-4 font-semibold text-xl">
            Total: ₹ {total}
          </p>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>

        </div>

      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Payment History
      </h2>

      {history.length === 0 ? (

        <p className="text-gray-500 italic">
          No transaction history found.
        </p>

      ) : (

        <div className="grid gap-6">

          {history.map((payment) => (

            <div
              key={payment._id}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-lg font-bold text-purple-700">
                    ₹ {payment.amount}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>

                </div>

                <button
                  onClick={() => downloadInvoice(payment._id)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  Download Invoice
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}