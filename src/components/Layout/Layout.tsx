import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";


const Layout = () => {
  return (
    <div className="min-h-screen  font-arabic" dir="rtl">

      <div className="flex ">
        <Sidebar />

        {/* Main content area */}
        <main className="lg:flex-1 w-full font-['SFArabic-Regular'] ">
          <div className="hidden  bg-white px-6 py-4 lg:block ">
            <h1 className="text-lg font-semibold text-right">الصفحة الرئيسية</h1>
          </div>
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
