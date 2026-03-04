import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const companies = [
  { name: "Google", color: "text-[#4285F4]" },
  { name: "Amazon", color: "text-[#FF9900]" },
  { name: "Microsoft", color: "text-[#00A4EF]" },
  { name: "Meta", color: "text-[#1877F2]" },
  { name: "Netflix", color: "text-[#E50914]" },
  { name: "Adobe", color: "text-[#FF0000]" },
];

function Landing() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // ✅ Handle scroll when coming from footer
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">

        {/* Floating Company Tags */}
        <div className="absolute top-20 flex gap-6 flex-wrap justify-center w-full">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.4,
              }}
              className={`px-4 py-2 rounded-full bg-white shadow-md border border-gray-200 hover:scale-110 transition ${company.color} font-medium`}
            >
              {company.name}
            </motion.div>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold leading-tight mt-24"
        >
          Aim for{" "}
          <span className="text-purple-600">Product-Based</span>{" "}
          Companies 🚀
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl"
        >
          Structured learning paths inspired by Striver A2Z.
          Crack interviews. Build projects. Get placed.
        </motion.p>

        {/* Buttons */}
        <div className="mt-8 flex gap-6 flex-wrap justify-center">

          <button
            onClick={() => navigate("/browse")}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition font-semibold"
          >
            Explore Courses →
          </button>

          <button
            onClick={() => user ? navigate("/dashboard") : navigate("/register")}
            className="px-8 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl shadow-md hover:scale-105 transition font-semibold"
          >
            Start Learning
          </button>

        </div>

      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-20 px-6 bg-gray-50 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">
            About SkillBridge
          </h2>
          <p className="text-gray-600 leading-relaxed">
            SkillBridge is a student-powered learning platform where students
            can buy and sell courses. Our mission is to bridge the gap between
            academic learning and real-world industry skills. We empower
            students to teach, earn, and grow together.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-20 px-6 text-center"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Email us at:
          </p>

          {/* ✅ Clickable Email */}
          <a
            href="mailto:skillbridge.app2026@gmail.com"
            className="text-lg font-semibold text-indigo-600 mt-2 hover:underline"
          >
            skillbridge.app2026@gmail.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </footer>

    </div>
  );
}

export default Landing;