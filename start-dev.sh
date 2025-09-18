#!/bin/bash

echo "Starting Terra Metrics Dashboard Development Environment..."
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Start Backend
echo "Starting Backend API Server..."
cd backend
if command_exists python3; then
    python3 main.py &
elif command_exists python; then
    python main.py &
else
    echo "Python not found. Please install Python 3.11+"
    exit 1
fi

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend Development Server..."
cd ../frontend
if command_exists npm; then
    npm run dev &
elif command_exists yarn; then
    yarn dev &
else
    echo "npm or yarn not found. Please install Node.js"
    exit 1
fi

echo
echo "Development servers are starting..."
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
wait
