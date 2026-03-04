export default function Input({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-lg outline-none border border-white/40"
    />
  );
}