import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function MyProjects() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/users/me");

      // 🔥 Show ONLY purchased courses
      setCourses(data.purchasedCourses || []);

    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          My Purchased Courses 🎓
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        My Purchased Courses 🎓
      </h1>

      {courses.length === 0 ? (
        <p>No purchased courses yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {course.description}
              </p>

              <p className="mt-2 font-semibold">
                Duration: {course.duration}
              </p>

              <p className="mt-1 text-purple-600">
                ₹ {course.price}
              </p>

            
            </div>
          ))}
        </div>
      )}

    </div>
  );
}