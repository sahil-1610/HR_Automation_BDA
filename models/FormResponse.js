const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    responses: [{
        fieldId: String,
        label: String,
        value: mongoose.Schema.Types.Mixed,
        mediaUrl: String // Add this field for media URLs
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FormResponse', formResponseSchema);