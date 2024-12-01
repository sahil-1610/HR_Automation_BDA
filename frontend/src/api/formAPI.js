import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const createForm = async (formSchema) => {
  try {
    if (!formSchema.title || !formSchema.fields) {
      throw new Error('Invalid form data: title and fields are required');
    }

    const response = await axios.post(`${BASE_URL}/forms`, formSchema);
    return response.data;
  } catch (error) {
    console.error("Failed to create form:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const uploadMedia = async (formId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/forms/upload-media/${formId}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      }
    );

    console.log("Upload response:", response.data);

    // Even if form update failed, we can still use the cloudinaryUrl
    if (response.data.cloudinaryUrl) {
      return {
        cloudinaryUrl: response.data.cloudinaryUrl,
        form: response.data.form
      };
    }

    throw new Error('No cloudinary URL in response');
  } catch (error) {
    console.error("Media upload error:", error.response?.data || error);
    // If we have a cloudinary URL in the error response, use it
    if (error.response?.data?.cloudinaryUrl) {
      return {
        cloudinaryUrl: error.response.data.cloudinaryUrl,
        form: null
      };
    }
    throw new Error(`Media upload failed: ${error.response?.data?.error || error.message}`);
  }
};

export const getForm = async (formId) => {
  if (!formId) {
    throw new Error('Form ID is required');
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/forms/${formId}`);
    if (!response.data) {
      throw new Error('No form data received');
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch form:", error);
    if (error.response?.status === 404) {
      throw new Error('Form not found');
    }
    throw error;
  }
};

export const getAllForms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/forms`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    throw error;
  }
};

export const submitFormResponse = async (formId, responseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/forms/${formId}/submit`, responseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit form');
  }
};

export const getFormResponses = async (formId) => {
  try {
    const response = await axios.get(`${BASE_URL}/forms/${formId}/responses`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch responses');
  }
};
