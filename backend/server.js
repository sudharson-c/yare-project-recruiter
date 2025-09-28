const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const projectRouter = require('./routes/projectRoute')
const userRouter = require('./routes/userRoute');

// Middleware Connections
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is running");
});
// Routes
app.use('/users', userRouter)
app.use('/projects', projectRouter);

// Connection
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('App running in port: ' + PORT)
})

