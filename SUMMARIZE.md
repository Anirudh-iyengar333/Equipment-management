# Lab Equipment Management System

This project helps manage lab equipment, maintenance schedules, and calibration records. It includes a web dashboard, backend server, and data storage in JSON format.

## Features
- Equipment tracking and status overview
- Maintenance scheduling and alerts
- Calibration due notifications
- File upload and asset management
- Responsive dashboard UI
- REST API backend (Node.js/Express)
- Data stored in JSON files

## Project Structure
- `public/` — Frontend files (HTML, CSS, JS)
- `server.js` — Backend server (Express)
- `data/` — Equipment and maintenance data in JSON
- `uploads/` — Uploaded files
- `package.json` — Project metadata and dependencies

## How to Run
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the server:
   ```powershell
   node server.js
   ```
3. Open `public/index.html` in your browser.

## API Endpoints
- `/api/equipment` — Get equipment list
- `/api/maintenance` — Get maintenance schedule
- `/api/upload` — Upload files

## Customization
- Edit `data/equipment.json` and `data/maintenance.json` to update equipment and schedules.
- Modify `public/style.css` for UI changes.

## License
MIT
