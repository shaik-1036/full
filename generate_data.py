import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / "backend" / ".env"

if ENV_PATH.exists():
    for line in ENV_PATH.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())

DATABASE_URL = os.getenv("DATABASE_URL")
RETENTION_DAYS = int(os.getenv("DATA_RETENTION_DAYS", "4"))
TARGET_SIZE_GB = int(os.getenv("TARGET_SIZE_GB", "10"))
DUPLICATE_PERCENT = int(os.getenv("DUPLICATE_PERCENT", "5"))
START_DATE = os.getenv("START_DATE", "2025-01-01")
END_DATE = os.getenv("END_DATE", "2025-12-31")


def connect():
    return psycopg2.connect(DATABASE_URL)


def ensure_columns(conn):
    with conn.cursor() as cur:
        for table, column in [
            ("customers", "created_at"),
            ("customers", "updated_at"),
            ("products", "created_at"),
            ("products", "updated_at"),
            ("orders", "created_at"),
            ("orders", "updated_at"),
            ("payments", "created_at"),
            ("payments", "updated_at"),
            ("suppliers", "created_at"),
            ("suppliers", "updated_at"),
            ("warehouses", "created_at"),
            ("warehouses", "updated_at"),
            ("inventory", "created_at"),
            ("inventory", "updated_at"),
            ("shipments", "created_at"),
            ("shipments", "updated_at"),
            ("returns", "created_at"),
            ("returns", "updated_at"),
        ]:
            cur.execute(
                "SELECT 1 FROM information_schema.columns WHERE table_name = %s AND column_name = %s",
                (table, column),
            )
            if cur.fetchone() is None:
                cur.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column} TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    conn.commit()


def cleanup_old_data(conn):
    cutoff = datetime.now() - timedelta(days=RETENTION_DAYS)
    with conn.cursor() as cur:
        for table in ["returns", "shipments", "inventory", "warehouses", "suppliers", "payments"]:
            cur.execute(f"DELETE FROM {table} WHERE created_at < %s", (cutoff,))
        cur.execute("DELETE FROM order_items WHERE order_id IN (SELECT order_id FROM orders WHERE created_at < %s)", (cutoff,))
        cur.execute("DELETE FROM orders WHERE created_at < %s", (cutoff,))
        cur.execute("DELETE FROM products WHERE created_at < %s", (cutoff,))
        cur.execute("DELETE FROM customers WHERE created_at < %s", (cutoff,))
    conn.commit()


def get_seed_statements():
    return [
        (
            "INSERT INTO suppliers (supplier_name, contact_name, email, phone, city, country, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())",
            ("Northwind Supplies", "Alice Johnson", "alice@northwind.com", "5550101", "Chicago", "USA"),
        ),
        (
            "INSERT INTO warehouses (warehouse_name, city, country, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
            ("Main Warehouse", "Chicago", "USA"),
        ),
        (
            "INSERT INTO inventory (product_id, warehouse_id, stock_quantity, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
            (1, 1, 25),
        ),
        (
            "INSERT INTO shipments (order_id, warehouse_id, status, shipped_at, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW(), NOW())",
            (1, 1, "Shipped"),
        ),
        (
            "INSERT INTO returns (order_id, reason, status, return_date, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW(), NOW())",
            (1, "Damaged item", "Requested"),
        ),
    ]


def insert_rows(cur, table, columns, rows):
    if not rows:
        return
    placeholders = ", ".join(["%s"] * len(columns))
    query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES %s"
    execute_values(cur, query, rows, template=f"({placeholders})")


def generate_data():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is required")

    conn = connect()
    ensure_columns(conn)
    cleanup_old_data(conn)

    with conn.cursor() as cur:
        start_dt = datetime.strptime(START_DATE, "%Y-%m-%d")
        end_dt = datetime.strptime(END_DATE, "%Y-%m-%d")
        days = (end_dt - start_dt).days + 1

        customer_count = max(1, min(400, TARGET_SIZE_GB * 300))
        product_count = max(1, min(200, TARGET_SIZE_GB * 150))
        order_count = max(1, min(600, TARGET_SIZE_GB * 400))
        payment_count = max(1, min(300, TARGET_SIZE_GB * 200))

        customer_rows = []
        for i in range(customer_count):
            customer_rows.append(
                (
                    f"Customer{i}",
                    f"User{i}",
                    f"customer{i}@example.com",
                    f"555000{i % 1000}",
                    "Chicago" if i % 2 == 0 else "Austin",
                    "USA",
                    start_dt + timedelta(days=i % days),
                    end_dt,
                )
            )
        insert_rows(cur, "customers", ["first_name", "last_name", "email", "phone", "city", "country", "created_at", "updated_at"], customer_rows)

        product_rows = []
        for i in range(product_count):
            product_rows.append(
                (f"Product {i}", "Electronics" if i % 2 == 0 else "Furniture", 10 + i, 100 + i, start_dt, end_dt)
            )
        insert_rows(cur, "products", ["product_name", "category", "price", "stock_quantity", "created_at", "updated_at"], product_rows)

        order_rows = []
        for i in range(order_count):
            order_rows.append(
                ((i % 10) + 1, start_dt + timedelta(days=(i % days)), 20 + i, "Completed" if i % 2 == 0 else "Pending", start_dt, end_dt)
            )
        insert_rows(cur, "orders", ["customer_id", "order_date", "total_amount", "status", "created_at", "updated_at"], order_rows)

        order_item_rows = []
        for i in range(max(1, int(order_count * 0.75))):
            order_item_rows.append((i + 1, (i % product_count) + 1, 1 + (i % 3), 10 + i))
        insert_rows(cur, "order_items", ["order_id", "product_id", "quantity", "unit_price"], order_item_rows)

        payment_rows = []
        for i in range(payment_count):
            payment_rows.append(
                (i + 1, "Card" if i % 2 == 0 else "Cash", "Completed" if i % 2 == 0 else "Pending", 20 + i, start_dt + timedelta(days=i % days), start_dt, end_dt)
            )
        insert_rows(cur, "payments", ["order_id", "payment_method", "payment_status", "payment_amount", "payment_date", "created_at", "updated_at"], payment_rows)

        for statement, params in get_seed_statements():
            cur.execute(statement, params)

    conn.commit()
    conn.close()
    print(f"Generated {customer_count} customers, {product_count} products, {order_count} orders")


if __name__ == "__main__":
    generate_data()
