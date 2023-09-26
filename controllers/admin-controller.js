import { response } from "express";
import Admin from "../Models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addAdmin=async(req,res,next)=>{
    const {email,password}=req.body;
 
    if (!email && email.trim()=== "" && !password && password.trim()===""){
            return res.status(422).json({message:"Invalid Input"})
    }
    let existingAdmin;

    try{
        existingAdmin=await Admin.findOne({email});
        
    }catch(err){
        return console.log(err)
    }

    if (existingAdmin){
        return res.status(400).json({message:"Admin Already exists"})
    }

    let admin;
    const hashedpassword=bcrypt.hashSync(password);
    try{
        admin=new Admin({email,password:hashedpassword})
        admin=await admin.save();
    }catch(err){
        return console.log(err)
    }
    if (!admin){
        return res.status(500).json({message:"unable to store the admin"})
    }
    return res.status(201).json({admin})//sucess
};



export const adminLogin=async(req,res,next)=>{

    const {email,password}=req.body;

    if (!email && email.trim()=== "" && !password && password.trim()===""){
            return res.status(422).json({message:"Invalid Input"})
    }

    let existingAdmin;
    try{
        existingAdmin=await Admin.findOne({email});

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred" });
    }

    if (!existingAdmin){
        return res.status(400).json({message:"Admin not found...."});
    }

    const isPasswordCorrect=bcrypt.compareSync(password,existingAdmin.password);

    if (!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"});
    }

    const token=jwt.sign({id:existingAdmin._id},process.env.SECRET_KEY,{expiresIn:"7d"})

    return res.status(200).json({message:"Authentication completed",token,id:existingAdmin._id})

}


export const getAdmins=async(req,res,next)=>{
    let admins;
    try{
        admins=await Admin.find();

    }catch(err){
        console.log(err);
    }

    if (!admins){
        return res.status(500).json({message:"Internal Server Error"})
    }
    return res.status(201).json({admins})
}