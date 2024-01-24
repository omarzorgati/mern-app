import express from 'express';
import { deleteUser, deleteUsers, getUsers, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utilities/verifyUser.js';



const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken , updateUser);
router.delete('/delete/:userId',verifyToken , deleteUser);
router.get('/getusers',verifyToken,getUsers)
router.delete('/deleteusers/:userId',verifyToken,deleteUsers)







export default router;