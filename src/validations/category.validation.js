const { z } = require("zod");

// Ported from utils/schema.ts (categorySchema).
const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(50, "Title must be at most 50 characters long"),

  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters long")
    .optional(),
});

const updateCategorySchema = categorySchema.partial();

module.exports = { categorySchema, updateCategorySchema };
