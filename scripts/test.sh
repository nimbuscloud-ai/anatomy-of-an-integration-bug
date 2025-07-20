#!/bin/bash
set -e

echo "🧪 Running all tests..."
docker-compose run --rm test

echo "✅ All tests completed!"