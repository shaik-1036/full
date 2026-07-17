
create table if not exists customers(
 customer_id bigserial primary key,
 first_name varchar(100),
 email varchar(255),
 created_at timestamp default now()
);
create table if not exists products(
 product_id bigserial primary key,
 product_name varchar(255),
 price numeric(10,2)
);
create table if not exists orders(
 order_id bigserial primary key,
 customer_id bigint,
 amount numeric(10,2),
 created_at timestamp default now()
);
