const mongoose = require('mongoose');
const Form = require("../models/Form");
const FormResponse = require("../models/FormResponse");

exports.createForm = async (req, res) => {
    try {
        console.log('Received form data:', req.body); // Debug log

        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ error: "Form title is required" });
        }

        if (!req.body.fields || !Array.isArray(req.body.fields)) {
            return res.status(400).json({ error: "Form fields must be an array" });
        }

        // Validate each field
        for (const field of req.body.fields) {
            if (!field.type || !field.label) {
                return res.status(400).json({ 
                    error: "Each field must have a type and label" 
                });
            }
        }

        const newForm = new Form({
            title: req.body.title,
            fields: req.body.fields,
            createdAt: new Date()
        });

        const savedForm = await newForm.save();
        console.log('Form saved successfully:', savedForm); // Debug log
        res.status(201).json(savedForm);
    } catch (error) {
        console.error("Form creation error:", error); // Debug log
        res.status(500).json({ 
            error: error.message || "Failed to create form",
            details: error.errors // Include mongoose validation errors if any
        });
    }
};

exports.uploadMedia = async (req, res) => {
    const formId = req.params.id;
    try {
        // Validate request and get cloudinary URL
        if (!res.locals.cloudinary?.url) {
            return res.status(400).json({ 
                success: false,
                cloudinaryUrl: null,
                error: "Media upload failed - missing upload URL"
            });
        }

        const cloudinaryUrl = res.locals.cloudinary.url;

        try {
            // Try to update form, but don't fail if it doesn't work
            const updatedForm = await Form.findOneAndUpdate(
                { _id: formId },
                { 
                    $set: { 
                        "fields.$[field].mediaUrl": cloudinaryUrl
                    }
                },
                {
                    arrayFilters: [{ "field.type": "media" }],
                    new: true
                }
            );

            // Always return success with cloudinaryUrl, even if form update fails
            return res.json({
                success: true,
                cloudinaryUrl: cloudinaryUrl,
                form: updatedForm || null
            });
        } catch (formError) {
            // If form update fails, still return the cloudinaryUrl
            console.warn("Form update failed but image uploaded:", formError);
            return res.json({
                success: false,
                cloudinaryUrl: cloudinaryUrl,
                error: "Form update failed but image was uploaded"
            });
        }
    } catch (error) {
        console.error("Upload media error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to upload media",
            details: error.message
        });
    }
};

exports.getAllForms = async (req, res) => {
    try {
        const forms = await Form.find().sort({ createdAt: -1 });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch forms" });
    }
};

exports.getForm = async (req, res) => {
    try {
        const formId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({ error: "Invalid form ID format" });
        }

        const form = await Form.findById(formId);
        
        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        res.json(form);
    } catch (error) {
        console.error("Error fetching form:", error);
        res.status(500).json({ error: error.message || "Failed to fetch form" });
    }
};

exports.submitFormResponse = async (req, res) => {
    try {
        const { formId } = req.params;
        const { responses } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        // Process the responses and ensure mediaUrl is set for media fields
        const processedResponses = responses.map(response => {
            const field = form.fields.find(f => f._id.toString() === response.fieldId);
            if (field && field.type === 'media' && response.value) {
                return {
                    ...response,
                    mediaUrl: response.value // Store the Cloudinary URL
                };
            }
            return response;
        });

        const formResponse = new FormResponse({
            formId,
            responses: processedResponses,
            submittedAt: new Date()
        });

        await formResponse.save();
        res.status(201).json(formResponse);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to submit form response" });
    }
};

exports.getFormResponses = async (req, res) => {
    try {
        const { formId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({ error: "Invalid form ID format" });
        }

        // Get the form and responses
        const [form, responses] = await Promise.all([
            Form.findById(formId),
            FormResponse.find({ formId }).sort({ submittedAt: -1 })
        ]);

        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        // Log for debugging
        console.log('Raw responses:', responses);

        const formattedResponses = {
            formTitle: form.title,
            totalResponses: responses.length,
            responses: responses.map(response => ({
                _id: response._id,
                submittedAt: response.submittedAt,
                responses: response.responses.map(r => ({
                    fieldId: r.fieldId,
                    label: r.label,
                    value: r.mediaUrl || r.value // Use mediaUrl for media fields
                }))
            }))
        };

        // Log formatted response
        console.log('Formatted responses:', formattedResponses);

        res.json(formattedResponses);
    } catch (error) {
        console.error("Error fetching form responses:", error);
        res.status(500).json({ error: error.message || "Failed to fetch form responses" });
    }
};