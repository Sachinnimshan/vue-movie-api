import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import postRouter from './routes/postRouter.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("uploads"));


const PORT = process.env.SERVER_PORT || 5000;
const CONNECTION_URL = process.env.DB_CONN;


mongoose.connect( CONNECTION_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    
})
.then(()=> console.log("Database Connected Successfully"))
.catch((error)=> { console.log(error)});

app.listen(PORT, ()=> console.log(`Server Started at ${PORT}`));

app.use('/posts', postRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(__dirname+"/dist/"));
    app.get("*",(req,res)=>{
        res.sendFile(__dirname + "/dist/index.html");
    });
}

app.get('/',(req,res)=>{
    res.send("Server is Ready");
});


mongoose.set('useFindAndModify', false);