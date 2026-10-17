const { z } = require("zod");

// productId given -> order that one product, otherwise order the whole cart.
const createOrderSchema = z.object({
  productId: z.string().uuid("Product id is not valid").optional(),
});

module.exports = { createOrderSchema };
