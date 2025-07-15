import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, User, RefreshCw, ChevronDown } from "lucide-react";
import * as Chart from "chart.js";
import ActivityHeatmap from "./ActivityMap";

import { useSelector } from "react-redux";
import { getGFGDetails } from "../../services/operations/platformAPI";

// Register Chart.js components
Chart.Chart.register(
  Chart.ArcElement,
  Chart.Tooltip,
  Chart.Legend,
  Chart.DoughnutController
);

const GFG = () => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [GFGData, setGFGData] = useState(null);
  const [easyQuestions, setEasyQuestions] = useState([]);
  const [mediumQuestions, setMediumQuestions] = useState([]);
  const [hardQuestions, setHardQuestions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef(null);
  const difficultyOptions = ["All", "Easy", "Medium", "Hard"];
  var allQuestions = [];

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Check if username exists
  const hasUsername = user?.gfgURL && user.gfgURL.trim() !== "";

  // Fetch GFG details
  useEffect(() => {
    if (!hasUsername) return;

    const fetchGFGDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const username = user.gfgURL;
        const details = await getGFGDetails(username, token);
        setGFGData(details);
        setEasyQuestions(details?.data?.solvedStats?.easy?.questions || []);
        setMediumQuestions(details?.data?.solvedStats?.medium?.questions || []);
        setHardQuestions(details?.data?.solvedStats?.hard?.questions || []);
      } catch (error) {
        console.error("Error fetching GFG details:", error);
        setError("Failed to fetch GFG data. Please try again.");
      } finally {
        allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        setIsLoading(false);
      }
    };

    fetchGFGDetails();
  }, [hasUsername, user?.gfgURL, token]);

  
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug: Log current state
  useEffect(() => {
    console.log('Selected Difficulty:', selectedDifficulty);
    console.log('Current Questions:', getCurrentQuestions());
    console.log('Displayed Questions:', displayedQuestions);
  }, [selectedDifficulty, showAllQuestions]);
  //  console.log("GFG Details:", GFGData)

  const getQuestionsForDifficulty = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return easyQuestions;
      case "Medium":
        return mediumQuestions;
      case "Hard":
        return hardQuestions;
      default:
        return allQuestions;
    }
  };

  // No Username Screen
  const NoUsernameScreen = () => (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              GFG Analytics
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Connect your GFG profile to view your coding progress and
              performance analytics
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-gray-700 max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">
                Username Required
              </h2>
            </div>

            <p className="text-gray-300 mb-6 text-center">
              Please provide your GFG username in your profile settings to view
              your analytics dashboard.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  What you'll get:
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Problem solving statistics</li>
                  <li>• Activity heatmap</li>
                  <li>• Performance analytics</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>

              <button
                onClick={() => (window.location.href = "/edit-profile")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Go to Profile Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Screen
  const LoadingScreen = () => (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                GFG Analytics
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Fetching your coding progress and performance...
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Loading Your Data
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Please wait while we fetch your GFG statistics...
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 max-w-md w-full">
            <div className="space-y-4">
              {/* Loading skeleton */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>

              <p className="text-gray-400 text-sm text-center">
                Fetching data for:{" "}
                <span className="text-white font-medium">{user?.gfgURL}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error Screen
  const ErrorScreen = () => (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Unable to Load Data
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">{error}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-gray-700 max-w-md w-full">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show appropriate screen based on state
  if (!hasUsername) {
    return <NoUsernameScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  // Rest of your existing component code (baseStats, questionStats, GFGDonut, etc.)
  const baseStats = [
    {
      level: "Easy",
      solved:
        GFGData?.data?.solvedStats?.easy.count +
        GFGData?.data?.solvedStats?.basic.count,
      total: GFGData?.data?.profile?.totalQuestionsCount,
      color: "text-green-400",
      bgColor: "bg-green-400",
      strokeColor: "stroke-green-400",
      chartColor: "#4ade80",
      details: {
        accuracy:
          parseInt(
            GFGData?.data?.difficultyAnalysis?.breakdown?.easy?.percentage
          ) +
          parseInt(
            GFGData?.data?.difficultyAnalysis?.breakdown?.basic?.percentage
          ) +
          "%",

        topics: ["Arrays", "Strings", "Hash Tables"],
      },
    },
    {
      level: "Medium",
      solved: GFGData?.data?.solvedStats?.medium.count,
      total: GFGData?.data?.profile?.totalQuestionsCount,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400",
      strokeColor: "stroke-yellow-400",
      chartColor: "#facc15",
      details: {
        accuracy:
          GFGData?.data?.difficultyAnalysis?.breakdown?.medium?.percentage +
          "%",
        topics: ["Trees", "DP", "Graphs"],
      },
    },
    {
      level: "Hard",
      solved: GFGData?.data?.solvedStats?.hard.count,
      total: GFGData?.data?.profile?.totalQuestionsCount,
      color: "text-red-400",
      bgColor: "bg-red-400",
      strokeColor: "stroke-red-400",
      chartColor: "#f87171",
      details: {
        accuracy:
          GFGData?.data?.difficultyAnalysis?.breakdown?.hard?.percentage + "%",
        topics: ["Advanced Algorithms", "System Design"],
      },
    },
  ];

  // Calculate totals dynamically
  const totalSolved = baseStats.reduce((acc, stat) => acc + stat.solved, 0);
  const totalQuestions = GFGData?.data?.profile?.totalQuestionsCount;
  const totalRecentSolved = baseStats.reduce(
    (acc, stat) => acc + stat.details.recentSolved,
    0
  );

  const questionStats = [
    ...baseStats,
    {
      level: "Total",
      solved: totalSolved,
      total: totalQuestions,
      color: "text-purple-400",
      bgColor: "bg-purple-400",
      strokeColor: "stroke-purple-400",
      chartColor: "#c084fc",
      details: {
        accuracy: "--",
        avgTime: "22 min",
        recentSolved: totalRecentSolved,
        topics: ["All Topics", "Mixed Practice"],
      },
    },
  ];

  const GFGDonut = () => {
    // Filter out the "Total" entry for chart display
    const chartData = questionStats.filter((stat) => stat.level !== "Total");

    const chartTotalSolved = chartData.reduce(
      (acc, stat) => acc + stat.solved,
      0
    );

    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        // Destroy existing chart if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart.Chart(ctx, {
          type: "doughnut",
          data: {
            labels: chartData.map((stat) => stat.level),
            datasets: [
              {
                data: chartData.map((stat) => stat.solved),
                backgroundColor: chartData.map((stat) => stat.chartColor),
                borderColor: "#1f2937",
                borderWidth: 3,
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "#374151",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                borderColor: "#6b7280",
                borderWidth: 1,
                callbacks: {
                  label: function (context) {
                    const stat = chartData[context.dataIndex];
                    return `${stat.level}: ${stat.solved}/${stat.total}`;
                  },
                },
              },
            },
            onClick: (event, activeElements) => {
              if (activeElements.length > 0) {
                const index = activeElements[0].index;
                const clickedStat = chartData[index];
                setSelectedSegment(
                  selectedSegment?.level === clickedStat.level
                    ? null
                    : clickedStat
                );
              }
            },
            onHover: (event, activeElements) => {
              event.native.target.style.cursor =
                activeElements.length > 0 ? "pointer" : "default";
            },
          },
        });
      }

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, [selectedSegment]);

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mb-4">
          <canvas ref={chartRef} />
          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-white">
              {chartTotalSolved}
            </span>
            <span className="text-xs sm:text-sm text-gray-400">Solved</span>
          </div>
        </div>

        {/* Legend or Details */}
        {!selectedSegment ? (
          <div className="space-y-2 w-full">
            {questionStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                onClick={() => setSelectedSegment(stat)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: stat.chartColor }}
                  />
                  <span className="font-medium">{stat.level}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white font-semibold">
                    {stat.solved}/{stat.total}
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.round((stat.solved / stat.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 mt-2 shadow-lg border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-bold text-lg ${selectedSegment.color}`}>
                {selectedSegment.level} Problems
              </h4>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-gray-400 hover:text-white text-xl hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 block text-xs">Solved</span>
                <span className="text-white font-semibold text-lg">
                  {selectedSegment.solved}/{selectedSegment.total}
                </span>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 block text-xs">Accuracy</span>
                <span className="text-white font-semibold text-lg">
                  {selectedSegment.details.accuracy}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm font-medium">
                Top Topics:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSegment.details.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gradient-to-r from-gray-600 to-gray-500 px-3 py-1 rounded-full text-white shadow-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const toggleViewAll = (e) => {
    e.preventDefault();
    setShowAllQuestions(!showAllQuestions);
  };
  // Get questions to display based on current state
   const getCurrentQuestions = () => {
    return getQuestionsForDifficulty(selectedDifficulty);
  };

  const displayedQuestions = showAllQuestions 
    ? getCurrentQuestions() 
    : getCurrentQuestions().slice(0, 3); 

  // Function to handle topic tag click
  const handleQuestionClick = (url) => {
   window.open(url, "_blank");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "Hard":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setIsDropdownOpen(false);
    setShowAllQuestions(false); // Reset view when changing difficulty
  };

  

  // Main dashboard render (your existing JSX)
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                GFG Analytics
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Track your coding progress and performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <img src={GFGData?.data?.avatar} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <p className="text-green-400 text-sm font-medium mb-1">
                  Easy/Basic Solved
                </p>
                <h1 className="text-2xl font-bold text-white">
                  {GFGData?.data?.solvedStats?.easy.count +
                    GFGData?.data?.solvedStats?.basic.count}
                </h1>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <p className="text-yellow-400 text-sm font-medium mb-1">
                  Medium Solved
                </p>
                <h1 className="text-2xl font-bold text-white">
                  {GFGData?.data?.solvedStats?.medium.count}
                </h1>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <p className="text-red-400 text-sm font-medium mb-1">
                  Hard Solved
                </p>
                <h1 className="text-2xl font-bold text-white">
                  {GFGData?.data?.solvedStats?.hard?.count}
                </h1>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">#</span>
                </div>
                <p className="text-blue-400 text-sm font-medium mb-1">
                  Difficulty Score
                </p>
                <h1 className="text-2xl font-bold text-white">
                  {GFGData?.data?.difficultyAnalysis?.difficultyScore}
                </h1>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Profile Details
                  </h3>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Username</span>
                    <span className="text-white font-medium">
                      {user?.gfgURL || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Profile completeness
                    </span>
                    <span className="text-white font-medium">
                      {GFGData?.data?.profile?.profileCompleteness} %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Most Active Day
                    </span>
                    <span className="text-white font-medium">
                      {
                        GFGData?.data?.activityMetrics?.weeklyPattern
                          ?.mostActiveDay
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Level</span>
                    <span className="text-white font-medium">
                      {" "}
                      {GFGData?.data?.difficultyAnalysis?.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          {/* Activity Heatmap */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <ActivityHeatmap heatmapData={GFGData?.data?.heatmap} />
          </div>

          {/* Question Statistics */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-bold text-white">
                Question Stats
              </h3>
            </div>
            <GFGDonut />
          </div>
        </div>

        {/* Bottom Section */}
       <div className=" bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions Details */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-bold text-white">
                Recent Solved Questions
              </h3>
              <div className="flex items-center gap-3">
                {/* Difficulty Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm border border-gray-600"
                  >
                    <span>Difficulty: {selectedDifficulty}</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                      {difficultyOptions.map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => handleDifficultySelect(difficulty)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            selectedDifficulty === difficulty 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={toggleViewAll} 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {showAllQuestions ? "View Less" : "View All"}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400 whitespace-nowrap w-16">
                      ID
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400 w-1/3 min-w-[180px]">
                      Title
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400 whitespace-nowrap w-20">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayedQuestions.map((question, index) => {
                    // Determine difficulty based on which array the question belongs to
                    let difficulty = 'Easy';
                    if (mediumQuestions.some(q => q.id === question.id)) {
                      difficulty = 'Medium';
                    } else if (hardQuestions.some(q => q.id === question.id)) {
                      difficulty = 'Hard';
                    }

                    return (
                      <tr
                        key={question.id}
                        className="hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => handleQuestionClick(question.questionUrl)}
                      >
                        <td className="py-3 px-2 text-sm text-gray-300 font-mono">
                          {question.id || index + 1}
                        </td>
                        <td className="py-3 px-2 text-sm text-white font-medium hover:text-blue-400 transition-colors">
                          <div
                            className="truncate max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]"
                            title={question?.question}
                          >
                            {question?.question}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getDifficultyColor(
                              difficulty
                            )}`}
                          >
                            {difficulty}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Show count information */}
            <div className="mt-4 text-sm text-gray-400">
              Showing {displayedQuestions.length} of {getCurrentQuestions().length} {selectedDifficulty.toLowerCase()} questions
            </div>
          </div>

          {/* Contest Details */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-bold text-white">
                Contest Details
              </h3>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏆</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  No contest data available
                </p>
                <p className="text-gray-500 text-xs">
                  Participate in contests to see your stats here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default GFG;
