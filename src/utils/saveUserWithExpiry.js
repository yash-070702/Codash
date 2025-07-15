export const saveUserWithExpiry = (user, expiryMinutes = 30) => {
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  const userData = {
    user,
    expiry: expiryTime,
  };
  localStorage.setItem("user", JSON.stringify(userData));
};

