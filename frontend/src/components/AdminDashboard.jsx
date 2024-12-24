import React, { useEffect, useState } from "react";
import { getAllForms } from "../api/formAPI";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const allForms = await getAllForms();
        // Ensure forms is always an array
        setForms(Array.isArray(allForms) ? allForms : []);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setError("Failed to load forms");
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleViewForm = (formId) => {
    navigate(`/form/${formId}`);
  };

  const copyShareLink = (formId) => {
    const shareLink = `${window.location.origin}/fill-form/${formId}`;
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
        Admin Dashboard
      </h1>

      <button
        onClick={() => navigate('/create-form')}
        className="border-2 border-green-500 bg-green-500 dark:bg-green-600 text-white py-2 px-4 rounded cursor-pointer mb-6 hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300"
      >
        Create New Form
      </button>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-3/4">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
          Available Forms
        </h1>
        {loading ? (
          <div className="text-center py-4">Loading forms...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : forms.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No forms available</div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {forms.map((form) => (
              <div key={form._id} className="w-full flex justify-between items-center p-4 border rounded border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span className="text-gray-900 dark:text-gray-100">{form.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleViewForm(form._id)}
                    className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Form
                  </button>
                  <button
                    onClick={() => copyShareLink(form._id)}
                    className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700"
                  >
                    Share Link
                  </button>
                  <button
                    onClick={() => navigate(`/form/${form._id}/responses`)}
                    className="bg-purple-500 dark:bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-600 dark:hover:bg-purple-700"
                  >
                    View Responses
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


