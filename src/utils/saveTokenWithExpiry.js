export const saveTokenWithExpiry = (token, expiryMinutes = 30) => {
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  const tokenData = {
    token,
    expiry: expiryTime,
  };
  localStorage.setItem("token", JSON.stringify(tokenData));
};

