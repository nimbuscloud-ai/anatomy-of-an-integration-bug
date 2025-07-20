FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy service code
COPY . .

WORKDIR /app/services/analytics-service

CMD ["python3", "server.py"]