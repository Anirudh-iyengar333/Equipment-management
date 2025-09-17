# 🔧 Lab Equipment Management System

A complete web-based equipment tracking system for labs, workshops, and organizations.

## ✨ Features

- 📊 **Dashboard** - Overview of equipment status with charts
- 🔧 **Equipment Management** - Add, edit, delete, and track equipment
- 🛠️ **Maintenance Tracking** - Schedule and record maintenance activities
- 📋 **Reports** - Generate CSV exports and maintenance schedules
- 🔍 **Search & Filter** - Find equipment by category, status, location
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌐 **Team Access** - Share across your network for team use

## 🚀 Quick Setup

### Step 1: Download Files
Download these 4 files to a folder on your computer:
- `package.json`
- `server.js` 
- `index.html` (goes in 'public' folder)
- `style.css` (goes in 'public' folder)

### Step 2: Create Folder Structure
```
Lab-Equipment-Tracker/
├── package.json
├── server.js
└── public/
    ├── index.html
    └── style.css
```

### Step 3: Install Node.js
1. Go to https://nodejs.org
2. Download and install Node.js (LTS version)
3. Restart your computer after installation

### Step 4: Install Dependencies
1. Open terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd "path/to/Lab-Equipment-Tracker"
   ```
3. Install required packages:
   ```bash
   npm install
   ```

### Step 5: Start the Server
```bash
npm start
```

### Step 6: Open in Browser
- **Local access:** http://localhost:3000
- **Network access:** The terminal will show network URLs for team access

## 📱 How to Use

### Dashboard
- View equipment summary cards
- See category distribution chart
- Check upcoming maintenance alerts

### Equipment Management
- Click "➕ Add Equipment" to add new items
- Asset numbers are generated automatically
- Click asset numbers to view detailed information
- Use "Edit" button to modify equipment details
- Use "Delete" to remove equipment

### Maintenance
- Schedule maintenance from equipment table
- View maintenance calendar
- Track maintenance history
- Set next due dates

### Search & Filters
- Search by equipment name, asset number, or model
- Filter by category, status, or location
- Export filtered results to CSV

## 🔧 Customization

### Change Company Name
Edit `index.html` line ~18:
```html
<h2>🔧 Your Company Name</h2>
<p class="subtitle">Your Department</p>
```

### Add Equipment Categories
Edit `index.html` around line 460:
```javascript
this.categories = [
    { code: "OSC", name: "Oscilloscope" },
    // Add your categories:
    { code: "CAM", name: "Camera" },
    { code: "MOT", name: "Motor" }
];
```

### Add Locations
Edit `index.html` around line 470:
```javascript
this.locations = [
    "Test Bench 1", "Test Bench 2",
    // Add your locations:
    "Production Floor", "Quality Lab"
];
```

### Change Colors
Edit `style.css` around line 10:
```css
:root {
    --color-primary: #1FB8CD;  /* Change main color */
    --color-background: #fcfcf9;  /* Change background */
}
```

### Change Asset Number Format
Edit `server.js` around line 150:
```javascript
const assetNumber = `LAB-${year}-${categoryCode}-${count}`;
// Change to:
const assetNumber = `COMPANY-${categoryCode}-${year}-${count}`;
```

## 📊 Data Storage

All data is automatically saved to JSON files:
- `data/equipment.json` - Equipment database
- `data/maintenance.json` - Maintenance records

**Backup:** Copy the `data` folder to backup your information.

## 🌐 Team Access

After starting the server, share the network URLs with your team:
```
👥 Network access for your team:
   http://192.168.1.100:3000
   http://192.168.1.100:3000
```

Team members can access the system from their computers using these URLs.

## 🔒 Security Note

This system is designed for internal network use. For internet access, additional security measures are recommended.

## 🆘 Troubleshooting

### Server Won't Start
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try changing PORT in `server.js` to 8080

### Can't Access from Other Computers
- Check Windows Firewall settings
- Make sure all computers are on same network
- Try the IP addresses shown in terminal

### Data Loss
- Data is saved to `data/` folder
- Backup this folder regularly
- If data is lost, delete JSON files to reset with sample data

### Browser Issues
- Clear browser cache
- Try different browser
- Check browser console for errors (F12)

## 📈 Features Overview

### Equipment Management
✅ Add/Edit/Delete equipment
✅ Auto-generated asset numbers  
✅ Status tracking
✅ Maintenance scheduling
✅ Detailed equipment profiles

### Dashboard
✅ Summary statistics
✅ Equipment by category chart
✅ Status distribution chart
✅ Maintenance alerts

### Maintenance
✅ Schedule maintenance
✅ Record completed work
✅ Track technicians and costs
✅ Next due date tracking

### Reports
✅ CSV export
✅ Maintenance schedules
✅ Print-friendly format
✅ Search and filter

### Technical
✅ Responsive design
✅ Offline capability
✅ Team network access
✅ Auto-save data

## 📞 Support

If you need help:
1. Check this README file
2. Look at browser console (F12) for error messages
3. Check terminal output for server errors

## 📄 License

MIT License - Feel free to modify and use as needed.

---

**🎯 Ready to get started? Follow the Quick Setup steps above!**