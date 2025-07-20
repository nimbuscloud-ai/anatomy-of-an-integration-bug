FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy service code
COPY . .

# Make the script executable
RUN chmod +x analytics_service.py test_analytics_service.py

CMD ["python3", "analytics_service.py"]