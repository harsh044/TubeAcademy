const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middleware/auth");

// controllers
const {
    updateProfile,
    updateUserProfileImage,
    getUserDetails,
    getEnrolledCourses,
    deleteAccount,
    instructorDashboard,
    contactUs
} = require('../controllers/profile');


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete('/deleteProfile', auth, deleteAccount);
router.put('/updateProfile', auth, updateProfile);
router.get('/getUserDetails', auth, getUserDetails);


// Get Enrolled Courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

// update profile image
router.put('/updateUserProfileImage', auth, updateUserProfileImage);

// instructor Dashboard Details
router.get('/instructorDashboard', auth, isAdmin, instructorDashboard);

// Constact Us 
router.post('/contactUs', contactUs);


module.exports = router;
