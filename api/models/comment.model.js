import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    content : {
        type:String ,
        required: true,
    },
    postId : {
        type:String ,
        required: true,
    },
    userId : {
        type:String ,
        required: true,
        
    },
    likes : {
        type:Array ,
        default:[]
    },
    numberOfLikes : {
        type:Number ,
        default:0,
    },

// to know when the user is created or updated
}, {timestamps:true})

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
