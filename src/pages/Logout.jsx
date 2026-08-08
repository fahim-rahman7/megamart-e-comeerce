import React from "react";

const Logout = ({ className = "", children }) => {
  const handleLogout = () => {
    // Clear authentication cookies
    document.cookie = "acc_tkn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ref_tkn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Force hard reload to reset state and redirect to login
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
};

export default Logout;