import React from "react";
import { useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import ActivityHeatmap from "./ActivityMap";
const Overview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Daily");

  const riskMetrics = [
    { label: "Total Threats", value: "132%", color: "bg-pink-500", icon: "🛡" },
    {
      label: "Video File Risk",
      value: "16%",
      color: "bg-purple-500",
      icon: "🎥",
    },
    { label: "Image File Risk", value: "43%", color: "bg-red-500", icon: "📧" },
    { label: "Docs File Risk", value: "7%", color: "bg-blue-500", icon: "🏠" },
    {
      label: "Folder File Risk",
      value: "66%",
      color: "bg-cyan-500",
      icon: "📁",
    },
  ];

  const threatData = [
    {
      date: "12-05-2024",
      deviceId: "crazyfin228",
      virusName: "Code Red",
      filePath: "C:\\bootupend...",
      fileType: ".jpeg",
    },
    {
      date: "11-05-2024",
      deviceId: "anonymous782",
      virusName: "Stuxnet",
      filePath: "\\\\192.168.13.5...",
      fileType: ".zip",
    },
  ];

  const virusTypes = [
    { name: "ILOVEYOU", percentage: 35, color: "bg-purple-400" },
    { name: "Melissa", percentage: 25, color: "bg-pink-400" },
    { name: "MyDoom", percentage: 20, color: "bg-red-400" },
    { name: "Sasser", percentage: 20, color: "bg-cyan-400" },
  ];

  const deviceThreats = [
    { deviceId: "crazyfin228", status: "Device has a crazyfin228" },
    { deviceId: "anonymous782", status: "LOW" },
    { deviceId: "Device ID: anonymous782", status: "HIGH" },
  ];

  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${
      (percentage / 100) * circumference
    } ${circumference}`;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            className="text-orange-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl md:text-3xl font-bold text-white">
            {percentage}
          </span>
          <span className="text-xs md:text-sm text-gray-400">High</span>
        </div>
      </div>
    );
  };

  const ThreatChart = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = [30, 45, 35, 50, 40, 55, 45, 60, 35, 40, 30, 25];

    return (
      <div className="h-32 md:h-48 flex items-end justify-between px-2 md:px-4">
        {months.map((month, index) => (
          <div key={month} className="flex flex-col items-center">
            <div
              className="w-3 md:w-6 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
              style={{ height: `${data[index]}%` }}
            />
            <span className="text-xs text-gray-400 mt-2 hidden md:block">
              {month}
            </span>
            <span className="text-xs text-gray-400 mt-2 md:hidden">
              {month.slice(0, 1)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const VirusDonut = () => {
    return (
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <svg width="100%" height="100%" className="transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray="157 251"
            className="text-purple-500"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray="100 251"
            strokeDashoffset="-157"
            className="text-pink-500"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray="50 251"
            strokeDashoffset="-257"
            className="text-cyan-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold text-white">65%</span>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold">Your Overview</h2>
        
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 ${metric.color} rounded-full flex items-center justify-center`}
                >
                  <span className="text-lg md:text-xl">{metric.icon}</span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
              <div className="text-xl md:text-2xl font-bold mb-1">
                {metric.value}
              </div>
              <div className="text-xs md:text-sm text-gray-400">
                {metric.label}
              </div>
            </div>
          ))}

          {/* Risk Score */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center col-span-2 md:col-span-1">
            <div className="mb-2 flex items-center justify-between w-full">
              <span className="text-sm text-gray-400">Risk Score</span>
              <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
            <CircularProgress percentage={741} size={80} />
            <div className="text-xs text-gray-400 mt-2">1000</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
      
        {/* Threat Summary */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 md:p-6">
        <ActivityHeatmap/>

        </div>

        {/* Threats By Virus */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-bold">Threats By Virus</h3>
            <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <div className="flex flex-col items-center">
            <VirusDonut />
            <div className="mt-4 space-y-2 w-full">
              {virusTypes.map((virus, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${virus.color}`} />
                    <span>{virus.name}</span>
                  </div>
                  <span className="text-gray-400">{virus.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Details */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-bold">Threat Details</h3>
            <div className="flex items-center gap-2">
              <select className="bg-gray-700 rounded px-3 py-1 text-sm">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-sm font-medium text-gray-400 whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400 whitespace-nowrap">
                    Device ID
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400 whitespace-nowrap">
                    Virus name
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400 whitespace-nowrap">
                    File Path
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-400 whitespace-nowrap">
                    File Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {threatData.map((threat, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3 text-sm whitespace-nowrap">
                      {threat.date}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      {threat.deviceId}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      {threat.virusName}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      {threat.filePath}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      {threat.fileType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat by Device */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-bold">Threat by device</h3>
            <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>

          <div className="space-y-4">
            {deviceThreats.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">💻</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium truncate">
                      {device.deviceId}
                    </div>
                    <div className="text-xs text-gray-400">{device.status}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-600 rounded">
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded">
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
