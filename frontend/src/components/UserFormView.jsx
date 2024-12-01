import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getForm, submitFormResponse, uploadMedia } from "../api/formAPI";

const UserFormView = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const [filePreview, setFilePreview] = useState({}); // Add this line

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await getForm(formId);
        setForm(data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true); // Add this line

    try {
      let updatedResponses = { ...responses };

      // Handle media files first
      for (const field of form.fields) {
        if (field.type === "media" && responses[field._id] instanceof File) {
          try {
            const uploadResult = await uploadMedia(
              formId,
              responses[field._id]
            );
            updatedResponses[field._id] = uploadResult.cloudinaryUrl;
          } catch (uploadError) {
            console.warn("Media upload warning:", uploadError);
            if (uploadError.cloudinaryUrl) {
              updatedResponses[field._id] = uploadError.cloudinaryUrl;
            }
          }
        }
      }

      // Format responses for submission
      const formattedResponses = form.fields.map((field) => ({
        fieldId: field._id,
        label: field.label,
        value:
          field.type === "media"
            ? updatedResponses[field._id] || ""
            : updatedResponses[field._id] ||
              (field.type === "checkbox" ? [] : ""),
      }));

      // Submit form response
      const submitResult = await submitFormResponse(formId, {
        responses: formattedResponses,
      });
      console.log("Form submission result:", submitResult);

      setMessage("Form submitted successfully!");
      setResponses({});
    } catch (err) {
      console.error("Form submission error:", err);
      setMessage(err.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false); // Add this line
    }
  };

  const handleFileChange = (fieldId, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(prev => ({
          ...prev,
          [fieldId]: reader.result
        }));
      };
      reader.readAsDataURL(file);
      setResponses({ ...responses, [fieldId]: file });
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          {form?.title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form?.fields.map((field) => (
            <div
              key={field._id}
              className="bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <label className="block text-gray-700 font-medium mb-2">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* Enhanced input styling for all field types */}
              {(field.type === "text" ||
                field.type === "email" ||
                field.type === "number" ||
                field.type === "phone") && (
                <input
                  type={field.type === "phone" ? "tel" : field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  pattern={field.type === "phone" ? "[0-9]{10}" : undefined}
                  onChange={(e) =>
                    setResponses({ ...responses, [field._id]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              )}

              {field.type === "select" && (
                <select
                  required={field.required}
                  onChange={(e) =>
                    setResponses({ ...responses, [field._id]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "radio" && (
                <div className="space-y-2">
                  {field.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="radio"
                        name={field._id}
                        value={opt}
                        required={field.required}
                        onChange={(e) =>
                          setResponses({ ...responses, [field._id]: e.target.value })
                        }
                        className="mr-2"
                      />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const currentValues = responses[field._id] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, opt]
                            : currentValues.filter((value) => value !== opt);
                          setResponses({ ...responses, [field._id]: newValues });
                        }}
                        className="mr-2"
                      />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "media" && (
                <div className="space-y-3">
                  {filePreview[field._id] ? (
                    <div className="relative group">
                      <img
                        src={filePreview[field._id]}
                        alt={field.label}
                        className="max-w-full h-auto rounded-lg shadow-sm transition-all"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-500">No file selected</div>
                  )}
                  <input
                    type="file"
                    accept="*/*"
                    required={field.required}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleFileChange(field._id, file);
                    }}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                             file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                             hover:file:bg-blue-100 transition-all"
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                     ${isSubmitting 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Form'
            )}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 text-green-700 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFormView;
