const { prisma } = require("../config/db");

// Replaces authorName / authorImageUrl from the Next.js version.
const author = { select: { id: true, name: true, imageUrl: true } };

const create = (data) =>
  prisma.review.create({
    data,
    include: { user: author },
  });

const findByProduct = (productId) =>
  prisma.review.findMany({
    where: { productId },
    include: { user: author },
    orderBy: { createdAt: "desc" },
  });

const findAll = () =>
  prisma.review.findMany({
    include: {
      product: { select: { id: true, name: true } },
      user: author,
    },
    orderBy: { createdAt: "desc" },
  });

module.exports = { create, findByProduct, findAll };
