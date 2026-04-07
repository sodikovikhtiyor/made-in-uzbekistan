FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone MiroFish repository (backend only)
RUN git clone --depth=1 https://github.com/JimMatthew/MiroFish.git /tmp/mirofish \
    && cp -r /tmp/mirofish/backend /app/backend \
    && rm -rf /tmp/mirofish

WORKDIR /app/backend

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]
