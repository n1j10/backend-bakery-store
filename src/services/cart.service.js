const cartModel = require("../models/cart.model");
const productService = require("./product.service");
const ApiError = require("../utils/ApiError");

// Port of fetchCartItems().
const countItems = async (userId) => {
  const cart = await cartModel.countItems(userId);
  return cart?.numItemsInCart || 0;
};

// Port of fetchOrCreateCart().
const getOrCreateCart = async (userId, { errorOnFailure = false } = {}) => {
  const cart = await cartModel.findByUser(userId);
  if (cart) return cart;
  if (errorOnFailure) throw ApiError.notFound("Cart not found");
  return cartModel.create(userId);
};

// Port of updateCart(): recalculates the stored totals from the cart items.
const recalculateTotals = async (cart) => {
  const cartItems = await cartModel.findItems(cart.id);

  let numItemsInCart = 0;
  let cartTotal = 0;
  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }

  // No tax or shipping in the food menu, so the order total is the cart total.
  const orderTotal = cartTotal;

  return cartModel.updateTotals(cart.id, { numItemsInCart, cartTotal, orderTotal });
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return recalculateTotals(cart);
};

// Port of addToCartAction() + updateOrCreateCartItem().
const addItem = async (userId, { productId, amount }) => {
  await productService.getById(productId);

  const cart = await getOrCreateCart(userId);
  const existingItem = await cartModel.findItem(cart.id, productId);

  if (existingItem) {
    await cartModel.updateItem(existingItem.id, cart.id, {
      amount: existingItem.amount + amount,
    });
  } else {
    await cartModel.createItem({ cartId: cart.id, productId, amount });
  }

  return recalculateTotals(cart);
};

// Port of updateCartItemAction().
const updateItemAmount = async (userId, { cartItemId, amount }) => {
  const cart = await getOrCreateCart(userId, { errorOnFailure: true });

  await cartModel.updateItem(cartItemId, cart.id, { amount });

  return recalculateTotals(cart);
};

// Port of removeCartItemAction().
const removeItem = async (userId, cartItemId) => {
  const cart = await getOrCreateCart(userId, { errorOnFailure: true });

  await cartModel.removeItem(cartItemId, cart.id);

  return recalculateTotals(cart);
};

const remove = (cartId) => cartModel.remove(cartId);

module.exports = {
  countItems,
  getOrCreateCart,
  recalculateTotals,
  getCart,
  addItem,
  updateItemAmount,
  removeItem,
  remove,
};
