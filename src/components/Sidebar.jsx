"use client";

import {
  LayoutDashboard,
  Pill,
  FileText,
  Users,
  Truck,
  Receipt,
  Menu,
  X,
  LogOut,
  Phone,
  MessageCircle,
} from "./Icons";
import { routes } from "../routes";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Sidebar({ currentPage, onNavigate }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();

  const iconMap = {
    LayoutDashboard,
    Pill,
    FileText,
    Users,
    Truck,
    Receipt,
  };

  const phoneNumber = "+252619171300";
  const whatsappNumber = "252619171300"; // Without + for WhatsApp link
  const whatsappMessage = "Hello! I need help with PharmaCare system.";

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [currentPage, isMobile]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen, isMobile]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handlePhoneCall = () => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(url, "_blank");
  };

  const handleGetHelp = () => {
    // Default to WhatsApp when clicking the main "Get Help" button
    handleWhatsApp();
  };

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600">PharmaCare</h2>
          <p className="text-sm text-gray-500 mt-1">Management System</p>
          {user && (
            <p className="text-xs text-gray-400 mt-2">
              Welcome, <span className="font-medium">{user.name}</span>
            </p>
          )}
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {routes.map((route) => {
          const Icon = iconMap[route.icon];
          const isActive = currentPage === route.path;
          return (
            <button
              key={route.path}
              onClick={() => onNavigate(route.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                />
              )}
              <span className="text-base font-medium">{route.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section - Help Center & Logout */}
      <div className="p-4 space-y-4 border-t border-gray-200">
        {/* Enhanced Help Center */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Help Center</p>
              <p className="text-xs text-blue-700 mt-1">
                24/7 Support Available
              </p>
            </div>
          </div>

          {/* Phone Number Display */}
          <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Contact Number</p>
            <p className="text-sm font-mono font-semibold text-gray-900">
              {phoneNumber}
            </p>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors font-medium group"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePhoneCall}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium group"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
          </div>

          {/* Quick Help Button */}
          <button
            onClick={handleGetHelp}
            className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm"
          >
            Get Quick Help
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="space-y-2">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-blue-600">PharmaCare</h2>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200 
          flex flex-col shadow-xl md:shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to logout?
                </p>
              </div>
            </div>

            {/* User Info in Modal */}
            {user && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
