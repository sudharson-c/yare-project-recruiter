const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const projectRouter = require('./routes/projectRoute')
const userRouter = require('./routes/userRoute')

// Mongo DB Connections
const connection = require("./config/db")
connection();

// Middleware Connections
app.use(cors())
app.use(express.json())

// Routes
app.use('/users', userRouter)
app.use('/projects', projectRouter);


// Connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('App running in port: ' + PORT)
})

