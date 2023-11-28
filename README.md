# Another Backend Test

Stack:
node.js & PostgreSQL

How to Run?
1. Open file in terminal and run with : "npm start"

Assumptions:
1. User is pre-registered, and the id of the user is 1
2. User logged in


How to use?
## Product
### [GET] Add product ([url]/api/addProduct)
- Request: ![Screenshot from 2023-11-28 16-46-12](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/f5220cd2-21ca-4d63-9241-45249b77e3e6)
### [POST] View all products ([url]/api/products)
### [PUT] Update Products ([url]/api/updateProduct). If the stock is set to 0, the item will be inactive
- Request: ![Screenshot from 2023-11-28 16-47-36](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/d8ac79c5-5897-460a-b5e2-63136627c465)
### [DELETE] Delete Products ([url]/api/deleteProduct). Will only hide products. 
- Request: ![Screenshot from 2023-11-28 17-02-27](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/b2c9c16b-7f6e-460c-8d5b-473498f92d78)

## Cart
### [POST] View Cart ([url]/api/cart)
- Request: ![Screenshot from 2023-11-28 17-03-00](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/c9abd8a7-a0f8-4ec7-8eb2-2c5d3c0328f1)
### [POST] Add to cart ([url]/api/addToCart). If the product the user adds is already in the cart, the cart will only update the quantity.
- Request: ![Screenshot from 2023-11-28 17-03-06](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/7c65d439-bde7-4134-a26d-82ba8228fb46)
### [PUT] Update cart ([url]/api/updateCart). If the product quantity is set to 0, the product will be removed from the cart
- Request: ![Screenshot from 2023-11-28 17-03-10](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/03028ee2-e238-40c2-8439-394e85c0304b)

## Checkout
### [POST] Check out ([url]/api/checkout). Only able to check out products in the cart. This process requires billing & shipping details
- Request: ![Screenshot from 2023-11-28 17-03-14](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/f668ad73-8d1a-4341-ae76-e7bc108e6306)
### [POST] View Payment ([url]/api/viewPayment). After check out, user will need to pay, in order to pay, they need to view their payment 
- Request: ![Screenshot from 2023-11-28 17-03-23](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/102e25e3-92b3-41e5-a89c-fabeec418d17)
### [POST] Payment ([url]/api/payment). User pays and the stock of each product purchased updates.
- Request: ![Screenshot from 2023-11-28 17-03-28](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/f3b0b6d5-c562-4024-a4a4-c0488f1f04f8)






