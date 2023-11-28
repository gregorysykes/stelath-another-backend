# Another Backend Test

Stack:
node.js & PostgreSQL

How to Run?
1. Open file in terminal and run with : "npm start"

Assumptions:
1. User is pre-registered, and the id of the user is 1
2. User logged in


How to use?
###Product
1. [GET] Add product ([url]/api/addProduct) ![Screenshot from 2023-11-28 16-46-12](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/f5220cd2-21ca-4d63-9241-45249b77e3e6)
2. [POST] View all products ([url]/api/products)
3. [PUT] Update Products ([url]/api/updateProduct). If the stock is set to 0, the item will be inactive ![Screenshot from 2023-11-28 16-47-36](https://github.com/gregorysykes/stelath-another-backend/assets/31983359/d8ac79c5-5897-460a-b5e2-63136627c465)
4. [DELETE] Delete Products ([url]/api/deleteProduct). Will only hide products. 

###Cart
1. [POST] View Cart ([url]/api/cart).1 check cart via user_id
2. [POST] Add to cart ([url]/api/addToCart). If the product the user adds is already in the cart, the cart will only update the quantity.
3. [PUT] Update cart ([url]/api/updateCart). If the product quantity is set to 0, the product will be removed from the cart


###Checkout
1. [POST] Check out ([url]/api/checkout). Only able to check out products in the cart. This process requires billing & shipping details
2. [POST] View Payment ([url]/api/viewPayment). After check out, user will need to pay, in order to pay, they need to view their payment 
3. [POST] Payment ([url]/api/payment). User pays and the stock of each product purchased updates.
