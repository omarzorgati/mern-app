import Post from "../models/post.model.js";
import { errorHandler } from "../utilities/error.js";




export const createPost =async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to create post"))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,"Title and body are required"))
    }
    
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body, 
        slug , 
        userId:req.user.id
    })

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
       next(error); 
    }


}