const categoryModel = require("../models/category.model");
const imageService = require("./image.service");
const ApiError = require("../utils/ApiError");

// Port of fetchAllCategories().
const getAll = () => categoryModel.findAll();

// Port of fetchAdminCategories().
const getAllForAdmin = () => categoryModel.findAllForAdmin();

// Port of fetchSingleCategory().
const getById = async (categoryId) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) throw ApiError.notFound("Category not found");
  return category;
};

// Title is unique, so give a clear message before Prisma throws.
const checkTitleIsFree = async (title, categoryId) => {
  const existing = await categoryModel.findByTitle(title);
  if (existing && existing.id !== categoryId) {
    throw ApiError.conflict("Category title already exists");
  }
};

// Port of createCategoryAction().
const create = async ({ data, image, userId }) => {
  if (!image) throw ApiError.badRequest("Category image is required");

  await checkTitleIsFree(data.title);

  return categoryModel.create({
    title: data.title,
    description: data.description || null,
    image: await imageService.saveImage(image),
    userId,
  });
};

// Port of updateCategoryAction().
const update = async (categoryId, data) => {
  await getById(categoryId);
  if (data.title) await checkTitleIsFree(data.title, categoryId);

  return categoryModel.update(categoryId, data);
};

// Port of updateCategoryImageAction().
const updateImage = async (categoryId, image) => {
  if (!image) throw ApiError.badRequest("Category image is required");

  const category = await getById(categoryId);
  const updated = await categoryModel.update(categoryId, {
    image: await imageService.saveImage(image),
  });
  await imageService.deleteImage(category.image);
  return updated;
};

// Port of deleteCategoryAction(). Products keep living with categoryId = null.
const remove = async (categoryId) => {
  const category = await getById(categoryId);
  await categoryModel.remove(categoryId);
  await imageService.deleteImage(category.image);
};

module.exports = { getAll, getAllForAdmin, getById, create, update, updateImage, remove };
