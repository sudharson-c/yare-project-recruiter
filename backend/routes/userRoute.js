import express from "express";

const userRouter = express.Router()


userRouter.get("/",(req,res)=>{
    const id = req.cookie.get("id")
    res.send(`User Profile :${id}`)
})

export default userRouter