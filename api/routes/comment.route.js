import express from 'express';
import { createComment, deleteComment, getComments, getPostComments, likeComment, updateComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utilities/verifyUser.js';



const router = express.Router();

router.post('/create',verifyToken,createComment)
router.get('/getpostcomments/:postId',getPostComments)
router.put('/likecomment/:commentId',verifyToken,likeComment)
router.put('/updatecomment/:commentId',verifyToken,updateComment)
router.delete('/deletecomment/:commentId',verifyToken,deleteComment)
router.get('/getcomments',verifyToken,getComments)












export default router;