import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./Routes/user-routes";
import adminRouter from "./Routes/admin-routes";
import movieRouter from "./Routes/movie-routes";
import bookingsRouter from "./Routes/booking-routes";
import cors from "cors";
dotenv.config();

const app=express();
const port = process.env.PORT || 5000;
app.use(cors());


//middlewares
app.use(express.json());   //this middleware tells application only communicate with the json data
app.use("/user",userRouter); //this middleware work for all the user routes
app.use("/admin",adminRouter);    //for admin routers
app.use("/movie",movieRouter);
app.use("/booking",bookingsRouter);


mongoose.connect(`mongodb+srv://admin:${process.env.MOGODBPASSWORD}@cluster0.lnuklyy.mongodb.net/`).then(app.listen(port,()=>{
    console.log(`the port is running in ${port} and connected to the Database`) 
})).catch((e)=>console.log(e));