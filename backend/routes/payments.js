const express = require('express');
const router = express.Router();

const { sendPaymentSuccessEmail } = require('../controllers/payments');
const { auth, isAdmin, isStudent } = require('../middleware/auth');

router.post('/sendPaymentSuccessEmail', auth, isStudent, sendPaymentSuccessEmail);
// router.post('/verifyPayment', auth, isStudent, verifyPayment);

module.exports = router
