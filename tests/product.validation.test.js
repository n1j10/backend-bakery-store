const test = require("node:test");
const assert = require("node:assert/strict");
const { productSchema, updateProductSchema } = require("../src/validations/product.validation");

const validDescription = Array.from({ length: 12 }, () => "word").join(" ");
const categoryId = "3f1c2b6e-8d4a-4c1e-9b7a-2e5f6a7b8c9d";

test("accepts a valid product", () => {
  const result = productSchema.safeParse({
    name: "Chicken shawarma",
    description: validDescription,
    price: "12",
    featured: "true",
    categoryId,
  });

  assert.equal(result.success, true);
  assert.equal(result.data.price, 12);
  assert.equal(result.data.featured, true);
});

test("reads featured 'false' as false", () => {
  const result = productSchema.safeParse({
    name: "Falafel wrap",
    description: validDescription,
    price: 5,
    featured: "false",
    categoryId,
  });

  assert.equal(result.data.featured, false);
});

test("rejects a product without a category", () => {
  const result = productSchema.safeParse({
    name: "Falafel wrap",
    description: validDescription,
    price: 5,
  });

  assert.equal(result.success, false);
});

test("rejects a description with too few words", () => {
  const result = productSchema.safeParse({
    name: "Falafel wrap",
    description: "too short",
    price: 5,
    categoryId,
  });

  assert.equal(result.success, false);
});

test("update keeps featured untouched when it is not sent", () => {
  const result = updateProductSchema.safeParse({ price: 7 });

  assert.equal(result.success, true);
  assert.equal(result.data.featured, undefined);
});
