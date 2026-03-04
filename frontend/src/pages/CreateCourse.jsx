import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function CreateCourse() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/skills", form);

      alert("Course created successfully!");

      // 🔥 Redirect after creation
      navigate("/my-courses");

    } catch (err) {
      alert(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Create Course
      </h1>

      <input
        name="title"
        placeholder="Title"
        className="block mb-4 p-2 border"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="block mb-4 p-2 border"
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        className="block mb-4 p-2 border"
        onChange={handleChange}
      />

      <input
        name="duration"
        placeholder="Duration"
        className="block mb-4 p-2 border"
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}