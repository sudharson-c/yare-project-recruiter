const express = require("express");
const { Router } = require('express');
const router = Router();
const User = require('../models/Users.js'); // Mongoose model

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Create a new user
router.post("/", async (req, res) => {
    const { clerkId, ...userData } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user document
        const newUser = new User({
            _id: clerkId,
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Save the user to MongoDB
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by MongoDB `_id`
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, // MongoDB `_id`
            { ...req.body, updatedAt: new Date().toISOString() },
            { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id); // MongoDB `_id`
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
