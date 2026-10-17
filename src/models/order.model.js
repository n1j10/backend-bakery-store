const { prisma } = require("../config/db");

const productName = { product: { select: { name: true } } };

const create = (data) => prisma.order.create({ data, include: productName });

const createMany = (orders) => prisma.order.createMany({ data: orders });

const findByUser = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: productName,
    orderBy: { createdAt: "desc" },
  });

const findAll = () =>
  prisma.order.findMany({
    include: productName,
    orderBy: { createdAt: "desc" },
  });

module.exports = { create, createMany, findByUser, findAll };
