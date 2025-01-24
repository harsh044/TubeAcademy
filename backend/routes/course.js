const express = require('express');
const router = express.Router();

// Import required controllers

// course controllers 
const {
    createCourse,
    getCourseDetails,
    getAllCourses,
    getFullCourseDetails,
    editCourse,
    deleteCourse,
    getInstructorCourses,
    updateCourse
} = require('../controllers/course')

const { updateCourseProgress } = require('../controllers/courseProgress')
const { getCertificateView,getCertificateViewGlobal } = require('../controllers/certificateView')

// categories Controllers
const {
    createCategory,
    showAllCategories,
    getCategoryPageDetails,
    deleteCategory,
} = require('../controllers/category');


// sections controllers
const {
    createSection,
    updateSection,
    deleteSection,
} = require('../controllers/section');


// subSections controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require('../controllers/subSection');


// rating controllers
const {
    createRating,
    getAverageRating,
    getAllRatingReview,
    checkRating
} = require('../controllers/ratingAndReview');


// Middlewares
const { auth, isAdmin, isStudent } = require('../middleware/auth')


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors

router.post('/createCourse', auth, isAdmin, createCourse);
router.post('/updateCourse', auth, isAdmin, updateCourse);

//Add a Section to a Course
router.post('/addSection', auth, isAdmin, createSection);
// Update a Section
router.post('/updateSection', auth, isAdmin, updateSection);
// Delete a Section
router.post('/deleteSection', auth, isAdmin, deleteSection);

// Add a Sub Section to a Section
router.post('/addSubSection', auth, isAdmin, createSubSection);
// Edit Sub Section
router.post('/updateSubSection', auth, isAdmin, updateSubSection);
// Delete Sub Section
router.post('/deleteSubSection', auth, isAdmin, deleteSubSection);


// Get Details for a Specific Courses
router.post('/getCourseDetails', getCourseDetails);
// Get all Courses
router.get('/getAllCourses', getAllCourses);
//View Certificate All Global
router.get('/certificate/:certificateId', getCertificateViewGlobal);
// get full course details
router.post('/getFullCourseDetails', auth, getFullCourseDetails);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isAdmin, getInstructorCourses)


// Edit Course routes
router.post("/editCourse", auth, isAdmin, editCourse)

// Delete a Course
router.delete("/deleteCourse", auth, isAdmin, deleteCourse)

// update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// Get Course Certificate
router.post("/certificateView", auth, isStudent, getCertificateView)


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin

router.post('/createCategory', auth, isAdmin, createCategory);
router.delete('/deleteCategory', auth, isAdmin, deleteCategory);
router.get('/showAllCategories', showAllCategories);
router.post("/getCategoryPageDetails", getCategoryPageDetails)




// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post('/createRating', auth, isStudent, createRating);
// router.post('/checkRating', auth, isStudent, checkRating);
router.get('/getAverageRating', getAverageRating);
router.get('/getReviews', getAllRatingReview);


module.exports = router;