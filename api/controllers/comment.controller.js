import { errorHandler } from "../utilities/error.js";
import Comment from "../models/comment.model.js";







export const createComment=async(req,res,next)=>{
    try {
        const {content,postId,userId}=req.body;
        if(userId!==req.user.id){
            return next(errorHandler(403,'u are not allowed to create this comment'))
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment)
        
    } catch (error) {
       next(error) 
    }
}
export const getPostComments=async(req,res,next)=>{
    try {
        const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }

}
export const likeComment =async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'comment not found'))
        }
        //check if user already liked the comment
        const userIndex = comment.likes.indexOf(req.user.id);
        //if the userindex is not inside this the like array push it add it
        if(userIndex===-1){
            comment.numberOfLikes +=1
            comment.likes.push(req.user.id);
        }else{
            //if the userindex is inside this the like array splice it means remove it
            comment.numberOfLikes -=1
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment)

    } catch (error) {
        
    }
}
export const updateComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'comment not found'))
        }
        if(comment.userId!==req.user.id && !req.user.isAdmin){
            return next(errorHandler(403,'u are not allowed to update this comment'))
        }
        const updatedComment=await Comment.findByIdAndUpdate(req.params.commentId,
            {content:req.body.content}
            ,{new:true});
        res.status(200).json(updatedComment)    

    } catch (error) {
        next(error);
    }

}
export const deleteComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'comment not found'))
        }
        if(comment.userId!==req.user.id && !req.user.isAdmin){
            return next(errorHandler(403,'u are not allowed to delete this comment'))
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('comment has been deleted')
    } catch (error) {
        next(error);
    }
}
export const getComments=async(req,res,next)=>{
  if(!req.user.isAdmin) 
        return next(errorHandler(403,'u are not allowed to see comments'))
  
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc'? -1 : 1;
    const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(),now.getMonth() - 1,now.getDate());
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    res.status(200).json({comments,totalComments,lastMonthComments});
    
  } catch (error) {
    next(error);
  }
}