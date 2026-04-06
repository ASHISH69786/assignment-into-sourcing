#!/bin/bash

# Purchase Order System - Setup Script
# This script sets up and runs the complete system

set -e

echo "======================================"
echo "Purchase Order System - Setup Script"
echo "======================================"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 21 or higher."
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.9.0 or higher."
    exit 1
fi

echo "✅ Java and Maven are installed"

# Build backend
echo ""
echo "Building backend..."
mvn clean package -DskipTests

# Check if docker is available for PostgreSQL
if command -v docker &> /dev/null; then
    echo ""
    echo "Starting PostgreSQL container..."
    docker run --name intosourcing-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=intosourcing -p 5432:5432 -d postgres:15-alpine || true
    sleep 5
    echo "✅ PostgreSQL started"
else
    echo "⚠️  Docker not found. Make sure PostgreSQL is running on localhost:5432"
fi

# Start backend
echo ""
echo "Starting backend application..."
java -jar target/purchase-order-system-1.0.0.jar &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Install and start frontend
echo ""
echo "Setting up frontend..."
cd frontend
npm install --silent
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "======================================"
echo "System is ready!"
echo "======================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080/api"
echo "PostgreSQL: localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait

