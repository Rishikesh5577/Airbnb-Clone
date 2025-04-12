// routes/register.js

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { registerSchema } = require('../schema');
const register = require('../models/register');

// Registration route (POST request)
router.post('/', wrapAsync(async (req, res) => {
  const { username, password, dob } = req.body;
  console.log(req.body, username, password, dob);

  // Validate user input using Joi schema
  const result = registerSchema.validate({ info: { username, password, dob } });

  if (result.error) {
    // Handle validation error
    return res.status(400).json({ error: result.error.details[0].message });
  }

  // Check if the user already exists in the database
  const existingUser = await register.findOne({ username });

  if (existingUser) {
    // User already exists
    return res.status(409).json({ error: 'Username already in use' });
  }

  // Convert the client's date to a date with time set to midnight
  const dobDate = new Date(dob);
  dobDate.setUTCHours(0, 0, 0, 0);

  // Create a new user using the register model
  const newUser = new register({ username, password, dob: dobDate });

  // Save the user to the database
  await newUser.save();

  // Respond with success message or user data
  return res.json({ message: 'Registration successful', user: newUser });
}));

module.exports = router;
