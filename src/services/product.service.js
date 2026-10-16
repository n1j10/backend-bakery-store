const productModel = require("../models/product.model");
const categoryService = require("./category.service");
const imageService = require("./image.service");
const ApiError = require("../utils/ApiError");

// Port of fetchFeaturedProducts().
const getFeatured = () => productModel.findFeatured();

// Port of fetchAllProducts().
const getAll = ({ search, categoryId }) => productModel.findMany({ search, categoryId });

// Port of fetchSingleProduct().
const getById = async (productId) => {
  const product = await productModel.findById(productId);
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};

// Port of fetchAdminPosts().
const getMine = (userId) => productModel.findByOwner(userId);

// Port of createProductAction().
const create = async ({ data, image, userId }) => {
  if (!image) throw ApiError.badRequest("Product image is required");

  await categoryService.getById(data.categoryId);

  return productModel.create({
    ...data,
    image: imageService.toPublicUrl(image.filename),
    userId,
  });
};

// Port of updateProductAction().
const update = async (productId, data) => {
  await getById(productId);
  if (data.categoryId) await categoryService.getById(data.categoryId);

  return productModel.update(productId, data);
};

// Port of updateProductImageAction().
const updateImage = async (productId, image) => {
  if (!image) throw ApiError.badRequest("Product image is required");

  const product = await getById(productId);
  const updated = await productModel.update(productId, {
    image: imageService.toPublicUrl(image.filename),
  });
  await imageService.deleteImage(product.image);
  return updated;
};

// Port of deleteProductAction().
const remove = async (productId) => {
  const product = await getById(productId);
  await productModel.remove(productId);
  await imageService.deleteImage(product.image);
};

module.exports = { getFeatured, getAll, getById, getMine, create, update, updateImage, remove };
