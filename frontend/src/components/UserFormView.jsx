import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getForm, submitFormResponse, uploadMedia } from "../api/formAPI";

const UserFormView = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formData = await getForm(formId);
        setForm(formData);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      let updatedResponses = { ...responses };

      // Handle media files first
      for (const field of form.fields) {
        if (field.type === 'media' && responses[field._id] instanceof File) {
          try {
            const uploadResult = await uploadMedia(formId, responses[field._id]);
            updatedResponses[field._id] = uploadResult.cloudinaryUrl;
          } catch (uploadError) {
            console.warn('Media upload warning:', uploadError);
            if (uploadError.cloudinaryUrl) {
              updatedResponses[field._id] = uploadError.cloudinaryUrl;
            }
          }
        }
      }

      // Format responses for submission
      const formattedResponses = form.fields.map(field => ({
        fieldId: field._id,
        label: field.label,
        value: field.type === 'media' ? updatedResponses[field._id] || '' : updatedResponses[field._id] || (field.type === 'checkbox' ? [] : '')
      }));

      // Submit form response
      const submitResult = await submitFormResponse(formId, { responses: formattedResponses });
      console.log('Form submission result:', submitResult);
      
      setMessage("Form submitted successfully!");
      setResponses({});
    } catch (err) {
      console.error('Form submission error:', err);
      setMessage(err.message || "Failed to submit form");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">{form?.title}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form?.fields.map((field) => (
            <div key={field._id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <label className="block text-gray-700 font-medium mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {/* Enhanced input styling for all field types */}
              {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'phone') && (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  pattern={field.type === 'phone' ? "[0-9]{10}" : undefined}
                  onChange={(e) => setResponses({...responses, [field._id]: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              )}

              {/* ...other field types with similar enhanced styling... */}

              {field.type === 'media' && (
                <div className="space-y-3">
                  {field.mediaUrl ? (
                    <div className="relative group">
                      <img 
                        src={field.mediaUrl} 
                        alt={field.label} 
                        className="max-w-full h-auto rounded-lg shadow-sm transition-all"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-500">No media uploaded</div>
                  )}
                  <input
                    type="file"
                    accept="*/*"
                    required={field.required}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setResponses({...responses, [field._id]: file});
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
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Form
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