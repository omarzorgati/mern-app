import { createPost, deletePost, getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utilities/verifyUser.js";
import express from 'express';




const router = express.Router();

router.post('/create',verifyToken,createPost)
router.get('/getposts',getPosts)
router.delete('/delete/:postId/:userId',verifyToken,deletePost)














export default router;