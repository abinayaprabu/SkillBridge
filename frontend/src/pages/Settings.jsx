import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "../utils/axios";

export default function Settings() {

  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);

  // ✅ Sync preview whenever user changes
  useEffect(() => {
    if (user?.profileImage) {
      setPreview(user.profileImage);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);

      if (image) {
        formData.append("profileImage", image);
      }

      const { data } = await axios.put(
        "/users/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Update auth context properly
      login(data, localStorage.getItem("token"));

      alert("Profile updated successfully 🎉");

    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">

      <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-white mb-6">
          Account Settings
        </h1>

        {/* Role Badge */}
        <div className="mb-6">
          <span className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold">
            Role: {user?.role?.toUpperCase()}
          </span>
        </div>

        {/* Profile Image */}
        <div className="mb-6 text-center">
          <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {preview ? (
              <img
                src={
                  preview.startsWith("blob")
                    ? preview
                    : `http://localhost:5182${preview}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-white block mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 rounded-lg outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-white block mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 rounded-lg outline-none bg-gray-200"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}