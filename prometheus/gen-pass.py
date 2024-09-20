import os
import bcrypt

# Get the password from an environment variable
password = os.getenv('PROMETHEUS_PASSWORD')  # Make sure to set this in your environment

if not password:
    raise ValueError("Please set the PROMETHEUS_PASSWORD environment variable.")

# Hash the password
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())