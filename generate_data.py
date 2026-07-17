import os
import random
from datetime import datetime, timedelta
import psycopg2

DATABASE_URL = os.getenv("DATABASE_URL")
TARGET_SIZE_GB = int(os.getenv("TARGET_SIZE_GB", "10"))
DUPLICATE_PERCENT = int(os.getenv("DUPLICATE_PERCENT", "5"))
START_DATE = os.getenv("START_DATE", "2025-01-01")
END_DATE = os.getenv("END_DATE", "2025-12-31")


def connect():
    return psycopg2.connect(DATABASE_URL)


def generate_data():
    conn = connect()
    cur = conn.cursor()

    start_dt = datetime.strptime(START_DATE, "%Y-%m-%d")
    end_dt = datetime.strptime(END_DATE, "%Y-%m-%d")
    days = (end_dt - start_dt).days + 1

    customer_count = max(1, TARGET_SIZE_GB * 1000)
    product_count = max(1, TARGET_SIZE_GB * 500)
    order_count = max(1, TARGET_SIZE_GB * 2000)

    for i in range(customer_count):
        cur.execute(
            "INSERT INTO customers (first_name, last_name, email, phone, city, country, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            [
                f"Customer{i}",
                f"User{i}",
                f"customer{i}@example.com",
                f"555000{i % 1000}",
                "Chicago" if i % 2 == 0 else "Austin",
                "USA",
                start_dt + timedelta(days=i % days),
                end_dt,
            ],
        )

    for i in range(product_count):
        cur.execute(
            "INSERT INTO products (product_name, category, price, stock_quantity, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
            [f"Product {i}", "Electronics" if i % 2 == 0 else "Furniture", 10 + i, 100 + i, start_dt, end_dt],
        )

    for i in range(order_count):
        cur.execute(
            "INSERT INTO orders (customer_id, order_date, total_amount, status, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
            [(i % 10) + 1, start_dt + timedelta(days=(i % days)), 20 + i, "Completed" if i % 2 == 0 else "Pending", start_dt, end_dt],
        )

    conn.commit()
    cur.close()
    conn.close()
    print(f"Generated {customer_count} customers, {product_count} products, {order_count} orders")


if __name__ == "__main__":
    generate_data()
