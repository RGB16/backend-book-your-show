import Booking from "../Models/Bookings";
import User from "../Models/User";
import Movie from '../Models/movie'
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Ocurred" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Input" });
  }

  const hashedpassword = bcryptjs.hashSync(password);

  let user;
  try {
    user = new User({ name, email, password: hashedpassword });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "unexpected Error Ocurred" });
  }
  return res.status(201).json({ id: user._id });

};

export const updateuser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Input" });
  }
  const hashedpassword = bcryptjs.hashSync(password);
  let user;
  try {
    user = await User.findOneAndUpdate(
      { _id: id },
      {
        name,
        email,
        password: hashedpassword,
      }
    );
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res, status(500).json({ message: "something went wrong" });
  }
  res.status(200).json({ message: "Updated Sucesfully" });
};

export const deleteuser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res, status(500).json({ message: "something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Succesfully.... " });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Input" });
  }

  //for verify the user
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existinguser) {
    return res
      .status(404)
      .json({ message: "Unable to find user from this id" });
  }
  const isPasswordCorrect = bcryptjs.compareSync(
    password,
    existinguser.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ message: "Login Succesfull", id: existinguser._id });
};

export const getBookingsofUser = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.find({ user: id });
  } catch (err) { 
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to getbookings" });
  }
  // console.log(booking, "getBookingsofUser")
  return res.status(200).json({ booking });
};

export const getUserById = async (req, res, next) => {
  const id=req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Ocurred" });
  }
  return res.status(200).json({ user });
};