import express from "express";
import { deleteBooking, getBookingByID, newBooking } from "../controllers/booking-controller";
import { getBookingsofUser } from "../controllers/user-controller";

const bookingsRouter=express.Router();


bookingsRouter.get("/:id",getBookingByID);
bookingsRouter.post("/",newBooking);
bookingsRouter.delete("/:id",deleteBooking)

export default bookingsRouter;
