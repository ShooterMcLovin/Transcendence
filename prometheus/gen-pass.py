import bcrypt

password = "password123456789"  # Replace with your desired password
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(hashed.decode('utf-8'))