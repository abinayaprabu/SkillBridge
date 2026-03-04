import { useAuth } from "../context/AuthContext";
import InstructorDashboard from "./InstructorDashboard";
import BuyerDashboard from "./BuyerDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "instructor") {
    return <InstructorDashboard />;
  }

  return <BuyerDashboard />;
}