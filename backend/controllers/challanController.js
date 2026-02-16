const Challan = require('../models/Challan');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');

// @desc    Get all challans for a user
// @route   GET /api/challans
// @access  Private
const getChallans = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 10 } = req.query;

        const query = {};

        // Filter by user role
        if (req.user.role === 'citizen') {
            query.owner = req.user._id;
        }

        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const challans = await Challan.find(query)
            .populate('vehicle', 'plate_number vehicleType make model')
            .populate('issuedBy', 'name official_badge')
            .sort({ issue_timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Challan.countDocuments(query);

        res.status(200).json({
            success: true,
            data: challans,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get challans error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching challans',
            error: error.message
        });
    }
};

// @desc    Get single challan
// @route   GET /api/challans/:id
// @access  Private
const getChallan = async (req, res) => {
    try {
        const challan = await Challan.findById(req.params.id)
            .populate('vehicle')
            .populate('owner', 'name email phone')
            .populate('issuedBy', 'name official_badge');

        if (!challan) {
            return res.status(404).json({
                success: false,
                message: 'Challan not found'
            });
        }

        // Check authorization
        if (req.user.role === 'citizen' && challan.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this challan'
            });
        }

        res.status(200).json({
            success: true,
            data: challan
        });
    } catch (error) {
        console.error('Get challan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching challan',
            error: error.message
        });
    }
};

// @desc    Create new challan
// @route   POST /api/challans
// @access  Private (Officer/Admin only)
const createChallan = async (req, res) => {
    try {
        const {
            plate_number,
            violation_type,
            violation_description,
            location,
            fine_amount,
            images
        } = req.body;

        // Find vehicle
        const vehicle = await Vehicle.findOne({ plate_number }).populate('owner');

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Calculate due date (30 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        // Create challan
        const challan = await Challan.create({
            vehicle: vehicle._id,
            plate_number: vehicle.plate_number,
            owner: vehicle.owner._id,
            owner_name: vehicle.ownerName,
            owner_phone: vehicle.owner.phone,
            violation_type,
            violation_description,
            location,
            fine_amount,
            totalAmount: fine_amount,
            images,
            issuedBy: req.user._id,
            official_name: req.user.name,
            official_badge: req.user.badgeNumber || 'N/A',
            dueDate
        });

        // Create notification for vehicle owner
        await Notification.create({
            user: vehicle.owner._id,
            type: 'challan',
            title: 'New E-Challan Issued',
            message: `A new challan (${challan.challanNumber}) has been issued for vehicle ${registrationNumber}. Fine amount: ₹${fineAmount}`,
            relatedChallan: challan._id,
            priority: 'high'
        });

        res.status(201).json({
            success: true,
            message: 'Challan created successfully',
            data: challan
        });
    } catch (error) {
        console.error('Create challan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating challan',
            error: error.message
        });
    }
};

// @desc    Pay challan
// @route   PUT /api/challans/:id/pay
// @access  Private
const payChallan = async (req, res) => {
    try {
        const { paymentMethod, transactionId } = req.body;

        const challan = await Challan.findById(req.params.id);

        if (!challan) {
            return res.status(404).json({
                success: false,
                message: 'Challan not found'
            });
        }

        // Check authorization
        if (req.user.role === 'citizen' && challan.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay this challan'
            });
        }

        if (challan.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Challan already paid'
            });
        }

        // Update challan
        challan.paymentStatus = 'Paid';
        challan.status = 'Paid';
        challan.paymentDate = new Date();
        challan.paymentMethod = paymentMethod;
        challan.transactionId = transactionId;
        challan.receiptNumber = `RCP${Date.now()}`;

        await challan.save();

        // Create notification
        await Notification.create({
            user: challan.owner,
            type: 'payment',
            title: 'Payment Successful',
            message: `Payment of ₹${challan.totalAmount} for challan ${challan.challan_id} has been processed successfully.`,
            relatedChallan: challan._id,
            priority: 'medium'
        });

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: challan
        });
    } catch (error) {
        console.error('Pay challan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// @desc    Search challan by registration number
// @route   GET /api/challans/search/:registrationNumber
// @access  Public
const searchChallan = async (req, res) => {
    try {
        const { registrationNumber } = req.params;

        const challans = await Challan.find({
            plate_number: registrationNumber.toUpperCase(),
            status: { $in: ['Pending', 'Disputed'] }
        }).sort({ issue_timestamp: -1 });

        res.status(200).json({
            success: true,
            data: challans
        });
    } catch (error) {
        console.error('Search challan error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching challans',
            error: error.message
        });
    }
};

module.exports = {
    getChallans,
    getChallan,
    createChallan,
    payChallan,
    searchChallan
};
