import express from "express";

const router = express.Router();

router.get("/send",(req,res)=>{
    res.send("send message")
})

router.get("/receive",(req,res)=>{
    res.send("receive message")
})

export default router;
