#!/bin/bash
set -e

echo "🧹 Cleaning up Docker containers and volumes..."
docker-compose down -v
docker-compose rm -f

echo "✅ Cleanup complete!"