import argparse
import bcrypt

parser = argparse.ArgumentParser(description="Generate a bcrypt hash of a password.")
parser.add_argument("password", type=str, help="The password to hash.")
args = parser.parse_args()
hashed_password = bcrypt.hashpw(args.password.encode("utf-8"), bcrypt.gensalt())
print(hashed_password.decode())
