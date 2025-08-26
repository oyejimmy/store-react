@echo off
echo Starting Saiyaara Jewelry Store Applications...
echo.

echo Starting Backend (FastAPI)...
cd store-be
start "Saiyaara Backend" cmd /k "python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python seed_data_new.py && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Starting Frontend (React)...
cd ..\store-fe
start "Saiyaara Frontend" cmd /k "npm install && npm start"

echo.
echo Applications are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo API Documentation: http://localhost:8000/docs
echo.
echo Please wait for both servers to fully start before accessing the application.
echo Press any key to exit this window...
pause > nul