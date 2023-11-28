const express = require('express')
const http = require('http')
const path = require('path')
const {Pool} = require('pg')

const app = express()
const router = express.Router()

const hostname = '127.0.0.1'
const port = 3003

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'stealth',
    password:'password',
    port:5432
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))



//======================================products

// View Products
app.get('/api/products',async (req,res)=>{
    const products = await pool.query("select * from products where active is true")
    res.status(200).send(products.rows)
})
// Add Product
app.post('/api/addProduct',async(req,res)=>{
    const {product} = req.body
    try{
        const {add} = await pool.query("insert into products values (nextval('products_id_seq'),$1,$2,$3,$4,$5)",[
            product.name,
            product.price,
            product.description,
            product.stock,
            true
        ])
        res.status(201).send({message:'new Product added'})
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Sorry, Internal Error'})
    }
})
//Update Product
app.put('/api/updateProduct',async(req,res)=>{
    const {id,product} = req.body
    const update = await pool.query("update products set name=$1,price=$2,description=$3,stock=$4,active=$5 where id = $6 returning quantity",[
        product.name,
        product.price,
        product.description,
        product.stock,
        product.active,
        id
    ])
    if(update.rows[0].quantity == 0){
        const update = await pool.query("update products set active = false where id = $1",[
            id
        ])
    }
    res.status(200).send({message:'Product Updated Successfully'})
})
// Delete Product
app.delete('/api/deleteProduct',async(req,res)=>{
    const{id} = req.body
    const{delete_product} = await pool.query("update products set active = false where id = $1",[id])
    res.status(200).send({message:'Product Deleted Successfully'})
})
//======================================products

//======================================cart
// View Cart
app.post('/api/cart',async(req,res)=>{
    const {user_id} = req.body
    const cart = await pool.query("select * from cart where user_id = $1 and status = 'active'",[user_id])
    if(cart.rows.length == 0){
        response = {
            cart:{},
            details:[]
        }
    }else{
        const cart_details = await pool.query("select c.id, p.name, p.price, c.quantity from cart_details c join products p on p.id = c.product_id where cart_id = $1",[cart.rows[0].id])
        details = []
        total = 0
        for(i=0;i<cart_details.rows.length;i++){
            detail = {}
            detail.id = cart_details.rows[i].id
            detail.name = cart_details.rows[i].name
            detail.price = cart_details.rows[i].price
            detail.quantity = cart_details.rows[i].quantity
            detail.sub_total = cart_details.rows[i].price*cart_details.rows[i].quantity
            details.push(detail)
            total+=(cart_details.rows[i].price*cart_details.rows[i].quantity)
        }

        response = {
            cart:{
                id:cart.rows[0].id,
                date:cart.rows[0].date,
                user_id:cart.rows[0].user_id,
                status:cart.rows[0].status,
                total:total
            },
            details:details
        }
    }
    res.status(200).send(response)
})
//Add to Cart
app.post('/api/addToCart',async(req,res)=>{
    const{user_id,product_id,quantity} = req.body
    //check if any cart is active
    const cart = await pool.query("select id from cart where status = 'active' and user_id = $1",[user_id])
    if(cart.rows.length < 1){
        //no cart
        const createCart = await pool.query("insert into cart values (nextval('cart_id_seq'),$1,$2,$3) returning id",[
            new Date(),
            'active',
            user_id
        ])
        const {addDetail} = await pool.query("insert into cart_details values (nextval('cart_details_id_seq'),$1,$2,$3)",[
            createCart.rows[0].id,
            product_id,
            quantity
        ])
    }else{
        //yes cart
        const check_cart = await pool.query("select cd.id, cd.cart_id from cart c join cart_details cd on c.id = cd.cart_id where c.user_id = $1 and cd.product_id = $2 and status = 'active'",[
            user_id,product_id
        ])
        if(check_cart.rows.length < 1){
            //add new if no in cart
            const {addDetail} = await pool.query("insert into cart_details values (nextval('cart_details_id_seq'),$1,$2,$3)",[
                cart.rows[0].id,
                product_id,
                quantity
            ])
        }else{
            //update if yes in cart
            const {updateDetail} = await pool.query("update cart_details set quantity = quantity+$1 where id = $2",[
                quantity,
                check_cart.rows[0].id
            ])
        }
    }
    res.status(201).send({message:'Product Added to Cart'})
})
//Update Cart
app.put('/api/updateCart',async(req,res)=>{
    const {detail_id,quantity} = req.body
    if(quantity == 0){
        const {deleteCart} = await pool.query("delete from cart_details where id = $1",[
            detail_id
        ])
    }else{
        const {updateCart} = await pool.query("update cart_details set quantity = $1 where id = $2",[
            quantity,detail_id
        ])
    }
    res.status(200).send({message:'Cart Updated'})
})
//======================================cart

//======================================checkout
// Checkout
app.post('/api/checkout',async (req,res)=>{
    const {billing_info,shipping_info,id} = req.body
    try{
        const {checkout} = await pool.query("update cart set billing_info = $1, shipping_info = $2, status = 'checkedout' where id = $3",[billing_info,shipping_info,id])
    }catch(err){
        console.log(err)
        res.status(500).send({message:'This is on us'})
    }
    res.status(200).send({message:'Cart Checked Out'})
})
// View Payment
app.post('/api/viewPayment',async (req,res)=>{
    const {user_id} = req.body
    const cart = await pool.query("select * from cart where user_id = $1 and status = 'checkedout'",[user_id])
    if(cart.rows.length > 0){
        const cart_details = await pool.query("select c.id, p.name, p.price, c.quantity from cart_details c join products p on p.id = c.product_id where cart_id = $1",[cart.rows[0].id])
        details = []
        total = 0
        for(i=0;i<cart_details.rows.length;i++){
            detail = {}
            detail.id = cart_details.rows[i].id
            detail.name = cart_details.rows[i].name
            detail.price = cart_details.rows[i].price
            detail.quantity = cart_details.rows[i].quantity
            detail.sub_total = cart_details.rows[i].price*cart_details.rows[i].quantity
            details.push(detail)
            total+=(cart_details.rows[i].price*cart_details.rows[i].quantity)
        }

        response = {
            cart:{
                id:cart.rows[0].id,
                date:cart.rows[0].date,
                user_id:cart.rows[0].user_id,
                billing_info:cart.rows[0].billing_info,
                shipping_info:cart.rows[0].shipping_info,
                status:cart.rows[0].status,
                total:total
            },
            details:details
        }
    }else{
        res.status(400).send({message:'No Cart Checked Out'})
    }

    res.status(200).send(response)
})
// Payment
app.post('/api/payment',async (req,res)=>{
    const {cart_id} = req.body
    const payment = await pool.query("update cart set status = 'paid' where id = $1 returning id",[cart_id])
    if(payment.rows.length < 1){
        res.status(400).send({message:'No Pending Payment'})
    }else{
        
        const details = await pool.query("select * from cart_details where cart_id = $1",[cart_id])
        for(i=0;i<details.rows.length;i++){
            const {update_quantity} = await pool.query("update products set stock = stock-$1 where id = $2",[
                details.rows[i].quantity,
                details.rows[i].product_id
            ])
        }
        res.status(200).send({message:'Paid!'})
    }
})
//======================================checkout


app.listen(port,()=>{
    console.log('COnnecTing to P0ST HuMaN exPErience...')
})