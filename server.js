// =============================================================================
// LAB EQUIPMENT MANAGEMENT SYSTEM
// =============================================================================

// Import the Express web framework for building the server and handling routes.
const express = require('express'); // Express framework

// Import Node's file system module for reading/writing files and directories.
const fs = require('fs'); // File system operations

// Import Node's path module to build OS-safe file paths.
const path = require('path'); // Path utilities

// Import CORS middleware to allow requests from web pages served on other origins.
const cors = require('cors'); // Cross-Origin Resource Sharing

// Import Multer for handling multipart/form-data (file uploads).
const multer = require('multer'); // Middleware for file uploads

// Create an Express application instance.
const app = express(); // Create Express app

// The port number where the server will listen.
const PORT = 3000; // Server port

// --------------------------- Server setup -------------------------------------

// Enable CORS for all routes (so a browser client can call these APIs).
app.use(cors()); // Enable CORS

// Enable JSON body parsing for incoming requests (e.g., POST/PUT with JSON).
app.use(express.json()); // Parse JSON bodies

// Serve static files from the "public" folder (e.g., index.html, CSS, JS).
app.use(express.static('public')); // Serve static files

// --------------------------- Data storage paths -------------------------------
// Absolute path to a "data" directory next to this file.
const dataDir = path.join(__dirname, 'data'); // Data directory path

// Absolute path to an "uploads" directory for uploaded files.
const uploadsDir = path.join(__dirname, 'uploads'); // Uploads directory path

// JSON file that stores equipment list.
const equipmentFile = path.join(dataDir, 'equipment.json'); // Equipment data file

// JSON file that stores maintenance records.
const maintenanceFile = path.join(dataDir, 'maintenance.json'); // Maintenance data file

// --------------------------- Ensure folders exist -----------------------------

// Ensure required directories exist, create if missing.
[ dataDir, uploadsDir ].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create directory
  }
});

// --------------------------- File upload config -------------------------------

// Configure Multer storage for uploaded files.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Upload destination
  },
  filename: function (req, file, cb) {
    // Get asset number and date from request body
    const assetNumber = req.body.equipment_asset || 'unknown-asset';
    const date = req.body.date || new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const ext = path.extname(file.originalname); // File extension
    // Build filename: <assetNumber>-<date>-maintenance-file<ext>
    const safeAsset = assetNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeDate = date.replace(/[^0-9-]/g, '_');
    cb(null, `${safeAsset}-${safeDate}-maintenance-file${ext}`);
  }
});

// File filter for Multer: only allow certain MIME types.
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg', 'image/jpg', 'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false); // Reject file
  }
};

// Multer middleware for file uploads (storage, filter, limits).
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max file size
  }
});

// --------------------------- Initialize sample data ---------------------------

// Initialize sample data files if missing.
function initializeDataFiles() {
  if (!fs.existsSync(equipmentFile)) {
    const sampleEquipment = [
      {
        asset_number: "LAB-2025-OSC-001",
        name: "Digital Oscilloscope",
        model: "DS1054Z",
        serial_number: "DS1ZA123456789",
        manufacturer: "Rigol",
        category: "Oscilloscope",
        location: "Test Bench 1",
        purchase_date: "2024-06-15",
        warranty_expiry: "2027-06-15",
        cost: 2500,
        status: "Operational",
        last_maintenance: "2024-12-01",
        next_maintenance: "2025-06-01"
      },
      {
        asset_number: "LAB-2025-DMM-001",
        name: "Digital Multimeter",
        model: "34465A",
        serial_number: "MY54123456",
        manufacturer: "Keysight",
        category: "Multimeter",
        location: "Test Bench 2",
        purchase_date: "2024-03-10",
        warranty_expiry: "2027-03-10",
        cost: 1800,
        status: "Calibration Due",
        last_maintenance: "2024-09-10",
        next_maintenance: "2025-03-10"
      },
      {
        asset_number: "LAB-2025-PSU-001",
        name: "Power Supply",
        model: "E3634A",
        serial_number: "US44123456",
        manufacturer: "Keysight",
        category: "Power Supply",
        location: "Test Bench 1",
        purchase_date: "2024-01-20",
        warranty_expiry: "2027-01-20",
        cost: 3200,
        status: "Operational",
        last_maintenance: "2024-11-15",
        next_maintenance: "2025-05-15"
      }
    ];
    fs.writeFileSync(equipmentFile, JSON.stringify(sampleEquipment, null, 2)); // Write sample equipment data
    console.log('✅ Created sample equipment data'); // Log creation
  }

  if (!fs.existsSync(maintenanceFile)) {
    const sampleMaintenance = [
      {
        id: 1001,
        equipment_asset: "LAB-2025-OSC-001",
        type: "Calibration",
        date: "2024-12-01",
        description: "Annual calibration performed. All channels within specifications.",
        technician: "John Smith",
        cost: 150,
        next_due: "2025-06-01",
        equipment_status: "Operational",
        files: [],
        created_at: "2024-12-01T10:00:00.000Z"
      }
    ];
    fs.writeFileSync(maintenanceFile, JSON.stringify(sampleMaintenance, null, 2)); // Write sample maintenance data
    console.log('✅ Created sample maintenance data'); // Log creation
  }
}
// ...existing code...

