import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InstructorDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-10 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Instructor Dashboard 👨‍🏫
      </h1>

      <p className="text-lg mb-8">
        Welcome, {user?.name}
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        {/* CREATE COURSE */}
        <div
          onClick={() => navigate("/create-course")}
          className="bg-white p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer"
        >
          <h2 className="font-bold text-xl">
            ➕ Create Course
          </h2>
        </div>

        {/* MY COURSES */}
        <div
          onClick={() => navigate("/my-courses")}
          className="bg-white p-6 rounded-xl shadow hover:scale-105 transition cursor-pointer"
        >
          <h2 className="font-bold text-xl">
            📚 My Courses
          </h2>
        </div>

      </div>

    </div>
  );
}