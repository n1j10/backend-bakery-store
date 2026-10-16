const reviewModel = require("../models/review.model");
const productService = require("./product.service");

// Port of creatReviewAction().
const create = async (userId, { productId, rating, comment }) => {
  await productService.getById(productId);
  return reviewModel.create({ productId, rating, comment, userId });
};

// Port of fetchProductReview().
const getByProduct = async (productId) => {
  await productService.getById(productId);
  return reviewModel.findByProduct(productId);
};

// Port of fetchAllReviews().
const getAll = () => reviewModel.findAll();

module.exports = { create, getByProduct, getAll };