// --------------------------- Helpers for JSON DB ------------------------------

// Read and parse equipment.json; return [] on error.
function readEquipmentData() {
  try {
    const data = fs.readFileSync(equipmentFile, 'utf8'); // Read file contents
    return JSON.parse(data); // Convert JSON string to JS array
  } catch (error) {
    console.error('Error reading equipment data:', error); // Log issue
    return []; // Fallback to empty list
  }
}

// Write equipment array back to equipment.json; return true/false for success.
// Write equipment array back to equipment.json; returns true if successful, false otherwise.
function writeEquipmentData(data) {
  try {
    fs.writeFileSync(equipmentFile, JSON.stringify(data, null, 2)); // Write to file
    return true; // Success
  } catch (error) {
    console.error('Error writing equipment data:', error); // Log error
    return false; // Failure
  }
}

// Read and parse maintenance.json; return [] on error.
function readMaintenanceData() {
  try {
    const data = fs.readFileSync(maintenanceFile, 'utf8'); // Read file
    return JSON.parse(data); // Parse
  } catch (error) {
    console.error('Error reading maintenance data:', error); // Log issue
    return []; // Fallback
  }
}

// Write maintenance array back to maintenance.json; return true/false for success.
// Write maintenance array back to maintenance.json; returns true if successful, false otherwise.
function writeMaintenanceData(data) {
  try {
    fs.writeFileSync(maintenanceFile, JSON.stringify(data, null, 2)); // Write to file
    return true; // Success
  } catch (error) {
    console.error('Error writing maintenance data:', error); // Log error
    return false; // Failure
  }
}

// Generate a unique maintenance record ID by taking max existing ID + 1.
// Generate a unique maintenance record ID by incrementing the max existing ID.
function generateMaintenanceId() {
  const maintenance = readMaintenanceData(); // Get current records
  const maxId = maintenance.length > 0
    ? Math.max(...maintenance.map(m => m.id || 0)) // Find max ID
    : 1000; // Start at 1001 if no records exist
  return maxId + 1; // Return next available ID
}

// --------------------------- API ROUTES ---------------------------------------

// GET /api/equipment -> return all equipment.
app.get('/api/equipment', (req, res) => {
  console.log('📊 Loading equipment data'); // Debug log
  const equipment = readEquipmentData(); // Read from JSON DB
  const today = new Date();
  let updated = false;
  equipment.forEach(eq => {
    if (eq.next_maintenance && eq.status === 'Operational') {
      const nextDate = new Date(eq.next_maintenance);
      const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 30) {
        eq.status = 'Maintenance Required';
        eq.updated_at = new Date().toISOString();
        updated = true;
      }
    }
  });
  if (updated) {
    writeEquipmentData(equipment); // Persist status changes
  }
  res.json(equipment); // Send array to client
});

// POST /api/equipment -> add a new equipment item.
app.post('/api/equipment', (req, res) => {
  console.log('➕ Adding new equipment:', req.body.name); // Debug log
  const equipment = readEquipmentData(); // Current list
  const newEquipment = {
    ...req.body, // Copy fields from request body
    next_maintenance: req.body.next_maintenance || '', // Allow user to input next maintenance date
    created_at: new Date().toISOString() // Add timestamp
  };
  equipment.push(newEquipment); // Append
  if (writeEquipmentData(equipment)) { // Persist
    res.json(newEquipment); // Respond with created object
  } else {
    res.status(500).json({ error: 'Failed to save equipment' }); // Error response
  }
});

