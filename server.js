import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const API_KEY = "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"; // 🔐 YOUR KEY HERE
app.post("/ai", async (req,res)=>{

    try{

        const userMsg = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + API_KEY
            },
            body: JSON.stringify({
                model:"gpt-4o-mini",
                messages:[
                    {role:"system", content:"Productivity assistant"},
                    {role:"user", content:userMsg}
                ]
            })
        });

        const data = await response.json();

        console.log(data); // 🔥 VERY IMPORTANT

        res.json(data);

    }catch(err){
        console.log(err);
        res.json({error:{message:"Server error"}});
    }
});
app.listen(3000, ()=>console.log("Server running on port 3000"));