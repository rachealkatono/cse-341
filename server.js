// server.js with enhanced logging
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, getDb } = require('./data/database');
const contactsRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug route to check database connection
app.get('/debug/db', async (req, res) => {
  try {
    const db = getDb();
    const collections = await db.listCollections().toArray();
    const contactsCollection = collections.find(c => c.name === 'contacts');
    
    if (!contactsCollection) {
      return res.status(404).json({ 
        error: 'Contacts collection not found',
        availableCollections: collections.map(c => c.name)
      });
    }
    
    const count = await db.collection('contacts').countDocuments();
    
    res.json({
      dbConnected: true,
      dbName: db.databaseName,
      contactsCollection: contactsCollection !== undefined,
      contactCount: count,
      message: count > 0 ? 'Contacts found in database' : 'Contacts collection exists but is empty'
    });
  } catch (error) {
    console.error('Database debug route error:', error);
    res.status(500).json({ 
      dbConnected: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Routes
app.use('/contacts', contactsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API');
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    console.log(`🚀 Server running on http://localhost:${port}`);
    await connectToDatabase();
    
    // Verify the contacts collection exists and has data
    try {
      const db = getDb();
      const count = await db.collection('contacts').countDocuments();
      console.log(`✅ Found ${count} contacts in database`);
      
      if (count === 0) {
        console.warn('⚠️ Warning: Contacts collection is empty');
      }
    } catch (dbError) {
      console.error('❌ Error checking contacts collection:', dbError.message);
    }
  } catch (err) {
    console.error('❌ Failed to initialize server:', err);
  }
});