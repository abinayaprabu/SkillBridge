import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function AppLayout({ children }) {

  return (

    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Right section */}

      <div className="flex-1 flex flex-col">

        <Navbar />

        <Topbar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

          {children}

        </main>

        <Footer />

      </div>

    </div>

  );

}