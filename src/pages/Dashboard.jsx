import React from "react";

import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import Overview from "../components/dashboard/Overview";
import { Outlet } from "react-router-dom";
const Dashboard = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}

      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      {/* Main Content */}
      <div className="lg:ml-64 p-4 md:p-6">
        {/* Header */}
        <Header
          setSidebarOpen={setSidebarOpen}
          isUserDropdownOpen={isUserDropdownOpen}
          setIsUserDropdownOpen={setIsUserDropdownOpen}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
