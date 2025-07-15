
export const getUserFromLocalStorage = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem("user");
    return null;
  }

  return parsed.user;
};

// Token handling
export const getTokenFromLocalStorage = () => {
  const stored = localStorage.getItem("token");
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem("token");
    return null;
  }

  return parsed.token;
};
