import React, { useState } from "react";
import { createForm, uploadMedia } from "../api/formAPI";
import { useNavigate } from "react-router-dom"; // Add this line

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [fieldType, setFieldType] = useState("text"); // Default field type
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState(""); // For select, checkbox, and radio options
  const [file, setFile] = useState(null); // For media file uploads
  const [message, setMessage] = useState(""); // Keep only one message state
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(""); // Add this line
  const navigate = useNavigate(); // Add this line

  // Handler for adding new fields
  const addField = () => {
    if (!label.trim()) return; // Ensure label is not empty
    const newField = { 
      type: fieldType, 
      label, 
      id: Date.now().toString(),
      placeholder: placeholder // Add placeholder
    };
    if (["checkbox", "radio", "select"].includes(fieldType)) {
      newField.options = options.split(",").map(opt => opt.trim());
    }
    setFormFields([...formFields, newField]);
    setLabel(""); // Clear label after adding field
    setPlaceholder(""); // Clear placeholder
    setOptions(""); // Clear options
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Save form with optional media upload
  const saveForm = async () => {
    if (!formTitle.trim()) {
      setMessage("Please enter a form title");
      return;
    }

    if (formFields.length === 0) {
      setMessage("Please add at least one field");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const form = await createForm({
        title: formTitle,
        fields: formFields,
        createdAt: new Date(),
      });

      if (file && form._id) {
        await uploadMedia(form._id, file);
      }

      setMessage("Form saved successfully!");
      navigate(`/form/${form._id}`);
    } catch (error) {
      setMessage(error.message || "Failed to save form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="mt-1 w-full px-3 py-2 border rounded-md"
            disabled
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border rounded-md"
            disabled
          />
        );
      case 'select':
        return (
          <select className="mt-1 w-full px-3 py-2 border rounded-md" disabled>
            <option value="">Select an option</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="mt-1 space-y-2">
            {field.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-1 space-y-2">
            {field.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input type="checkbox" disabled className="mr-2" />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'media':
        return (
          <div>
            <input
              type="file"
              disabled
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
            <small className="text-gray-500">
              Supported files: Images, PDF, DOC, TXT, RTF
            </small>
          </div>
        );
      case 'phone':
        return (
          <input
            type="tel"
            placeholder="Enter phone number"
            pattern="[0-9]{10}"
            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            disabled
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-8">Create Custom Form</h2>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          className="mb-6 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
              rounded-lg focus:ring-2 focus:ring-blue-500 
              transition-colors duration-300"
          >
            <option value="text" className="bg-white dark:bg-gray-700">Text</option>
            <option value="number" className="bg-white dark:bg-gray-700">Number</option>
            <option value="phone" className="bg-white dark:bg-gray-700">Phone</option>
            <option value="email" className="bg-white dark:bg-gray-700">Email</option>
            <option value="date" className="bg-white dark:bg-gray-700">Date</option>
            <option value="media" className="bg-white dark:bg-gray-700">File Upload</option>
            <option value="checkbox" className="bg-white dark:bg-gray-700">Checkbox</option>
            <option value="radio" className="bg-white dark:bg-gray-700">Radio</option>
            <option value="select" className="bg-white dark:bg-gray-700">Select</option>
          </select>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Field Label"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
              rounded-lg focus:ring-2 focus:ring-blue-500 
              transition-colors duration-300"
          />
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Placeholder text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
              rounded-lg focus:ring-2 focus:ring-blue-500 
              transition-colors duration-300"
          />
          <button
            onClick={addField}
            className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 
              text-white rounded-lg hover:bg-blue-700 
              dark:hover:bg-blue-600 focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 
              transition-colors duration-300"
          >
            Add Field
          </button>
        </div>

        {/* Conditional inputs with enhanced styling */}
        {(fieldType === "checkbox" || fieldType === "radio" || fieldType === "select") && (
          <input
            type="text"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder="Options (comma-separated)"
            className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        )}

        {fieldType === "media" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                       hover:file:bg-blue-100 transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">Supported files: Images, PDF, DOC, TXT, RTF</p>
          </div>
        )}

        {/* Preview section with enhanced styling */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Form Preview</h3>
          <div className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <label className="block font-medium text-gray-700 mb-2">{field.label}</label>
                {renderFieldPreview(field)}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveForm}
          disabled={isLoading}
          className={`w-full mt-8 py-3 px-6 rounded-lg text-white font-medium transition-all
            ${isLoading 
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
              : 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
            }`}
        >
          {isLoading ? 'Saving...' : 'Save Form'}
        </button>

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-700 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
