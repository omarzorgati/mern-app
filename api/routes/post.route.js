import { createPost } from "../controllers/post.controller.js";
import { verifyToken } from "../utilities/verifyUser.js";
import express from 'express';




const router = express.Router();

router.post('/create',verifyToken,createPost)













export default router;