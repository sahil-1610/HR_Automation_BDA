// models/Form.js
const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['text', 'media', 'select', 'radio', 'checkbox', 'email', 'number', 'date', 'phone']
    },
    label: {
        type: String,
        required: true
    },
    placeholder: String,
    options: [String],
    mediaUrl: String,
    required: {
        type: Boolean,
        default: false
    }
});

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    fields: [fieldSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Form', formSchema);
