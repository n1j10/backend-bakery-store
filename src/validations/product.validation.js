const { z } = require("zod");

// Ported from utils/schema.ts (productSchema).
const productSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(30, "Name must be at most 30 characters long"),

  description: z.string().refine((description) => {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 10 && wordCount <= 500;
  }, "Description must be between 10 and 500 words"),

  price: z.coerce.number().int().min(0, "Price must be a positive number"),

  // Form data sends text, and z.coerce.boolean() would turn "false" into true.
  featured: z.preprocess((value) => value === true || value === "true" || value === "on", z.boolean()),

  categoryId: z.string().uuid("Please select a category"),
});

const updateProductSchema = productSchema.partial();

const listProductsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid("Category id is not valid").optional(),
});

module.exports = { productSchema, updateProductSchema, listProductsSchema };
