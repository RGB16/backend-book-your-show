import express from "express";
import { addMovie, getMoviebyid, getallMovies } from "../controllers/movie-controller";

const movieRouter=express.Router();


movieRouter.get("/",getallMovies);
movieRouter.post("/",addMovie);
movieRouter.get("/:id",getMoviebyid);


export default movieRouter;