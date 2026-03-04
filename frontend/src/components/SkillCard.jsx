export default function Topbar() {
  return (
    <div className="bg-white/30 backdrop-blur-lg border-b border-white/40 px-10 py-4 flex justify-between items-center">

      <h1 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-xl bg-white/40 outline-none"
        />

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>

      </div>

    </div>
  );
}