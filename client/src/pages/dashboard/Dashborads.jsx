import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/dashboard/sidebar"
import Dashboard from "../../components/dashboard/Dashboard";
import Courses from "../../components/dashboard/Courses";
import Assignments from "../../components/dashboard/Assignments";
import Quizzes from "../../components/dashboard/Quizzes";
import Attendance from "../../components/dashboard/Attendance";
import Job from "../../components/dashboard/jobs";
import LearningSupport from "../../components/dashboard/LearningSupport";
import Alumni from "../../components/dashboard/Alumni";

const Dashboards = () => {
  const location = useLocation();

  const ActiveTab = location.state?.tab || "dashboard";

  const [active, setActive] = useState(ActiveTab);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderComponent = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "courses":
        return <Courses />;
      case "assignments":
        return <Assignments />;
      case "quizzes":
        return <Quizzes />;
      case "attendance":
        return <Attendance />;
      case "job":
        return <Job />;
      case "learningsupport":
        return <LearningSupport />;
      case "alumni":
        return <Alumni />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full h-[90vh] flex ">
      {/* Sidebar */}
      <div
        className={`bg-[var(--color-background)] duration-300 ${
          isCollapsed ? "w-[80px]" : "w-[260px]"
        }`}
      >
        <Sidebar
          active={active}
          setActive={setActive}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 duration-300 p-4">{renderComponent()}</div>
    </div>
  );
};

export default Dashboards;