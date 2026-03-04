import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-blue-200">

      <Navbar />

      <div className="pt-24">
        {children}
      </div>

    </div>

  );

}