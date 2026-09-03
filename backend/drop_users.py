import psycopg
import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgresql+psycopg://"):
    db_url = db_url.replace("postgresql+psycopg://", "postgres://")

with psycopg.connect(db_url) as conn:
    with conn.cursor() as cur:
        cur.execute("DROP TABLE IF EXISTS users CASCADE;")
        conn.commit()
print("Dropped users table.")
