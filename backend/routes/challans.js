const express = require('express');
const router = express.Router();
const {
    getChallans,
    getChallan,
    createChallan,
    payChallan,
    searchChallan
} = require('../controllers/challanController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/search/:registrationNumber', searchChallan);

// Protected routes
router.get('/', protect, getChallans);
router.get('/:id', protect, getChallan);
router.post('/', protect, authorize('officer', 'admin'), createChallan);
router.put('/:id/pay', protect, payChallan);

module.exports = router;
