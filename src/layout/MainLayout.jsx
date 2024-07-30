import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
function MainLayout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
