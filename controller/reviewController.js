
const Review = require("../model/review");
const Company = require("../model/company");

exports.createReview = async (req, res) => {
  try {
    const { companyId, rating, reviewMessage } = req.body;

    // validation
    if (!companyId || !rating || !reviewMessage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // check already reviewed
    const alreadyReviewed = await Review.findOne({
      companyId,
      userId: req.user.userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this company",
      });
    }

    // create review
    const review = await Review.create({
      companyId,
      userId: req.user.userId,
      rating,
      reviewMessage,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCompanyReviewSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    // check company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // get all reviews
    const reviews = await Review.find({ companyId });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? (totalRating / totalReviews).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      companyName: company.companyName,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getCompanyReviews = async (req, res) => {
  try {
    const { companyId } = req.params;

    // check company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // get reviews
    const reviews = await Review.find({ companyId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companyName: company.companyName,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};