// PUT /api/equipment/:assetNumber -> update one equipment by asset number.
app.put('/api/equipment/:assetNumber', (req, res) => {
  const assetNumber = decodeURIComponent(req.params.assetNumber); // Decode URL
  console.log('🔄 Updating equipment:', assetNumber); // Debug
  const equipment = readEquipmentData(); // Get all
  const index = equipment.findIndex(eq => eq.asset_number === assetNumber); // Locate item
  if (index !== -1) { // Found
    equipment[index] = {
      ...equipment[index], // Existing fields
      ...req.body,         // Overwrite with new values
      updated_at: new Date().toISOString() // Timestamp
    };
    if (writeEquipmentData(equipment)) {
      res.json(equipment[index]); // Return updated
    } else {
      res.status(500).json({ error: 'Failed to update equipment' }); // Fail
    }
  } else {
    res.status(404).json({ error: 'Equipment not found' }); // Not found
  }
});

// DELETE /api/equipment/:assetNumber -> delete equipment and related maintenance/files.
app.delete('/api/equipment/:assetNumber', (req, res) => {
  const assetNumber = decodeURIComponent(req.params.assetNumber); // Decode param
  console.log('🗑️ Deleting equipment:', assetNumber); // Debug
  const equipment = readEquipmentData(); // Current list
  const filteredEquipment = equipment.filter(eq => eq.asset_number !== assetNumber); // Remove one
  if (filteredEquipment.length < equipment.length) { // If deletion happened
    // Also delete related maintenance records (and any files those records referenced).
    const maintenance = readMaintenanceData(); // Get all maintenance
    const equipmentMaintenance = maintenance.filter(m => m.equipment_asset === assetNumber); // Records for this asset

    // Delete each file listed on those maintenance records from disk.
    equipmentMaintenance.forEach(record => {
      if (record.files && record.files.length > 0) {
        record.files.forEach(file => {
          const filePath = path.join(uploadsDir, file.filename); // Absolute path
          if (fs.existsSync(filePath)) { // If file exists
            fs.unlinkSync(filePath);     // Delete the file
            console.log(`🗑️ Deleted file: ${file.filename}`); // Log
          }
        });
      }
    });

    // Remove those maintenance records from the maintenance DB.
    const filteredMaintenance = maintenance.filter(m => m.equipment_asset !== assetNumber);
    writeMaintenanceData(filteredMaintenance); // Persist

    // Persist the equipment deletion.
    if (writeEquipmentData(filteredEquipment)) {
      res.json({ success: true, message: 'Equipment and associated data deleted' }); // OK
    } else {
      res.status(500).json({ error: 'Failed to delete equipment' }); // Fail
    }
  } else {
    res.status(404).json({ error: 'Equipment not found' }); // Not found
  }
});

// GET /api/maintenance -> return all maintenance records.
app.get('/api/maintenance', (req, res) => {
  console.log('🛠️ Loading maintenance data'); // Debug
  const maintenance = readMaintenanceData(); // Read from JSON DB
  res.json(maintenance); // Send array
});

