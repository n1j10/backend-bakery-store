const orderModel = require("../models/order.model");
const productService = require("./product.service");
const cartService = require("./cart.service");
const ApiError = require("../utils/ApiError");

// "Buy now": one order for a single product.
const createForProduct = async (userId, productId) => {
  const product = await productService.getById(productId);

  return orderModel.create({
    userId,
    productId: product.id,
    products: 1,
    orderTotal: product.price,
  });
};

// Checkout: one order per cart item, then the cart is removed.
const createFromCart = async (userId) => {
  const cart = await cartService.getOrCreateCart(userId, { errorOnFailure: true });
  if (cart.cartItems.length === 0) throw ApiError.badRequest("Cart is empty");

  const orders = cart.cartItems.map((item) => ({
    userId,
    productId: item.productId,
    products: item.amount,
    orderTotal: item.amount * item.product.price,
  }));

  await orderModel.createMany(orders);
  await cartService.remove(cart.id);

  return orderModel.findByUser(userId);
};

// Port of createOrderAction().
const create = (userId, { productId }) =>
  productId ? createForProduct(userId, productId) : createFromCart(userId);

// Port of fetchUserOrders().
const getMine = (userId) => orderModel.findByUser(userId);

// Port of fetchAdminOrders().
const getAll = () => orderModel.findAll();

module.exports = { create, getMine, getAll };
