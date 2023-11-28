create table products(
    id serial primary key,
    name varchar(200),
    price float,
    description text,
    stock int,
    active bool
);

create table users(
    id serial primary key,
    name varchar(200),
    username varchar(200),
    password varchar(200)
);

create table cart(
    id serial primary key,
    date date,
    status varchar(200),
    user_id int,
    billing_info varchar(200) null,
    shipping_info varchar(200) null,
    constraint fk_user_id foreign key (user_id) references users(id),
);

create table cart_details(
    id serial primary key,
    cart_id int,
    product_id int,
    quantity int,
    constraint fk_cart_id foreign key (cart_id) references cart(id),
    constraint fk_product_id foreign key (product_id) references products(id)
);

