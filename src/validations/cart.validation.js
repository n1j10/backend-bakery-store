const { z } = require("zod");

const addItemSchema = z.object({
  productId: z.string().uuid("Product id is not valid"),
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

const updateItemSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

module.exports = { addItemSchema, updateItemSchema };
