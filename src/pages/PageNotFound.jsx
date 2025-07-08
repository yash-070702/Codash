import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, AlertTriangle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
  const [glitchText, setGlitchText] = useState('404');
  const navigate = useNavigate();
  useEffect(() => {
    const glitchChars = ['4', '0', '4', '∀', '0', '4', '੦', '0', '4'];
    let index = 0;
    
    const interval = setInterval(() => {
      setGlitchText(glitchChars[index]);
      index = (index + 1) % glitchChars.length;
    }, 500);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Glitch Effect 404 */}
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 filter drop-shadow-lg">
              {glitchText}
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500 opacity-30 animate-pulse">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500 text-sm">
              But don't worry, we'll help you find your way back!
            </p>
          </div>

          {/* Floating Elements */}
          <div className="relative mb-12">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full animate-bounce"></div>
            <div className="absolute -top-2 -right-6 w-4 h-4 bg-blue-500/30 rounded-full animate-bounce delay-100"></div>
            <div className="absolute -bottom-6 left-8 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Go Back Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <ArrowLeft className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Go Back</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Return to the previous page you were on.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Go Back
            </button>
          </div>

          {/* Home Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Home className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Home</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Go back to the homepage and start fresh.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Go Home
            </button>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white ml-3">Contact</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Need help? Get in touch with our support team.
            </p>
            <button
              onClick={() =>navigate('/about-us')}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Contact Us
            </button>
          </div>
        </div>

      

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-gray-400 text-sm">
              Error Code: 404 - Page Not Found
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;