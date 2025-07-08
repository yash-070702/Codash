import React from "react";
import { Target, Heart, Building, Zap } from "lucide-react";
import yash from "../assets/yash.jpg"; // Assuming you have a profile image for the founder
import Footer from "../components/Common/Footer";
import Header from "../components/Common/Header";
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Navigation */}

      <Header />
      {/* Header Section */}
      <div className="container md:w-8/12 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-10  mt-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            About Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Discover our story, mission, and the passionate team behind our
            success. We're building something extraordinary together.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* Our Story */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-4">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Our Story
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              Founded with a vision to revolutionize the industry, we started as
              a small team with big dreams. Our journey began in 2020 when we
              recognized the need for innovative solutions in the market.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Today, we've grown into a trusted partner for countless clients
              worldwide, always staying true to our core values of excellence
              and integrity.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-4">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              We're committed to delivering exceptional value through
              cutting-edge technology and unparalleled customer service. Our
              mission is to empower businesses and individuals to achieve their
              goals.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Every solution we create is designed with our users in mind,
              ensuring maximum impact and sustainable growth.
            </p>
          </div>

          {/* Our Values */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-4">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Our Values
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              Integrity, innovation, and customer-centricity are at the heart of
              everything we do. We believe in transparent communication and
              building lasting relationships with our partners.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Our commitment to excellence drives us to continuously improve and
              adapt to meet evolving market needs.
            </p>
          </div>

          {/* What Makes Us Different */}
          <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                What Makes Us Different
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              Our unique approach combines deep industry expertise with
              cutting-edge technology. We don't just deliver solutions – we
              create experiences that transform businesses.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              With a focus on scalability and future-proofing, we ensure our
              clients stay ahead of the curve in an ever-evolving landscape.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                100+
              </div>
              <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wide">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                50K+
              </div>
              <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wide">
                Projects Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wide">
                Support Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                5+
              </div>
              <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wide">
                Years Experience
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Meet the Founder
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
            Behind our success is a passionate individual dedicated to
            delivering exceptional results and building lasting relationships.
          </p>

          <div className="flex justify-center px-4">
            {/* Team Member */}
            <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 sm:p-12 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 ">
              {/* <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"> */}
              <img
                src={yash}
                className="w-10 mx-auto w-20 h-20 sm:w-24 sm:h-24 h-10 rounded-full   text-white"
              />
              {/* </div> */}
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                Yash Kumar Aggarwal
              </h3>
              <p className="text-purple-400 text-xs sm:text-sm uppercase tracking-wide mb-4 sm:mb-6">
                Founder & CEO
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                A visionary entrepreneur with a passion for innovation and
                excellence. With years of experience in the industry, dedicated
                to creating solutions that make a real difference for clients
                and partners.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-8 max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Contact Us
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Section - Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Got an Idea? We've Got the Skills. Let's Team Up
                </h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Tell us more about yourself and what you have in mind
                </p>
              </div>

              {/* Contact Items */}
              <div className="space-y-6">
                {/* Chat on us */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm sm:text-base">
                      Chat with us
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm break-all">
                      yashagarwal2022.ya@gmail.com
                    </p>
                  </div>
                </div>

                {/* Visit us */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm sm:text-base">
                      Visit us
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      KIET Group Of Institutions, G2B Muradnagar
                      <br />
                      201206
                    </p>
                  </div>
                </div>

                {/* Call us */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm sm:text-base">
                      Call us
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      +91 327 123 0778
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 rounded-md bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 rounded-md bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 rounded-md bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <select className="px-3 py-2 rounded-l-md bg-slate-700/80 border border-slate-600/50 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      className="flex-1 px-3 py-2 rounded-r-md bg-slate-700/80 border border-slate-600/50 border-l-0 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="12345 67890"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 rounded-md bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    placeholder="Enter your message here"
                  ></textarea>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
