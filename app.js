import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';


import postRouter from './routes/postRouter.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("uploads"));


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;
const CONNECTION_URL = process.env.DB_CONN;

const server = http.createServer(app);

mongoose.connect( CONNECTION_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    
})
.then(()=> console.log("Database Connected Successfully"))
.catch((error)=> { console.log(error)});



app.use('/posts', postRouter);

if(process.env.NODE_ENV === "production"){
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.join(__dirname ,'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
}

server.listen(PORT, ()=> console.log(`Server Started at ${PORT}`));

app.get('/',(req,res)=>{
    res.send("Server is Ready");
});


mongoose.set('useFindAndModify', false);