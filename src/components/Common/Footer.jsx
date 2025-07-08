import React from "react";
import {
  BarChart3,
  Users,
  Shield,
  Github,
  Monitor,
  Activity,
  Target,
  Layers,
  PieChart,
  LineChart,
  Award,
  Globe,
  Lock,
} from "lucide-react";
import Logo from "./Logo";
const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 border-t rounded-3xl border-slate-700/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Footer Header */}
          <div className="text-center mb-12">
            <Logo />
            <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
              Empowering developers worldwide with comprehensive analytics and
              insights across all coding platforms.
            </p>
          </div>

          {/* Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Product Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Performance Tracking</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Target className="h-4 w-4" />
                    <span>Goal Setting</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Platform Integrations</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Features Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                Features
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <PieChart className="h-4 w-4" />
                    <span>Visual Reports</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <LineChart className="h-4 w-4" />
                    <span>Trend Analysis</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <Award className="h-4 w-4" />
                    <span>Achievement Badges</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Global Leaderboards</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    About CoDash
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Press Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Help Center</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Community Forum</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6">
                Get the latest features, tips, and coding insights delivered to
                your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700/50">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <a
                href="https://github.com/yash-070702"
                target="_blank"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://portfolio-2-git-main-yash-kumar-aggarwals-projects.vercel.app/"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/yash-kumar-aggarwal-519658265/"
                target="_blank"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Monitor className="h-5 w-5" />
              </a>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2025 CoDash Analytics Platform. All rights reserved.</p>
              <p className="text-sm mt-1">
                Built with ❤️ for developers worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
