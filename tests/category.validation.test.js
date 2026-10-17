const test = require("node:test");
const assert = require("node:assert/strict");
const { categorySchema } = require("../src/validations/category.validation");

test("accepts a category without a description", () => {
  const result = categorySchema.safeParse({ title: "Drinks" });

  assert.equal(result.success, true);
});

test("trims the title", () => {
  const result = categorySchema.safeParse({ title: "  Desserts  " });

  assert.equal(result.data.title, "Desserts");
});

test("rejects a one-letter title", () => {
  const result = categorySchema.safeParse({ title: "D" });

  assert.equal(result.success, false);
});
