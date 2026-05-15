// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();

const { createReview,getCompanyReviewSummary,getCompanyReviews } = require("../controller/reviewController");

const auth = require("../middleware/authMiddleware");

// Create Review
router.post("/create", auth, createReview);
router.get("/summary/:companyId", getCompanyReviewSummary);

router.get("/reviews/:companyId", getCompanyReviews);

module.exports = router;