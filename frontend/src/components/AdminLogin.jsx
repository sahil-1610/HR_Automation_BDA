import React, { useState } from "react";

function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleCodeSubmit = () => {
    if (code === process.env.REACT_APP_ADMIN_CODE) {
      localStorage.setItem("isAdminAuthenticated", "true");
      window.location.href = "/Admin";
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Access</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit code"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleCodeSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
