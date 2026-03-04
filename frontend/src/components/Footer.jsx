import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {

    // If not on landing page, first navigate
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-11/12 max-w-6xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-2xl px-8 py-6 flex justify-between items-center text-gray-700">
        
        <div className="flex gap-6">
          <span
            onClick={() => scrollToSection("about")}
            className="cursor-pointer hover:text-purple-600"
          >
            About
          </span>

          <span
            onClick={() => scrollToSection("contact")}
            className="cursor-pointer hover:text-purple-600"
          >
            Contact
          </span>
        </div>

        <div>
          © 2026 SkillBridge. All rights reserved.
        </div>

      </div>
    </div>
  );
}