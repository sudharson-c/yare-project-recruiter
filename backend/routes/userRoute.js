const express = require("express");

const { Router } = require('express');
const router = Router(); 
const User = require('./../models/UserModel') 

// Get all userRoutes
router.get('/', async(req, res) => {
    try {
        const userRoutes = await User.find()
        res.send(userRoutes)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new userRoute
router.post('/', async(req, res) => {
    
    try {
        let user = new User({
            ...req.body
        })
        user = await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get userRoute By ID
router.get('/:id', async(req, res) => {
    try {
        const user  = await User.findById(req.params.id)
        res.send(user )
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
