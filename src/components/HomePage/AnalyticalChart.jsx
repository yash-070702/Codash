import React from "react";
import {

  TrendingUp,
  PieChart,
  LineChart,
} from "lucide-react";
const AnalyticalChart = () => {
  return (
    <div>
      <div className="relative">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Real-time Data Insights</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="relative w-full h-64 bg-slate-700/50 rounded-lg flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute top-4 left-4 right-4 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 right-4 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse delay-100"></div>

            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-purple-300">
                  <LineChart className="h-4 w-4" />
                  <span className="text-xs">Growth Rate</span>
                </div>
                <div className="text-xl font-bold text-white">
                  15.3% <span className="text-green-400 text-sm">▲</span>
                </div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-blue-300">
                  <PieChart className="h-4 w-4" />
                  <span className="text-xs">Skill Distribution</span>
                </div>
                <div className="text-xl font-bold text-white">
                  8 Skills <span className="text-yellow-400 text-sm">●</span>
                </div>
              </div>
              <div className="col-span-2 bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300">Monthly Trends</span>
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                <div className="flex items-end space-x-1 h-16">
                  {[30, 50, 70, 60, 80, 55, 90, 75, 65, 85, 45, 70].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-indigo-400 to-purple-400 rounded-sm flex-1 transition-all duration-500"
                        style={{ height: `${height}%` }}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default AnalyticalChart;
