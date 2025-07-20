#!/bin/bash
set -e

echo "🚗 Starting Break It Yourself Demo"
echo "==================================="
echo ""
echo "This will start all three services and show their logs:"
echo "- 🚗 Rider-Fares-Service (Node.js) - creates fares every 5s"
echo "- 📊 Analytics-Service (Python) - calculates totals every 10s" 
echo "- 💸 Payouts-Service (Node.js) - calculates bonuses every 15s"
echo ""
echo "Watch the logs to see integration behavior..."
echo "Press Ctrl+C to stop all services"
echo ""

docker-compose --profile demo up --remove-orphans --renew-anon-volumes --force-recreate