// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { TbChartTreemap } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { TiShoppingCart } from "react-icons/ti";
import { MdQuiz, MdWork, MdLogout, MdSchedule } from "react-icons/md";
import { FaHandsHelping, FaUserGraduate } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active, setActive, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "dashboard", title: "Dashboard", icon: <TbChartTreemap /> },
    { key: "courses", title: "Courses", icon: <ImProfile /> },
    { key: "assignments", title: "Assignments", icon: <TiShoppingCart /> },
    { key: "quizzes", title: "Quizzes", icon: <MdQuiz /> },
    { key: "attendance", title: "Attendance", icon: <MdSchedule /> },
    { key: "learningsupport", title: "Learning Support", icon: <FaHandsHelping /> },
    { key: "job", title: "Job & Internship", icon: <MdWork /> },
    { key: "alumni", title: "Alumni", icon: <FaUserGraduate /> },
  ];

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleItemClick = (key) => {
    setActive(key);
    if (isMobile) setIsMobileOpen(false);
  };

  // Desktop sidebar (fixed, with proper top offset for header)
  if (!isMobile) {
    return (
      <div
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-gray-50 shadow-lg z-40 transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="p-3 flex flex-col justify-between h-full">
          <div>
            <div className="h-10 text-xl font-bold flex gap-4 items-center mb-4">
              <button
                className="hover:scale-110 transition"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <GiHamburgerMenu size={20} />
              </button>
              {!isCollapsed && <span className="whitespace-nowrap">User Dashboard</span>}
            </div>

            <div className="py-6 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all
                  ${active === item.key ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Logout button – uncomment if needed */}
          {/* 
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all text-red-600 hover:bg-red-500 hover:text-white"
            >
              <MdLogout size={18} />
              {!isCollapsed && "Logout"}
            </button>
          </div>
          */}
        </div>
      </div>
    );
  }

  // Mobile sidebar (overlay) – hamburger moved to top-left, below header
  return (
    <>
      {/* Hamburger button – positioned below the fixed header */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-16 left-4 z-50 bg-black text-white p-3 rounded-full shadow-lg md:hidden"
      >
        <GiHamburgerMenu size={24} />
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sliding sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 shadow-xl z-50 transition-transform duration-300 w-64 p-3 flex flex-col justify-between
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="flex justify-between items-center mb-4 h-10">
            <span className="text-xl font-bold">User Dashboard</span>
            <button onClick={() => setIsMobileOpen(false)} className="text-2xl">
              &times;
            </button>
          </div>

          <div className="py-6 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={`flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all
                ${active === item.key ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout – commented */}
        {/* 
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all text-red-600 hover:bg-red-500 hover:text-white"
        >
          <MdLogout size={18} />
          <span>Logout</span>
        </button>
        */}
      </div>
    </>
  );
};

export default Sidebar;