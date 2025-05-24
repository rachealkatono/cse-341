// server.js with enhanced logging
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { connectToDatabase, getDb } = require('./data/database');
const contactsRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Debug route to check database connection
app.get('/debug/data', async (req, res) => {
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
/**
 * @swagger
 * /contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     description: Returns all contacts
 *     responses:
 *       200:
 *         description: Successfully returned all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ContactResponse'
 *       500:
 *         description: Server error
 */

// Routes
app.use('/contacts', contactsRoutes);

// Root route
/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome message
 *     responses:
 *       200:
 *         description: Successfully returned welcome message
 */
// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API');
});

const port = process.env.PORT || 3000;

if (require.main === module) {
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
}
module.exports = app; // Export the app for testing