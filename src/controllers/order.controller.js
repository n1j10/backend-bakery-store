const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const orderService = require("../services/order.service");

const create = asyncHandler(async (req, res) => {
  const orders = await orderService.create(req.user.id, req.body);
  sendSuccess(res, 201, orders, "Order created");
});

const getMine = asyncHandler(async (req, res) => {
  const orders = await orderService.getMine(req.user.id);
  sendSuccess(res, 200, orders);
});

const getAll = asyncHandler(async (req, res) => {
  const orders = await orderService.getAll();
  sendSuccess(res, 200, orders);
});

module.exports = { create, getMine, getAll };
