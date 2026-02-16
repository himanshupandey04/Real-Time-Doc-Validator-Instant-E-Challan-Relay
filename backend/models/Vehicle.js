const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    // Vehicle Registration
    plate_number: {
        type: String,
        required: [true, 'Plate number is required'],
        unique: true,
        uppercase: true,
        trim: true
    },

    // Owner Information
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },

    // Vehicle Details
    vehicleType: {
        type: String,
        enum: ['two-wheeler', 'three-wheeler', 'four-wheeler', 'heavy-vehicle', 'commercial'],
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    color: String,
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric', 'cng', 'hybrid']
    },

    // Documents
    registrationDate: {
        type: Date,
        required: true
    },
    registrationExpiry: Date,
    insuranceNumber: String,
    insuranceExpiry: Date,
    pucNumber: String,
    pucExpiry: Date,

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isBlacklisted: {
        type: Boolean,
        default: false
    },
    blacklistReason: String,

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
vehicleSchema.index({ plate_number: 1 });
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ isBlacklisted: 1 });

// Check if documents are expired
vehicleSchema.virtual('hasExpiredDocuments').get(function () {
    const now = new Date();
    return (
        (this.registrationExpiry && this.registrationExpiry < now) ||
        (this.insuranceExpiry && this.insuranceExpiry < now) ||
        (this.pucExpiry && this.pucExpiry < now)
    );
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
