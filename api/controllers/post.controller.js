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

export const getPosts =async(req,res,next)=>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        //1 for asc and -1 for desc
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            //we will get posts depending on many factors like"category" "slug"if the query has the user id return the post of that user id
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category}),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            // if this req.query includes search term we want to search in both for example content and title
            ...(req.query.searchTerm &&{  
                //or allow us to search between title and content
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],

            }),
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit)
        //get the total numbers of posts
        const totalPosts = await Post.countDocuments();
        // get the total number in the last month
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });

        res.status(200).json({posts,totalPosts,lastMonthPosts});

       

    } catch (error) {
        next(error);
    }
    

}