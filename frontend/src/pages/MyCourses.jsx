import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function MyCourses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/skills/my");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        My Created Courses
      </h1>

      {courses.length === 0 ? (
        <p>No courses created yet.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-6 rounded-xl shadow mb-4"
          >
            <h2 className="text-xl font-bold">
              {course.title}
            </h2>
            <p>{course.description}</p>
            <p>₹ {course.price}</p>
            <p>Duration: {course.duration}</p>
          </div>
        ))
      )}

    </div>
  );
}