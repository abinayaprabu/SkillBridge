import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard"; // Buyer Dashboard
import BrowseSkills from "./pages/BrowseSkills";
import MyProjects from "./pages/MyProjects";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Cart from "./pages/Cart";

import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* BUYER ONLY */}
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute roles={["buyer", "instructor"]}>
      <AppLayout><Dashboard /></AppLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/browse"
        element={
          <ProtectedRoute roles={["buyer","instructor"]}>
            <AppLayout><BrowseSkills /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute roles={["buyer","instructor"]}>
            <AppLayout><Cart /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute roles={["buyer","instructor"]}>
            <AppLayout><Payments /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* INSTRUCTOR ONLY */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute roles={["instructor"]}>
            <AppLayout><InstructorDashboard /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-course"
        element={
          <ProtectedRoute roles={["instructor"]}>
            <AppLayout><CreateCourse /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute roles={["instructor"]}>
            <AppLayout><MyCourses /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* COMMON */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute roles={["buyer", "instructor"]}>
            <AppLayout><MyProjects /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute roles={["buyer", "instructor"]}>
            <AppLayout><Settings /></AppLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;