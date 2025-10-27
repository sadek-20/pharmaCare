"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import NotificationPanel from "./components/NotificationPanel";
import { Bell } from "./components/Icons";
import { getRouteComponent, getDefaultRoute } from "./routes";
import LoginPage from "./pages/LoginPage";

function AppContent() {
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
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Pharmacy Management System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back! Manage your pharmacy efficiently
              </p>
            </div>
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

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading PharmaCare...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we initialize the system
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppContent />;
}

export default App;
