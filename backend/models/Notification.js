const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Recipient
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Notification Details
    type: {
        type: String,
        enum: ['challan', 'payment', 'document-expiry', 'system', 'alert'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },

    // Related Data
    relatedChallan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challan'
    },
    relatedVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },

    // Status
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,

    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
