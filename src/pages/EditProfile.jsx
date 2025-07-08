import React, { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, AlertTriangle, X } from "lucide-react";
import { Globe, Github, Monitor } from "lucide-react";
import Header from "../components/Common/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteProfile } from "../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/operations/profileAPI";

const EditProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    _id: user?._id || "",
    _rev: user?._rev || "",
    fullName: user?.fullName || "",
    codeforcesURL: user?.codeforcesURL || "",
    hackerRankURL: user?.hackerRankURL || "",
    leetCodeURL: user?.leetCodeURL || "",
    gfgURL: user?.gfgURL || "",
    codeChefURL: user?.codeChefURL || "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isDeleteConfirmValid = deleteConfirmText.toLowerCase() === "confirm";

  // Update profileData when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        _id: user._id,
        _rev: user._rev,
        fullName: user.fullName || "",
        codeforcesURL: user.codeforcesURL || "",
        hackerRankURL: user.hackerRankURL || "",
        leetCodeURL: user.leetCodeURL || "",
        gfgURL: user.gfgURL || "",
        codeChefURL: user.codeChefURL || "",
      });
    }
  }, [user]);
  console.log(profileData);

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSave = () => {
    // Ensure we have the latest _id and _rev from user
    const formDataWithIds = {
      ...profileData,
      _id: user._id,
      _rev: user._rev,
    };
    
    dispatch(updateProfile(token, formDataWithIds, navigate));
    console.log("Profile updated");
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password updated");
    // Add your password save logic here
    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmValid) return;

    setIsDeleting(true);

    // Simulate API call
    dispatch(deleteProfile(token, navigate));

    setIsDeleting(false);
    setShowDeleteModal(false);
    setDeleteConfirmText("");
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
  };

  // Early return if user is not loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Header />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mt-20 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">View all your profile details here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 mb-6 shadow-2xl">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <User
                        className="w-16 h-16 text-gray-300"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user.fullName}
                </h2>
                <p className="text-purple-400 text-sm mb-4">Premium User</p>
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/30 backdrop-blur-sm border border-red-700/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">
                  Danger Zone
                </h3>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Right Column - Profile Details and Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Section */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Profile Information
                  </h3>
                </div>
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        handleProfileChange("fullName", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Codeforces URL
                    </label>
                    <input
                      type="text"
                      value={profileData.codeforcesURL}
                      onChange={(e) =>
                        handleProfileChange("codeforcesURL", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your Codeforces URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      HackerRank URL
                    </label>
                    <input
                      type="text"
                      value={profileData.hackerRankURL}
                      onChange={(e) =>
                        handleProfileChange("hackerRankURL", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your HackerRank URL"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LeetCode URL
                    </label>
                    <input
                      type="text"
                      value={profileData.leetCodeURL}
                      onChange={(e) =>
                        handleProfileChange("leetCodeURL", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your LeetCode URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GeeksforGeeks URL
                    </label>
                    <input
                      type="text"
                      value={profileData.gfgURL}
                      onChange={(e) =>
                        handleProfileChange("gfgURL", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your GFG URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CodeChef URL
                    </label>
                    <input
                      type="text"
                      value={profileData.codeChefURL}
                      onChange={(e) =>
                        handleProfileChange("codeChefURL", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your CodeChef URL"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Never"}
                  </div>
                  <button
                    onClick={handleProfileSave}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center mb-6">
                <Lock className="w-5 h-5 text-purple-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">
                  Change Password
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password match indicator */}
              {passwordData.newPassword && passwordData.confirmPassword && (
                <div
                  className={`text-sm mt-4 ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {passwordData.newPassword === passwordData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </div>
              )}

              <button
                onClick={handlePasswordSave}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Delete Account
                </h2>
              </div>
              <button
                onClick={handleCloseDeleteModal}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove all of your data from our servers.
              </p>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-red-300 text-sm">
                  <strong>Warning:</strong> All your coding profiles, progress,
                  and personal data will be permanently lost.
                </p>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="mb-6">
              <label
                htmlFor="deleteConfirmText"
                className="block text-sm font-medium text-gray-300 mb-3"
              >
                Type <span className="text-red-400 font-semibold">Confirm</span>{" "}
                to delete your account
              </label>
              <input
                id="deleteConfirmText"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'Confirm' here"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!isDeleteConfirmValid || isDeleting}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isDeleteConfirmValid && !isDeleting
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 px-10 border-t border-slate-700/50">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <a
            href="https://github.com/yash-070702"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://portfolio-2-git-main-yash-kumar-aggarwals-projects.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Globe className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/yash-kumar-aggarwal-519658265/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <Monitor className="h-5 w-5" />
          </a>
        </div>
        <div className="text-center text-gray-400">
          <p>&copy; 2025 CoDash Analytics Platform. All rights reserved.</p>
          <p className="text-sm mt-1">Built with ❤️ for developers worldwide</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;