#!/bin/bash

echo "Starting Saiyaara Jewelry Store Applications..."
echo

echo "Starting Backend (FastAPI)..."
cd store-be
gnome-terminal --title="Saiyaara Backend" -- bash -c "python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000; exec bash" &

echo
echo "Starting Frontend (React)..."
cd ../store-fe
gnome-terminal --title="Saiyaara Frontend" -- bash -c "npm install && npm start; exec bash" &

echo
echo "Applications are starting..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:3000"
echo "API Documentation: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop all applications"
wait
