# Food Menu API (Express)

REST API ported from the Next.js server actions in
[`utils/actions.ts`](https://github.com/n1j10/Food-Menu/blob/main/utils/actions.ts)
and the Zod schemas in [`utils/schema.ts`](https://github.com/n1j10/Food-Menu/blob/main/utils/schema.ts).

## Layers

```
routes  ->  middlewares (auth / validate / upload)  ->  controllers  ->  services  ->  models  ->  Prisma
```

- **routes** – URLs only.
- **controllers** – read `req`, call a service, send the response. No business logic.
- **services** – the logic ported from the actions (cart totals, orders from cart, favorite toggle).
- **models** – every Prisma query lives here, so no controller touches the database directly.

## Setup

```bash
npm install
cp .env.example .env     # then set DATABASE_URL, JWT_SECRET and the ADMIN_* values
npx prisma migrate dev --name init
npm run seed             # creates the admin account
npm run dev
```

## Endpoints

| Method | Path | Auth | Ported from |
| --- | --- | --- | --- |
| POST | `/api/users/register` | – | (new, replaces Clerk) |
| POST | `/api/users/login` | – | (new, replaces Clerk) |
| GET | `/api/users/me` | user | `getAuthUser` |
| GET | `/api/categories` | – | `fetchAllCategories` |
| GET | `/api/categories/admin` | admin | `fetchAdminCategories` |
| GET | `/api/categories/:id` | – | `fetchSingleCategory` |
| POST | `/api/categories` | admin | `createCategoryAction` (multipart, field `image`) |
| PATCH | `/api/categories/:id` | admin | `updateCategoryAction` |
| PATCH | `/api/categories/:id/image` | admin | `updateCategoryImageAction` |
| DELETE | `/api/categories/:id` | admin | `deleteCategoryAction` |
| GET | `/api/products` | – | `fetchAllProducts` (`?search=&categoryId=`) |
| GET | `/api/products/featured` | – | `fetchFeaturedProducts` |
| GET | `/api/products/mine` | admin | `fetchAdminPosts` |
| GET | `/api/products/:id` | – | `fetchSingleProduct` |
| POST | `/api/products` | admin | `createProductAction` (multipart, field `image`) |
| PATCH | `/api/products/:id` | admin | `updateProductAction` |
| PATCH | `/api/products/:id/image` | admin | `updateProductImageAction` |
| DELETE | `/api/products/:id` | admin | `deleteProductAction` |
| GET | `/api/cart` | user | `fetchOrCreateCart` + `updateCart` |
| GET | `/api/cart/count` | optional | `fetchCartItems` |
| POST | `/api/cart/items` | user | `addToCartAction` |
| PATCH | `/api/cart/items/:itemId` | user | `updateCartItemAction` |
| DELETE | `/api/cart/items/:itemId` | user | `removeCartItemAction` |
| POST | `/api/orders` | user | `createOrderAction` (`{ productId }` = buy one product, empty body = checkout cart) |
| GET | `/api/orders` | user | `fetchUserOrders` |
| GET | `/api/orders/all` | admin | `fetchAdminOrders` |
| POST | `/api/reviews` | user | `creatReviewAction` |
| GET | `/api/reviews/product/:productId` | – | `fetchProductReview` |
| GET | `/api/reviews/all` | admin | `fetchAllReviews` |
| GET | `/api/favorites` | user | `fetchUserFav` |
| GET | `/api/favorites/status/:productId` | optional | `fetchFavoritID` |
| POST | `/api/favorites/toggle/:productId` | user | `toggleFavAction` |

Every response has the same shape:

```json
{ "success": true, "message": "Success", "data": {} }
```

## What changed from the Next.js version

| Next.js | Express |
| --- | --- |
| Clerk (`clerkId`, `getAuthUser`) | local `User` model + JWT, `authenticate` middleware |
| `ADMIN_USER_ID` (`getAdminUser`) | `role: ADMIN` on the user + `requireAdmin`, first admin from `npm run seed` |
| Supabase storage | `multer` to disk, served from `/uploads` |
| `revalidatePath` / `redirect` | nothing – the API just returns JSON |
| `renderError` returning `{ message }` | thrown `ApiError` handled by `error.middleware.js` |
| `validateFuctionSchema` | `validate.middleware.js` (same Zod rules) |
| product form sends the category **title** in `categoryId` | send the category **id** in `categoryId` |
| review sends `authorName` / `authorImageUrl` | read from the logged-in user |
| toggle favorite sends `FavoriteID` from the client | the server finds the favorite itself |

## Tests

```bash
npm test
```
