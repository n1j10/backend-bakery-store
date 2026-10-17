const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/user.model");

const readToken = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

// Replaces Clerk's getAuthUser(): reads "Authorization: Bearer <token>".
const authenticate = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) throw ApiError.unauthorized("Login required");

    const payload = jwt.verify(token, config.jwt.secret);
    const user = await userModel.findById(payload.sub);
    if (!user) throw ApiError.unauthorized("Login required");

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};

// Replaces getAdminUser() (ADMIN_USER_ID -> role ADMIN).
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(ApiError.forbidden("Admins only"));
  }
  next();
};

// For endpoints that work with or without a user (e.g. cart count, favorite id).
const optionalAuth = async (req, res, next) => {
  const token = readToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = await userModel.findById(payload.sub);
  } catch {
    req.user = undefined;
  }
  next();
};

module.exports = { authenticate, requireAdmin, optionalAuth };
