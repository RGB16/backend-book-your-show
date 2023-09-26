import express from "express";
import { deleteuser, getAllUsers,getBookingsofUser,getUserById,login,signup, updateuser } from "../controllers/user-controller"

const userRouter=express.Router();

userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.post("/signup",signup);
userRouter.put("/:id",updateuser);
userRouter.delete("/:id",deleteuser);
userRouter.post("/login",login);
userRouter.get("/bookings/:id",getBookingsofUser);


export default userRouter;   