// POST /api/maintenance -> add maintenance; accepts up to 10 uploaded files under "files".
app.post('/api/maintenance', upload.array('files', 10), (req, res) => {
  console.log('🛠️ Adding maintenance record for:', req.body.equipment_asset); // Debug
  console.log('📎 Files uploaded:', req.files ? req.files.length : 0); // How many files

  const maintenance = readMaintenanceData(); // Current list

  // Build an array of file metadata for any uploaded files, filtering out duplicates by filename.
  let fileData = req.files
    ? req.files.map(file => ({
        filename: file.filename,       // Saved name on disk
        originalname: file.originalname, // Original name from user
        mimetype: file.mimetype,       // MIME type
        size: file.size,               // Bytes
        path: file.path                // Absolute path
      }))
    : [];
  // Remove duplicate files by filename
  fileData = fileData.filter((file, idx, arr) => arr.findIndex(f => f.filename === file.filename) === idx);

  // Construct the new maintenance record.
  const newMaintenance = {
    id: generateMaintenanceId(),               // Unique ID
    equipment_asset: req.body.equipment_asset, // Which equipment this is for
    type: req.body.type,                       // Calibration / Repair etc.
    date: req.body.date,                       // Date performed
    description: req.body.description,         // Notes/summary
    technician: req.body.technician || '',     // Optional
    cost: parseFloat(req.body.cost) || 0,      // Optional numeric
    next_due: req.body.next_due || '',         // Optional next date
    equipment_status: req.body.equipment_status || '', // Optional new status
    files: fileData,                           // Uploaded files (if any)
    created_at: new Date().toISOString()       // Timestamp
  };

  maintenance.push(newMaintenance); // Add to array

  // Also update the related equipment's last/next maintenance and status.
  const equipment = readEquipmentData(); // Load equipment list
  const equipmentIndex = equipment.findIndex(eq => eq.asset_number === req.body.equipment_asset); // Find equipment
  if (equipmentIndex !== -1) { // If found
    equipment[equipmentIndex].last_maintenance = req.body.date; // Update last maintenance
    if (req.body.next_due) {
      equipment[equipmentIndex].next_maintenance = req.body.next_due; // Update next due
    }
    if (req.body.equipment_status && req.body.equipment_status.trim() !== '') {
      const oldStatus = equipment[equipmentIndex].status;               // Remember old status
      equipment[equipmentIndex].status = req.body.equipment_status;     // Set new status
      console.log(`📊 Status updated from "${oldStatus}" to "${req.body.equipment_status}"`); // Log change
    }
    equipment[equipmentIndex].updated_at = new Date().toISOString(); // Timestamp
    writeEquipmentData(equipment); // Persist equipment updates
  }

  // Persist maintenance record to disk and respond.
  if (writeMaintenanceData(maintenance)) {
    console.log(`✅ Maintenance record #${newMaintenance.id} added with ${fileData.length} files`); // Log success
    res.json(newMaintenance); // Send created record back
  } else {
    res.status(500).json({ error: 'Failed to save maintenance record' }); // Error
  }
});

// PUT /api/maintenance/:id -> update maintenance record; can upload more files.
app.put('/api/maintenance/:id', upload.array('files', 10), (req, res) => {
  const maintenanceId = parseInt(req.params.id); // Record ID from URL
  console.log('🔄 Updating maintenance record:', maintenanceId); // Debug

  const maintenance = readMaintenanceData(); // Current records
  const index = maintenance.findIndex(m => m.id === maintenanceId); // Locate record
  if (index === -1) {
    return res.status(404).json({ error: 'Maintenance record not found' }); // Not found
  }

  // Convert any newly uploaded files to metadata objects.
  const newFileData = req.files
    ? req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }))
    : [];

  // Keep previous files and append any new ones.
  const existingFiles = maintenance[index].files || []; // Old files (if any)
  const allFiles = [...existingFiles, ...newFileData];  // Combined list

  // Update the maintenance record fields.
  maintenance[index] = {
    ...maintenance[index],                     // Preserve unchanged fields
    equipment_asset: req.body.equipment_asset, // Update fields from body
    type: req.body.type,
    date: req.body.date,
    description: req.body.description,
    technician: req.body.technician || '',
    cost: parseFloat(req.body.cost) || 0,
    next_due: req.body.next_due || '',
    equipment_status: req.body.equipment_status || '',
    files: allFiles,                           // Updated file list
    updated_at: new Date().toISOString()       // Timestamp
  };

  // Optionally update the related equipment summary if equipment/date/status changed.
  const equipment = readEquipmentData(); // Load equipment list
  const equipmentIndex = equipment.findIndex(eq => eq.asset_number === req.body.equipment_asset);
  if (equipmentIndex !== -1) {
    equipment[equipmentIndex].last_maintenance = req.body.date; // Update last date
    if (req.body.next_due) {
      equipment[equipmentIndex].next_maintenance = req.body.next_due; // Update next due
    }
    if (req.body.equipment_status && req.body.equipment_status.trim() !== '') {
      equipment[equipmentIndex].status = req.body.equipment_status; // Apply new status
    }
    equipment[equipmentIndex].updated_at = new Date().toISOString(); // Timestamp
    writeEquipmentData(equipment); // Persist equipment updates
  }

  // Save maintenance updates and respond.
  if (writeMaintenanceData(maintenance)) {
    console.log(`✅ Maintenance record #${maintenanceId} updated`); // Log
    res.json(maintenance[index]); // Return updated record
  } else {
    res.status(500).json({ error: 'Failed to update maintenance record' }); // Fail
  }
});

