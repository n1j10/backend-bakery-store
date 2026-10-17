const { prisma } = require("../config/db");

const includeCartItems = {
  cartItems: {
    include: { product: true },
  },
};

const findByUser = (userId) =>
  prisma.cart.findFirst({
    where: { userId },
    include: includeCartItems,
  });

const create = (userId) =>
  prisma.cart.create({
    data: { userId },
    include: includeCartItems,
  });

const countItems = (userId) =>
  prisma.cart.findFirst({
    where: { userId },
    select: { numItemsInCart: true },
  });

const updateTotals = (cartId, totals) =>
  prisma.cart.update({
    where: { id: cartId },
    data: totals,
    include: includeCartItems,
  });

const remove = (cartId) => prisma.cart.delete({ where: { id: cartId } });

const findItems = (cartId) =>
  prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

const findItem = (cartId, productId) =>
  prisma.cartItem.findFirst({
    where: { cartId, productId },
  });

const createItem = (data) => prisma.cartItem.create({ data });

const updateItem = (id, cartId, data) =>
  prisma.cartItem.update({
    where: { id, cartId },
    data,
  });

const removeItem = (id, cartId) =>
  prisma.cartItem.delete({
    where: { id, cartId },
  });

module.exports = {
  findByUser,
  create,
  countItems,
  updateTotals,
  remove,
  findItems,
  findItem,
  createItem,
  updateItem,
  removeItem,
};
