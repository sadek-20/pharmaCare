"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NotificationPanel from "./components/NotificationPanel";
import { Bell } from "./components/Icons";
import { getRouteComponent, getDefaultRoute } from "./routes";

function App() {
  const [currentPage, setCurrentPage] = useState(getDefaultRoute());
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const PageComponent = getRouteComponent(currentPage);

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Header - Hidden on mobile since we have mobile header in sidebar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 md:px-8 py-4 md:py-5 hidden md:block">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Pharmacy Management System
            </h1>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 md:p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-1 right-1 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              {showNotifications && (
                <NotificationPanel
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Content with mobile padding */}
        <main
          className={`flex-1 overflow-y-auto bg-gray-50 ${
            isMobile ? "pt-16 p-4" : "p-6 md:p-8"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
