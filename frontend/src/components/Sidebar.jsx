import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white/30 backdrop-blur-lg border-r border-white/40 p-6">

      <h2 className="text-2xl font-bold mb-10 text-gray-800">
        SkillBridge
      </h2>

      <div className="flex flex-col gap-6 text-gray-700 font-medium">

        <Link to="/dashboard" className="hover:text-purple-600">
          Dashboard
        </Link>

        <Link to="/browse" className="hover:text-purple-600">
          Browse Skills
        </Link>

        <Link to="/projects" className="hover:text-purple-600">
          My Projects
        </Link>

        <Link to="/payments" className="hover:text-purple-600">
          Payments
        </Link>

        <Link to="/settings" className="hover:text-purple-600">
          Settings
        </Link>

      </div>

    </div>
  );
}