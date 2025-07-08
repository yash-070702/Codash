import React from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  Activity,
  Target,
  Globe,
} from "lucide-react";
const Features = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Multi-Platform Analytics",
      description:
        "Connect and analyze data from GitHub, LeetCode, CodeForces, HackerRank, and 25+ coding platforms in one unified dashboard.",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Performance Insights",
      description:
        "Track your coding progress with advanced metrics, skill analysis, and performance trends across all platforms.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Tracking",
      description:
        "Set coding goals, track milestones, and get personalized recommendations to improve your programming skills.",
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description:
        "Get instant updates on your coding activity, submissions, and achievements across all connected platforms.",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Recognition & Rewards",
      description:
        "Unlock badges, celebrate milestones, and showcase your coding journey with our comprehensive achievement system.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Leaderboards",
      description:
        "Compare your performance with developers worldwide and climb the rankings in various coding categories.",
    },
  ];
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful Features for Developers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to track, analyze, and improve your coding
            performance across all platforms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors group"
            >
              <div className="text-purple-400 mb-4 group-hover:text-purple-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
