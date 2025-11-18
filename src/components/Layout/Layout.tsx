import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";

const pageTitle: Record<string, string> = {
  '/': 'الصفحة الرئيسية',
  '/doctors': 'صفحة الأطباء',
  '/patients': 'صفحة المرضى',
  '/roles': 'صفحة الأدوار',
  '/roles/create': 'إنشاء دور جديد',
  '/admins': 'صفحة مستخدمي النظام',
  '/admins/create': 'إضافة مستخدم جديد',
};

const Layout = () => {
  const location = useLocation();

  const getCurrentPageTitle = () => {
    const path = location.pathname;

    // Check for patient details page pattern
    if (path.startsWith('/patients/') && path !== '/patients') {
      return 'تفاصيل المريض';
    }

    return pageTitle[path] || 'الصفحة الرئيسية';
  };

  return (
    <div className="min-h-screen  font-arabic" dir="rtl">

      <div className="flex ">
        <Sidebar />

        {/* Main content area */}
        <main className="lg:flex-1 w-full font-['SFArabic-Regular'] ">
          <div className="hidden  bg-white px-6 py-4 lg:block ">
            <h1 className="text-lg font-semibold text-right">{getCurrentPageTitle()}</h1>
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
