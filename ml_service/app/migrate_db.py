import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        print("Checking for profile_pic column...")
        try:
            c.execute("SELECT profile_pic FROM officials LIMIT 1")
            print("Column already exists.")
        except sqlite3.OperationalError:
            print("Adding profile_pic column...")
            c.execute("ALTER TABLE officials ADD COLUMN profile_pic TEXT")
            conn.commit()
            print("Column added successfully.")
        conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
