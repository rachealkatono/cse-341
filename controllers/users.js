const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all users
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a single user by ID
const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId }).toArray();

    if (result.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

module.exports = {
  getAll,
  getSingle
};
