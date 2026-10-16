const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/category.service");

const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, 200, categories);
});

const getAllForAdmin = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllForAdmin();
  sendSuccess(res, 200, categories);
});

const getOne = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  sendSuccess(res, 200, category);
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create({
    data: req.body,
    image: req.file,
    userId: req.user.id,
  });
  sendSuccess(res, 201, category, "Category created");
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  sendSuccess(res, 200, category, "Category updated");
});

const updateImage = asyncHandler(async (req, res) => {
  const category = await categoryService.updateImage(req.params.id, req.file);
  sendSuccess(res, 200, category, "Category image updated");
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  sendSuccess(res, 200, null, "Category removed");
});

module.exports = { getAll, getAllForAdmin, getOne, create, update, updateImage, remove };
