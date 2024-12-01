import React, { useEffect, useState } from "react";
import { getAllForms } from "../api/formAPI";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const allForms = await getAllForms();
        setForms(allForms);
      } catch (error) {
        console.error("Error fetching forms:", error);
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
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Admin Dashboard
      </h1>

      <button
        onClick={() => navigate('/create-form')}
        className="border-2 border-green-500 bg-green-500 text-white py-2 px-4 rounded cursor-pointer mb-6"
      >
        Create New Form
      </button>
      <div className="bg-white p-6 rounded shadow-md w-3/4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Available Forms</h1>
        <div className="flex flex-col items-center space-y-4">
          {forms.map((form) => (
            <div key={form._id} className="w-full flex justify-between items-center p-4 border rounded">
              <span>{form.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleViewForm(form._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Form
                </button>
                <button
                  onClick={() => copyShareLink(form._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Share Link
                </button>
                <button
                  onClick={() => navigate(`/form/${form._id}/responses`)}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  View Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


