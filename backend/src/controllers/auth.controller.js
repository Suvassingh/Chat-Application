import express from "express";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ mesage: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ mesage: "Password should be of six character" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "Email already exist" });
    // hasing of password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profiePic: newUser.profilePic,
      });
      // welcome email sending
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullname,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({
        message: "invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup controller ", error);
    res.status(500).json({ message: "internal server error " });
  }
};



////////////////////////      login section



export const login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({message:"Email and Password are required"});
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" }); //never tell the client which one is incorrect: password or email
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" }); //never tell the client which one is incorrect: password or email

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profiePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (_, res) => {
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"Logged out successfully"})

};
