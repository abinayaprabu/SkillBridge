import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-purple-700">
          SkillBridge
        </Link>

        <div className="flex items-center gap-6 font-medium">

          {!user && (
            <>
              <Link to="/login" className="hover:text-purple-600">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-purple-600"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;