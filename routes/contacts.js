// routes/contacts.js with enhanced error logging
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('📥 GET /contacts request received');
    const db = getDb();
    console.log(`Using database: ${db.databaseName}`);
    
    const contacts = await db.collection('contacts').find().toArray();
    console.log(`📤 Returning ${contacts.length} contacts`);
    
    res.status(200).json(contacts);
  } catch (err) {
    console.error('❌ Error in GET /contacts:', err);
    res.status(500).json({ 
      error: 'Could not fetch contacts',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log(`📥 GET /contacts/${req.params.id} request received`);
    const db = getDb();
    
    if (!ObjectId.isValid(req.params.id)) {
      console.log('❌ Invalid ObjectId format');
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const contact = await db.collection('contacts').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!contact) {
      console.log('❌ Contact not found');
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    console.log('📤 Returning contact:', contact._id);
    res.status(200).json(contact);
  } catch (err) {
    console.error('❌ Error in GET /contacts/:id:', err);
    res.status(500).json({ 
      error: 'Failed to fetch contact',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router; 