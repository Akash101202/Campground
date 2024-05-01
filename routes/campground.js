const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})


router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campground.createCampground));
    

router.get('/new', isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campground.updatedCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCamp));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.edit))




module.exports = router;