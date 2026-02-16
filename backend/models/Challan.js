const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    // Challan Identification
    challan_id: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    // Vehicle & Owner
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    plate_number: {
        type: String,
        required: true,
        uppercase: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    owner_name: String,
    owner_phone: String,

    // Violation Details
    violation_type: {
        type: String,
        required: true
    },
    violation_description: String,

    // Location & Time
    location: {
        type: String,
        default: 'DELHI ZONE 04'
    },
    issue_timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },

    // Evidence
    proof_image_path: String,
    images: [{
        url: String,
        uploadedAt: Date
    }],
    videoUrl: String,

    // Officer Details
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    official_name: String,
    official_badge: String,

    // Fine Details
    fine_amount: {
        type: Number,
        required: true,
        min: 0
    },
    late_fee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },

    // Payment
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partially-Paid', 'Waived', 'Cancelled'],
        default: 'Pending'
    },
    paymentDate: Date,
    paymentMethod: String,
    transactionId: String,
    receiptNumber: String,

    // Status (Used for both workflow and payment in UI)
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Disputed', 'Cancelled', 'Waived'],
        default: 'Pending'
    },
    disputeReason: String,
    disputeDate: Date,

    // Due Date
    dueDate: {
        type: Date,
        required: true
    },

    // Metadata
    notes: String
}, {
    timestamps: true
});

// Indexes for efficient queries
challanSchema.index({ challan_id: 1 });
challanSchema.index({ plate_number: 1 });
challanSchema.index({ owner: 1 });
challanSchema.index({ paymentStatus: 1 });
challanSchema.index({ status: 1 });
challanSchema.index({ issue_timestamp: -1 });
challanSchema.index({ dueDate: 1 });

// Virtual for overdue status
challanSchema.virtual('isOverdue').get(function () {
    return this.dueDate < new Date() && (this.paymentStatus === 'Pending' || this.status === 'Pending');
});

// Pre-save middleware to generate challan number
challanSchema.pre('save', async function (next) {
    if (!this.challan_id) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.challan_id = `ECH${year}${month}${random}`;
    }

    // Calculate total amount
    this.totalAmount = this.fine_amount + (this.late_fee || 0);

    next();
});

module.exports = mongoose.model('Challan', challanSchema);
