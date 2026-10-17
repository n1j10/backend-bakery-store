const { prisma } = require("../config/db");

// Product cards show the category name
const withCategoryTitle = { category: { select: { id: true, title: true } } };

const findFeatured = () =>
  prisma.product.findMany({
    where: { featured: true },
    include: withCategoryTitle,
  });

const findMany = ({ search = "", categoryId } = {}) =>
  prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: withCategoryTitle,
    orderBy: { createdAt: "desc" },
  });

const findById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

const findByOwner = (userId) =>
  prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

const create = (data) => prisma.product.create({ data });

const update = (id, data) =>
  prisma.product.update({
    where: { id },
    data,
  });

const remove = (id) => prisma.product.delete({ where: { id } });

module.exports = { findFeatured, findMany, findById, findByOwner, create, update, remove };
