const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage (replace with database in production)
let routerData = [];

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Replace with your actual API key validation
  if (token === 'your-api-key') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Endpoint to receive router data
app.post('/api/router-data', authenticate, (req, res) => {
  try {
    const data = req.body;
    data.receivedAt = new Date().toISOString();
    
    // Store the data (in production, save to database)
    routerData.push(data);
    
    // Optional: Write to file for backup
    fs.appendFileSync('router-data.json', JSON.stringify(data) + '\n');
    
    console.log(`Received data from router: ${data.router_id}`);
    
    res.status(200).json({ 
      success: true, 
      message: `Data received for router ${data.router_id}`,
      receivedAt: data.receivedAt 
    });
  } catch (error) {
    console.error('Error processing router data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all collected data
app.get('/api/router-data', authenticate, (req, res) => {
  res.json(routerData);
});

// Endpoint to get data for specific router
app.get('/api/router-data/:routerId', authenticate, (req, res) => {
  const routerId = req.params.routerId;
  const routerDataFiltered = routerData.filter(data => data.router_id === routerId);
  res.json(routerDataFiltered);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`WISP Monitoring Server running on port ${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/router-data - Receive router data');
  console.log('  GET  /api/router-data - Get all router data');
  console.log('  GET  /api/router-data/:routerId - Get data for specific router');
});