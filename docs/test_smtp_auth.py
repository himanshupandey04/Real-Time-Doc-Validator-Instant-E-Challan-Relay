import smtplib

try:
    print("Connecting to Gmail SMTP...")
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    print("Connected. Logging in...")
    # Using the credentials from app.py
    server.login('himanshupandey0410@gmail.com', 'sybjopvlrlgnvxkj')
    print("Authentication Successful! Credentials are correct.")
    server.quit()
except Exception as e:
    print(f"Authentication Failed: {e}")
