ShopNest - Full-Stack MERN E-Commerce App
A professionally engineered, full-stack E-commerce platform built strictly using modern standard React (CRA) on the frontend and Express/MongoDB on the backend.

# payments are simulated using Stripe Test Mode.

## Checkout flow

1. Send `POST /api/orders` with `{ "items": [{ "product": "<product Mongo id>", "quantity": 1 }] }` and a bearer token.
   The response contains `orderId`, `clientSecret`, and `paymentIntentId`. Use the `clientSecret` with Stripe.js to collect and confirm payment.
2. After Stripe confirms a successful payment, send `POST /api/orders/:orderId/confirm-payment` with the same bearer token.
   This verifies the payment on the server, decreases stock, and marks the order as `processing` / `paid`.

Never send a price or total from the frontend. The backend calculates the total from MongoDB product prices. `orderId` is the stable customer-facing ID; MongoDB `_id` remains the internal database ID.