// DELETE /api/maintenance/:id -> delete a maintenance record (and its files).
app.delete('/api/maintenance/:id', (req, res) => {
  const maintenanceId = parseInt(req.params.id); // Numeric ID
  console.log('🗑️ Deleting maintenance record:', maintenanceId); // Debug

  const maintenance = readMaintenanceData(); // Load all
  const recordIndex = maintenance.findIndex(m => m.id === maintenanceId); // Find one
  if (recordIndex === -1) {
    return res.status(404).json({ error: 'Maintenance record not found' }); // Not found
  }

  const record = maintenance[recordIndex]; // The record we're deleting

  // If this record had file attachments, remove each from disk.
  if (record.files && record.files.length > 0) {
    record.files.forEach(file => {
      const filePath = path.join(uploadsDir, file.filename); // Absolute path
      if (fs.existsSync(filePath)) { // If found on disk
        fs.unlinkSync(filePath);     // Delete the file
        console.log(`🗑️ Deleted file: ${file.filename}`); // Log
      }
    });
  }

  // Remove the record from the array.
  maintenance.splice(recordIndex, 1); // Delete it

  // Persist the updated maintenance array.
  if (writeMaintenanceData(maintenance)) {
    console.log(`✅ Maintenance record #${maintenanceId} deleted`); // Log success
    res.json({ success: true, message: 'Maintenance record deleted' }); // Respond
  } else {
    res.status(500).json({ error: 'Failed to delete maintenance record' }); // Fail
  }
});

// GET /api/maintenance/files/:filename -> stream a specific uploaded file back.
app.get('/api/maintenance/files/:filename', (req, res) => {
  const filename = req.params.filename;                 // Name from URL
  const filePath = path.join(uploadsDir, filename);     // Absolute path
  if (fs.existsSync(filePath)) {                        // Exists?
    res.sendFile(filePath);                             // Send file
  } else {
    res.status(404).json({ error: 'File not found' });  // Not found
  }
});

// DELETE /api/maintenance/files/:filename -> delete one uploaded file.
app.delete('/api/maintenance/files/:filename', (req, res) => {
  const filename = req.params.filename;               // File to delete
  const filePath = path.join(uploadsDir, filename);   // Absolute path
  console.log('🗑️ Deleting file:', filename);        // Debug

  // Delete the actual file if it exists.
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Remove from disk
  }

  // Remove any references to this file from maintenance records.
  const maintenance = readMaintenanceData(); // Load maintenance DB
  let updated = false;                        // Track if anything changed
  maintenance.forEach(record => {
    if (record.files && record.files.length > 0) {
      const originalLength = record.files.length;                   // Before
      record.files = record.files.filter(file => file.filename !== filename); // Filter out this file
      if (record.files.length < originalLength) {
        updated = true; // We removed at least one occurrence
      }
    }
  });

  // Persist changes only if we removed some references.
  if (updated) {
    writeMaintenanceData(maintenance); // Save DB
  }

  res.json({ success: true, message: 'File deleted' }); // Respond OK
});

// POST /api/generate-asset-number -> create a new asset number based on category and year.
app.post('/api/generate-asset-number', (req, res) => {
  const { category } = req.body; // The category name (e.g., "Oscilloscope")
  console.log('🏷️ Generating asset number for:', category); // Debug

  const equipment = readEquipmentData(); // Get current equipment

  // Map a human category to a short code.
  const categoryMap = {
    "Oscilloscope": "OSC",
    "Multimeter": "DMM",
    "Power Supply": "PSU",
    "Generator": "GEN",
    "Analyzer": "ANA",
    "Computer": "CPU",
    "Mechanical": "MEC",
    "Other": "OTH"
  };

  const year = new Date().getFullYear(); // Current year (e.g., 2025)
  const categoryCode = categoryMap[category] || "OTH"; // Fallback to OTH

  // Count current items in the same category and add 1 for next index.
  const categoryCount = equipment.filter(eq => eq.category === category).length + 1;

  // Build something like "LAB-2025-OSC-003".
  const assetNumber = `LAB-${year}-${categoryCode}-${categoryCount.toString().padStart(3, '0')}`;

  // Return the generated ID.
  res.json({ asset_number: assetNumber });
});

