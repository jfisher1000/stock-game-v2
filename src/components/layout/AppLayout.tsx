import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "sonner"; // Import the Toaster component

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
      {/* Add the Toaster component here to render notifications */}
      <Toaster richColors position="top-right" />
    </>
  );
};

export default AppLayout;
