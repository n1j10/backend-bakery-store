const express = require("express");
const controller = require("../controllers/review.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { reviewSchema } = require("../validations/review.validation");

const router = express.Router();

router.get("/product/:productId", controller.getByProduct);
router.get("/all", authenticate, requireAdmin, controller.getAll);
router.post("/", authenticate, validate(reviewSchema), controller.create);

module.exports = router;