// GET /api/server-info -> report server port, local network addresses, and status.
app.get('/api/server-info', (req, res) => {
  const networkInterfaces = require('os').networkInterfaces(); // OS networking info
  const addresses = []; // To collect IPv4 addresses
  for (const name of Object.keys(networkInterfaces)) { // Each interface (WiFi, Ethernet, etc.)
    for (const net of networkInterfaces[name]) {       // Each address on interface
      if (net.family === 'IPv4' && !net.internal) {    // Only external IPv4
        addresses.push(net.address);                   // Save address (e.g., 192.168.1.10)
      }
    }
  }
  res.json({
    port: PORT,         // Server port
    addresses: addresses, // All accessible IPv4 addresses
    status: 'online'    // Simple status flag
  });
});

// --------------------------- Debug endpoints ----------------------------------

// GET /api/debug/equipment-status -> quick summary of each equipment's status.
app.get('/api/debug/equipment-status', (req, res) => {
  const equipment = readEquipmentData(); // Load DB
  const statusSummary = equipment.map(eq => ({
    asset_number: eq.asset_number,  // Asset ID
    name: eq.name,                  // Equipment name
    status: eq.status,              // Current status
    last_updated: eq.updated_at || 'Never' // When the record last changed
  }));
  res.json({
    total_equipment: equipment.length, // Count
    equipment_status: statusSummary    // Array of summaries
  });
});

// GET /api/debug/maintenance-files -> list every file across all maintenance records.
app.get('/api/debug/maintenance-files', (req, res) => {
  const maintenance = readMaintenanceData(); // Load DB
  const filesSummary = []; // Will hold file info
  maintenance.forEach(record => {
    if (record.files && record.files.length > 0) {
      record.files.forEach(file => {
        filesSummary.push({
          maintenance_id: record.id,                         // Which maintenance record
          filename: file.filename,                           // Saved filename
          original_name: file.originalname,                  // Original name
          size: file.size,                                   // File size (bytes)
          exists: fs.existsSync(path.join(uploadsDir, file.filename)) // Is it on disk?
        });
      });
    }
  });
  res.json({
    total_files: filesSummary.length, // Count of files
    files: filesSummary               // Array of file info
  });
});

// --------------------------- Serve the main page -------------------------------

// GET / -> send the "public/index.html" file (if present) to the browser.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve main UI
});

// --------------------------- Error handling -----------------------------------

// Global error handler to format errors consistently (including Multer errors).
app.use((error, req, res, next) => {
  // Handle Multer-specific errors (file size/count).
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 10 files per upload.' });
    }
  }
  // Handle our custom file type error(s).
  if (error.message && error.message.includes('File type')) {
    return res.status(400).json({ error: error.message });
  }
  // Fallback: log and send generic 500.
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// --------------------------- Boot the server ----------------------------------
// Create sample data files (only on first run) and start listening.
initializeDataFiles(); // Ensure data JSONs exist

// Start HTTP server on all network interfaces so other devices on the LAN can reach it.
// Start the Express server and print useful info to the console.
app.listen(PORT, '0.0.0.0', () => {
  const networkInterfaces = require('os').networkInterfaces(); // Get network interfaces
  const addresses = [];
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address); // Collect LAN IPv4 addresses
      }
    }
  }
  // Print server startup info and endpoints.
  console.log('🚀 Advanced Equipment Tracker Started!');
  console.log('==========================================');
  console.log(`✅ Local:   http://localhost:${PORT}`);
  if (addresses.length > 0) {
    console.log('✅ Network access:');
    addresses.forEach(addr => {
      console.log(` 👥 http://${addr}:${PORT}`);
    });
  }
  console.log('==========================================');
  console.log('💾 Data saved automatically');
  console.log('🔄 Status updates enabled in maintenance');
  console.log('📎 File upload enabled (Max 10MB per file)');
  console.log('✏️ Edit/Delete maintenance records enabled');
  console.log('🐛 Debug endpoints:');
  console.log(` 📊 http://localhost:${PORT}/api/debug/equipment-status`);
  console.log(` 📎 http://localhost:${PORT}/api/debug/maintenance-files`);
  console.log('⛔ Press Ctrl+C to stop');
});
