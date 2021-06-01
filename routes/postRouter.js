import mongoose from 'mongoose';
import Post from '../models/posts.js';
import express from 'express';
import data from '../data.js';
import multer from 'multer';
import fs from 'fs';


const postRouter = express.Router();

//File Upload and Save the uploaded file in project folder using multer 
let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+" "+Date.now()+" "+file.originalname);
    }
});

let upload = multer({
    storage: storage
}).single("Image");

postRouter.get('/seed', (async(req,res)=>{
    await Post.deleteMany({});
    try{
        const createdposts = await Post.insertMany(data.movieData);
        res.status(200).send(createdposts);
    }catch(error){
        res.status(401).send({message: error.message});
    }
    
}));


postRouter.post('/', upload, (async(req,res)=>{
    const post = req.body;
    const imagename = req.file.filename;
    post.Image = imagename;
    try{
        await Post.create(post);
        res.status(201).send({message: "New Post Created Successfully"});
    }catch(error){
        res.status(401).send({message: error.message});
    }
}));


postRouter.get('/', (async(req,res)=>{
    try{
        const posts = await Post.find({});
        res.status(200).send(posts);
    }catch(error){
        res.status(401).send({message: error.message});
    }
}));


postRouter.get('/:id', (async(req,res)=>{
    const id = req.params.id;
    try{
        const singlepost = await Post.findById(id);
        res.status(200).json(singlepost);
    }catch(error){
        res.status(401).send({message: error.message});
    }
}));

postRouter.patch('/:id', upload, (async(req,res)=>{
   const id = req.params.id;
   let new_image = "";
   if(req.file){
       new_image = req.file.filename;
       try{
           fs.unlinkSync("./uploads/" + req.body.old_image);
       }catch(error){
           res.status(401).send({message: error.message});
       }
   }else{
       new_image = req.body.old_image;
   }
   const updatepost = req.body;
   updatepost.Image = new_image;
   try{
       await Post.findByIdAndUpdate(id, updatepost);
       res.status(200).send({message: "Post Updated Successfully"});
   }catch(error){
       res.status(401).send({message: error.message});
   }
}));


postRouter.delete('/:id', (async(req,res)=>{
    const id = req.params.id;
    try{
        const deletepost = await Post.findByIdAndDelete(id);
        if(deletepost.Image != ''){
            try{
                fs.unlinkSync('./uploads/'+deletepost.Image);
            }catch(error){
                res.status(400).send({message: error.message});
            }
        }
    res.status(200).send({message: "Post Deleted Successfully"});
    }catch(error){
        res.status(401).send({message: error.message});
    }
}));


export default postRouter;