import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm, getFormResponses } from "../api/formAPI";

const FormView = ({ showResponses }) => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formData, responsesData] = await Promise.all([
          getForm(formId),
          showResponses ? getFormResponses(formId) : Promise.resolve([]),
        ]);
        setForm(formData);
        setResponses(responsesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [formId, showResponses]);

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            className="shadow border rounded w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={field.placeholder || ""}
            disabled
          />
        );
      case "date":
        return (
          <input
            type="date"
            className="shadow border rounded w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            defaultValue={new Date().toISOString().split('T')[0]}
            disabled
          />
        );
      case "select":
        return (
          <select className="shadow border rounded w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" disabled>
            <option value="">Select an option</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} className="bg-gray-50 dark:bg-gray-700">{opt}</option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input type="checkbox" disabled className="mr-2" />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        );
      case "media":
        return field.mediaUr;
      default:
        return null;
    }
  };

  const renderResponses = () => {
    // Debug logs
    console.log("Responses state:", responses);

    // Check if responses is empty or undefined
    if (
      !responses ||
      !responses.totalResponses ||
      responses.totalResponses === 0
    ) {
      return <p className="text-gray-500 dark:text-gray-400 italic">No responses yet</p>;
    }

    // Map through the responses array
    return responses.responses.map((response, idx) => (
      <div
        key={response._id || idx}
        className="border border-gray-200 dark:border-gray-700 p-4 rounded mb-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
      >
        <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Response #{idx + 1}</h3>
        {response.responses.map((fieldResponse, fidx) => (
          <div key={`${response._id}-${fidx}`} className="mb-2">
            <p className="font-medium text-gray-800 dark:text-gray-200">{fieldResponse.label}:</p>
            <p className="ml-4 text-gray-700 dark:text-gray-300">
              {fieldResponse.value === null || fieldResponse.value === ""
                ? "No response"
                : Array.isArray(fieldResponse.value)
                ? fieldResponse.value.join(", ")
                : String(fieldResponse.value)}
            </p>
          </div>
        ))}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Submitted: {new Date(response.submittedAt).toLocaleString()}
        </p>
      </div>
    ));
  };

  if (error) return <div className="text-red-500 dark:text-red-400">Error: {error}</div>;
  if (!form) return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{form.title}</h1>
      {showResponses ? (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Form Responses</h2>
          {renderResponses()}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 transition-colors duration-300">
          {form.fields?.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormView;
