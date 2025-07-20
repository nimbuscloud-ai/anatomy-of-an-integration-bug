#!/bin/bash
set -e

echo "🔧 Setting up database..."
docker-compose run --rm db-setup

echo "✅ Database setup complete!"