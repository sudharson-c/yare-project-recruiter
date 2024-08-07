const express = require("express");

const { Router } = require('express');
const router = Router(); 
const User = require('./../models/UserModel') 

const {userDb} = require('../config/firebase')
const UserDb = userDb;

// const UserDb = fireDb.collection("users")
// Get all userRoutes
router.get('/', async(req, res) => {
    try {   
        const userRoutes = await (await UserDb.get()).docs.map(doc=>({id:doc.id,...doc.data()}))
        res.send(userRoutes)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new userRoute
router.post("/", async (req, res) => {
    const { clerkId, ...userData } = req.body;
    try {
      // Check if the user already exists
      const userRef = userDb.doc(clerkId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        return res.status(401).json({ message: "User already exists" });
      }
      // Create a new user document
      const newUser = {
        clerkId: clerkId,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Add the new user to the Firestore
      await userRef.set(newUser);
      res.status(201).json({ id: clerkId, ...newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });

// Get userRoute By ID
router.get('/:id', async(req, res) => {
    try {
        // const user  = await User.findById(req.params.id)
        const user = await (await UserDb.doc(req.params.id).get()).data()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update userRoute By ID
router.put('/:id', async(req, res) => {
    try {
        const user  = await User.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(user )
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete userRoute By ID
router.delete('/:id', async(req, res) => {
    try {
        const user  = await User.findByIdAndDelete(req.params.id)
        res.send(user )
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
