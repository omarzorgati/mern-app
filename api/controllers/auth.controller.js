import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";   
import { errorHandler } from "../utilities/error.js";
import jwt from "jsonwebtoken";



export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password || username ==='' || email === ''|| password===''){
        next(errorHandler(400,"All fields are required"));
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        next(error);
    }
    
};

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password || email === ''|| password===''){
        next(errorHandler(400,"All fields are required"));
    }
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'wrong cridential !'));
        //create a token
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        //we dont want the password the show up we need to remoove it: distract password from the informations of the user
        const {password:pass,...rest} = validUser._doc;
        // save the token as a coockie
        res.cookie('access_token',token,{httpOnly:true})
        .status(200)
        //convert the rest to json
        .json(rest);

        
    } catch (error) {
        next(error);
    }
}
