export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
};
