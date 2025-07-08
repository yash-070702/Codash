import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignUpPage";

const Auth = () => {
  const [currentPage, setCurrentPage] = useState("signup");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  return(
    
     currentPage === "signup" ? (
    <SignupPage currentPage={currentPage} setCurrentPage={setCurrentPage} />
  ) : (
    <LoginPage currentPage={currentPage} setCurrentPage={setCurrentPage} />
  )
)
};

export default Auth;
