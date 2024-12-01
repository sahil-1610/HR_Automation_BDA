import React, { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
import FormBuilder from "../components/FormBuilder";
import FormView from "../components/FormView";

function Admin() {
  const [activeComponent, setActiveComponent] = useState("dashboard"); // To control which component is displayed
  const [selectedFormId, setSelectedFormId] = useState(null); // To store formId for FormView

  const handleCreateForm = () => setActiveComponent("formBuilder");
  const handleViewForm = (formId) => {
    setSelectedFormId(formId);
    setActiveComponent("formView");
  };
  const handleBackToDashboard = () => setActiveComponent("dashboard");

  return (
    <div>
      {activeComponent === "dashboard" && (
        <AdminDashboard
          onCreateForm={handleCreateForm}
          onViewForm={handleViewForm}
        />
      )}
      {activeComponent === "formBuilder" && (
        <div>
          <button onClick={handleBackToDashboard} className="bg-blue-200 text-black px-4 py-2 rounded">
            Back to Dashboard
          </button>
          <FormBuilder />
        </div>
      )}
      {activeComponent === "formView" && (
        <div>
          <button onClick={handleBackToDashboard} className="bg-blue-200 text-black px-4 py-2 rounded">
            Back to Dashboard
          </button>
          <FormView formId={selectedFormId} />
        </div>
      )}
    </div>
  );
}

export default Admin;
