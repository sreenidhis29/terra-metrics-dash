@echo off
echo Starting Terra Metrics Dashboard Development Environment...
echo.

echo Starting Backend API Server...
start "Backend API" cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Dev" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers are starting...
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
