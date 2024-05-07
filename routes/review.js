const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const review = require('../controllers/review')

const catchAsync = require('../utils/catchAsync');

router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(review.reviews))

router.route('/:reviewId')
        .delete(isLoggedIn, isReviewAuthor, catchAsync(review.deletereviews)) 

module.exports = router;