const favoriteModel = require("../models/favorite.model");
const productService = require("./product.service");

// Port of fetchFavoritID(): null when the user is a guest or has not saved it.
const getFavoriteId = async (userId, productId) => {
  if (!userId) return null;
  const favorite = await favoriteModel.findOne(userId, productId);
  return favorite?.id || null;
};

// Port of toggleFavAction(). The server finds the favorite itself,
// so the client only sends the product id.
const toggle = async (userId, productId) => {
  await productService.getById(productId);

  const existing = await favoriteModel.findOne(userId, productId);

  if (existing) {
    await favoriteModel.remove(existing.id);
    return { favorited: false, message: "Removed from favorites" };
  }

  await favoriteModel.create(userId, productId);
  return { favorited: true, message: "Added to favorites" };
};

// Port of fetchUserFav().
const getMine = (userId) => favoriteModel.findByUser(userId);

module.exports = { getFavoriteId, toggle, getMine };
