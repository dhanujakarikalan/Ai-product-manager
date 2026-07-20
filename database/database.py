import sqlite3

# Connect to SQLite database
connection = sqlite3.connect("feedback.db", check_same_thread=False)

# Create cursor
cursor = connection.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT,
    feedback TEXT
)
""")

connection.commit()