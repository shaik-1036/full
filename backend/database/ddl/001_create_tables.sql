create table if not exists customers (
    customer_id bigserial primary key,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(255),
    phone varchar(20),
    city varchar(100),
    country varchar(100),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table customers add column if not exists created_at timestamp default current_timestamp;
alter table customers add column if not exists updated_at timestamp default current_timestamp;

create table if not exists products (
    product_id bigserial primary key,
    product_name varchar(255),
    category varchar(100),
    price numeric(10,2),
    stock_quantity integer,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table products add column if not exists created_at timestamp default current_timestamp;
alter table products add column if not exists updated_at timestamp default current_timestamp;

create table if not exists orders (
    order_id bigserial primary key,
    customer_id bigint,
    order_date timestamp,
    total_amount numeric(12,2),
    status varchar(50),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table orders add column if not exists created_at timestamp default current_timestamp;
alter table orders add column if not exists updated_at timestamp default current_timestamp;

create table if not exists order_items (
    order_item_id bigserial primary key,
    order_id bigint,
    product_id bigint,
    quantity integer,
    unit_price numeric(10,2)
);

create table if not exists payments (
    payment_id bigserial primary key,
    order_id bigint,
    payment_method varchar(50),
    payment_status varchar(50),
    payment_amount numeric(10,2),
    payment_date timestamp,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table payments add column if not exists created_at timestamp default current_timestamp;
alter table payments add column if not exists updated_at timestamp default current_timestamp;

create table if not exists suppliers (
    supplier_id bigserial primary key,
    supplier_name varchar(255),
    contact_name varchar(255),
    email varchar(255),
    phone varchar(20),
    city varchar(100),
    country varchar(100),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table suppliers add column if not exists created_at timestamp default current_timestamp;
alter table suppliers add column if not exists updated_at timestamp default current_timestamp;

create table if not exists warehouses (
    warehouse_id bigserial primary key,
    warehouse_name varchar(255),
    city varchar(100),
    country varchar(100),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table warehouses add column if not exists created_at timestamp default current_timestamp;
alter table warehouses add column if not exists updated_at timestamp default current_timestamp;

create table if not exists inventory (
    inventory_id bigserial primary key,
    product_id bigint,
    warehouse_id bigint,
    stock_quantity integer,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table inventory add column if not exists created_at timestamp default current_timestamp;
alter table inventory add column if not exists updated_at timestamp default current_timestamp;

create table if not exists shipments (
    shipment_id bigserial primary key,
    order_id bigint,
    warehouse_id bigint,
    status varchar(50),
    shipped_at timestamp,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table shipments add column if not exists created_at timestamp default current_timestamp;
alter table shipments add column if not exists updated_at timestamp default current_timestamp;

create table if not exists returns (
    return_id bigserial primary key,
    order_id bigint,
    reason varchar(255),
    status varchar(50),
    return_date timestamp,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

alter table returns add column if not exists created_at timestamp default current_timestamp;
alter table returns add column if not exists updated_at timestamp default current_timestamp;

create table if not exists users (
    user_id bigserial primary key,
    username varchar(100) unique,
    email varchar(255) unique,
    password_hash text,
    role varchar(50),
    created_at timestamp default current_timestamp
);

create table if not exists api_request_logs (
    log_id bigserial primary key,
    endpoint varchar(255),
    response_time integer,
    status_code integer,
    request_time timestamp default current_timestamp
);

insert into customers (first_name, last_name, email, phone, city, country)
values
    ('John', 'Doe', 'john@test.com', '9999999991', 'New York', 'USA'),
    ('Mike', 'Smith', 'mike@test.com', '9999999992', 'Chicago', 'USA'),
    ('Sara', 'Wilson', 'sara@test.com', '9999999993', 'Dallas', 'USA'),
    ('David', 'Miller', 'david@test.com', '9999999994', 'Boston', 'USA'),
    ('Emma', 'Brown', 'emma@test.com', '9999999995', 'Seattle', 'USA')
on conflict do nothing;

insert into products (product_name, category, price, stock_quantity)
values
    ('Laptop', 'Electronics', 1200, 50),
    ('Mouse', 'Electronics', 20, 500),
    ('Keyboard', 'Electronics', 45, 300),
    ('Monitor', 'Electronics', 250, 100),
    ('Desk', 'Furniture', 150, 80)
on conflict do nothing;

insert into orders (customer_id, order_date, total_amount, status)
values
    (1, now(), 1200, 'Completed'),
    (2, now(), 45, 'Completed'),
    (3, now(), 250, 'Pending'),
    (1, now(), 20, 'Completed'),
    (2, now(), 150, 'Cancelled')
on conflict do nothing;

insert into order_items (order_id, product_id, quantity, unit_price)
values
    (1, 1, 1, 1200),
    (2, 2, 2, 20),
    (3, 4, 1, 250),
    (4, 2, 1, 20),
    (5, 5, 1, 150)
on conflict do nothing;

insert into payments (order_id, payment_method, payment_status, payment_amount, payment_date)
values
    (1, 'Card', 'Completed', 1200, now()),
    (2, 'Cash', 'Completed', 40, now()),
    (3, 'Card', 'Pending', 250, now())
on conflict do nothing;

insert into suppliers (supplier_name, contact_name, email, phone, city, country)
values
    ('Northwind Supplies', 'Alice Johnson', 'alice@northwind.com', '5550101', 'Chicago', 'USA'),
    ('Global Goods', 'Brian Lee', 'brian@globalgoods.com', '5550102', 'Austin', 'USA')
on conflict do nothing;

insert into warehouses (warehouse_name, city, country)
values
    ('Main Warehouse', 'Chicago', 'USA'),
    ('West Hub', 'Denver', 'USA')
on conflict do nothing;

insert into inventory (product_id, warehouse_id, stock_quantity)
values
    (1, 1, 25),
    (2, 1, 100),
    (3, 2, 50)
on conflict do nothing;

insert into shipments (order_id, warehouse_id, status, shipped_at)
values
    (1, 1, 'Shipped', now()),
    (2, 2, 'Pending', now())
on conflict do nothing;

insert into returns (order_id, reason, status, return_date)
values
    (2, 'Damaged item', 'Requested', now())
on conflict do nothing;
