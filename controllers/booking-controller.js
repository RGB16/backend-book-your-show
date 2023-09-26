import mongoose from "mongoose";
import Booking from "../Models/Bookings";
import Movie from "../Models/movie"; // Import the Movie model
import User from "../Models/User"; // Import the User model


// ... rest of your code


export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user } = req.body;
  
    let existingMovie;
    let existingUser;
    
    try {
      existingMovie = await Movie.findById(movie);
      existingUser = await User.findById(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching movie/user" });
    }
    // console.log("existingMovie:", existingMovie);
    // console.log("existingUser:", existingUser);
    
    if (!existingMovie) {
      return res.status(404).json({ message: `Movie Not found with ID: ${movie}` });
    }
  
    if (!existingUser) {
      return res.status(404).json({ message: "User Not found with given id" });
    }
  
    const parsedDate = new Date(date);
    let booking;
  
    try {
      booking = new Booking({
        movie,
        date: parsedDate,
        seatNumber,
        user,
      });
  
      const session = await mongoose.startSession();
      session.startTransaction();
      existingUser.bookings.push(booking);
      existingMovie.bookings.push(booking);
      await existingUser.save({ session });
      await existingMovie.save({ session });
      await booking.save({ session });
      session.commitTransaction();  
      return res.status(201).json({ booking });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to create new booking" });
    }
  };//1>
  
  


export const getBookingByID= async(req,res,next)=>{
    const id =req.params.id;
    let booking;
    try{
        booking=await Booking.findById(id)
    }catch(err){
        return console.log(err)
    }
    if(!booking){
        return res.status(500).json({message:"Unexpected Error"})
    }
    return res.status(200).json({booking});
}


export const deleteBooking=async(req,res,next)=>{
    const id =req.params.id;
    let booking;
    try{
        booking =await Booking.findByIdAndRemove(id).populate("user movie");
        const session=await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);
        await booking.movie.save({session});
        await booking.user.save({session});
        session.commitTransaction();

    }catch(err){
        console.log(err);
    }

    if (!booking){
        return req.status(500).json({message:"Unable to Delete"});
    }
    return res.status(200).json({message:"Succesfully Deleted"});
}