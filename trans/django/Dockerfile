# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables to prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements.txt file into the container
COPY requirements.txt /code/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /code/

# Set the default command to run when the container starts
CMD ["gunicorn", "trans.wsgi:application", "--bind", "0.0.0.0:8000"]
