const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const projectRouter = require('./routes/projectRoute')
const userRouter = require('./routes/userRoute');

// Middleware Connections
app.use(cors(
    {
        origin: '*',
        // ['https://yare-sudharson-cs-projects.vercel.app', 'https://yare-rho.vercel.app', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is running");
});
// Routes
app.use('/users', userRouter)
app.use('/projects', projectRouter);

app.get("/",)
// Connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('App running in port: ' + PORT)
})

