// routes.js:
// This file defines the routes for the users API.

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { users } = require('./users');
const db = require('./db');

// Define a route to create a new user
router.post('/users', (req, res) => {
  // Extract the name, id, and emoji from the request body
  let { name } = req.body;
  let id = req.body.id || uuidv4();
  let emoji = req.body.emoji || '👋';

  // Create a new user object with the extracted data
  let user = { id, name, emoji };

  // Add the new user to the users array
  users.push(user);

  // Send a response with the new user object and a 201 status code
  res.status(201).json(user);
});

// Define a route to get all users
router.get('/users', (req, res) => {
  // Send a response with the users array
  res.json(users);
});

// Define a route to get a specific user by ID
router.get('/users/:id', (req, res) => {
  // Extract the user ID from the request parameters
  let { id } = req.params;

  // Find the user with the matching ID in the users array
  let user = users.find((user) => user.id === id);

  // If no user is found, send a 404 error response
  if (!user) {
    res.status(404).send('User not found');
  } else {
    // Otherwise, send a response with the user object
    res.json(user);
  }
});

// Define a route to update a specific user by ID
router.put('/users/:id', (req, res) => {
  // Extract the user ID and name from the request parameters and body
  let { id } = req.params;
  let { name } = req.body;

  // Find the index of the user with the matching ID in the users array
  let userIndex = users.findIndex((user) => user.id === id);

  // If no user is found, send a 404 error response
  if (userIndex === -1) {
    res.status(404).send('User not found');
  } else {
    // Otherwise, create a new user object with the updated name and replace the old user object in the users array
    let user = { id, name };
    users[userIndex] = user;

    // Send a response with the updated user object
    res.json(user);
  }
});

// Define a route to add a new user to the database
router.post('/db/users', async(req, res) => {
  // Extract the name, id, and emoji from the request body
  let { name } = req.body;
  let id = req.body.id || uuidv4();
  let emoji = req.body.emoji || '👋';

  // Create a new user object with the extracted data
  let user = { id, name, emoji };

  // Add the new user to the database
  await db.user.create(user);

  // Send a response with the new user object and a 201 status code
  res.status(201).json(user);
});

// Define a route to fetch a user from the database by name or ID
router.get('/db/users', async(req, res) => {
  // Extract the name and ID from the request query parameters
  console.log(req.query);
  let { name, id } = req.query;

  // If the name is provided, fetch the user by name
  if (name) {
    // Fetch the user from the database by name
    let query = "SELECT * FROM users WHERE name = '" + name + "'";

    let user = await db.db.query(query,
      {
        type: db.user.SELECT,
      });

    // If no user is found, send a 404 error response
    if (!user) {
      res.status(404).send('User not found');
    } else {
      // Otherwise, send a response with the user object
      res.json(user);
    }
  } else if (id) {
    // If the ID is provided, fetch the user by ID
    // Fetch the user from the database by ID
    let user = await db.user.findAll({
      where: {
        id: id,
      },
    });

    // If no user is found, send a 404 error response
    if (!user) {
      res.status(404).send('User not found');
    } else {
      // Otherwise, send a response with the user object
      res.json(user);
    }
  } else {
    // If neither the name nor ID is provided, send a 400 error response
    res.status(400).send('Please provide a name or ID');
  }
});

// Export the router object for use in other files
module.exports = router;
