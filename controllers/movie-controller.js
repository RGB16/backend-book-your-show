import  jwt  from "jsonwebtoken";
import Movie from "../Models/movie"; 
import mongoose from "mongoose";
import admin from "../Models/admin";

export const addMovie=async (req,res,next)=>{
    const extractedToken=req.headers.authorization.split(" ")[1];///stores as Bearer tocken

    if (!extractedToken && extractedToken.trim() === ""){
        return res.status(404).json({message:"Token not Found"});

    }

    let adminID;

    //verify tocken
    jwt.verify(extractedToken,process.env.SECRET_KEY,(err,decrypted)=>{
        if (err){
            console.log('Received Token:', extractedToken);

            return res.status(400).json({message:`${err.message}`});
        }else{
            adminID=decrypted.id;
        }
    })



    //create newmovie

    const {title,description,releaseDate,posterUrl,featured,actors}=req.body;
    if(!title && title.trim()=== "" 
    && !description && description.trim()==="" 
    && !posterUrl && posterUrl.trim()===""){
        return res.status(422).json({message:"Invalid Inputs"});
    }

    let movie;
    try{
        movie=new Movie({
            description,
            releaseDate:new Date(`${releaseDate}`),
            posterUrl,
            featured,
            actors,
            admin:adminID,
            title,
        });
//in single time we need to save both in move and admin collection
        const session=await mongoose.startSession();
        const adminUser=await admin.findById(adminID);
        session.startTransaction();
        await movie.save({session});
        adminUser.addedMovies.push(movie);
        await adminUser.save({session});
        await session.commitTransaction();

    }catch(err){
        console.log(err);
    }
    if (!movie){
        return res.status(500).json({message:"Request failed"})
    }

    return res.status(201).json({message:"The Movie Added succesfully",movie}) //({movie}) 

};

export const getallMovies=async (req,res,next)=>{
    let movies;
    try{
        movies=await Movie.find();

    }catch(err){
        console.log(err);
    }

    if(!movies){
        return res.status(500).json({message:"request failed"})
    }
    return res.status(200).json({movies})

};

export const getMoviebyid=async(req,res,next)=>{
    const id=req.params.id;
    let movie;
    try{
        movie=await Movie.findById(id)

    }catch(err){
        console.log(err)

    }

    if(!movie){
        return res.status(404).json({message:"Invalid movie Id"})
    }

    return res.status(201).json({movie})
}