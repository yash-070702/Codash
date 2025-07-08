import React from "react";
import { Code, BarChart3, Activity } from "lucide-react";
const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <Code className="h-7 w-7 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-md">
          <BarChart3 className="h-3 w-3 text-white" />
        </div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
          <Activity className="h-2 w-2 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          CoDash
        </span>
        <span className="text-xs text-gray-400 -mt-1">Analytics Platform</span>
      </div>
    </div>
  );
};

export default Logo;
