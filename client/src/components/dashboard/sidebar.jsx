import React from "react";
import { TbChartTreemap } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { TiShoppingCart } from "react-icons/ti";
import { MdQuiz, MdWork, MdLogout, MdSchedule } from "react-icons/md"; // ✅ FIX
import { FaHandsHelping, FaUserGraduate } from "react-icons/fa"; // ✅ FIX
import { GiHamburgerMenu } from "react-icons/gi";

import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active, setActive, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div
      className={`p-3 flex flex-col justify-between h-screen bg-gray-50 fixed top-0 left-0 transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* TOP */}
      <div>
        <div className="h-10 text-xl font-bold flex gap-4 items-center mb-4">
          <button
            className="hover:scale-110 transition"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <GiHamburgerMenu size={20} />
          </button>

          {!isCollapsed && (
            <span className="whitespace-nowrap">User Dashboard</span>
          )}
        </div>

        

        <div className="py-6 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all
              ${
                active === item.key
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span>{item.title}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm rounded-lg h-10 w-full px-2 transition-all
          text-red-600 hover:bg-red-500 hover:text-white"
        >
          <MdLogout size={18} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;