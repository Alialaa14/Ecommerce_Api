/*
 USER CONTROLER 

 -- REGISTER (CREATE USER)
 -- LOGIN 
 -- LOGOUT
 -- FORGET PASSWORD (SEND OTP USNIG EMAIL TO USER)
 -- VERIFY OTP (SENT FOR PASSWORD FORGET)
 -- RESET PASSWORD (CHANGE PASSWORD IF USER HAS CORRECT OTP)
 -- OTP FOR VERIFCATION (SEND OTP USING EMAIL TO USER )
 -- VERIFY ACCOUNT (IF USER HAS OTP CORRECT FOR VERIFCATION)
 
*/

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import CustomError from "../utils/Custom-Api-error.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/ENV.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userImage = req.file;

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existedEmail = await User.findOne({ email });

    if (existedEmail)
      return res.status(400).json({
        success: false,
        message: "Email is Registered In Our Database",
      });

    // Upload Profile Pic
    let result = {};
    if (userImage) {
      result = await cloudinary.uploader.upload(userImage.path, {
        folder: `${email}`,
      });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    // GENRATE JSONWEBTOKEN
    const token = jwt.sign({ user }, ENV.SECRET_KEY, {
      expiresIn: 3 * 1000 * 60 * 60 * 24,
    });

    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "We Couldn't Register" });

    res.cookie("token", token, { maxAge: 3 * 1000 * 60 * 60 * 24 });
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isEmailExisted = await User.findOne({ email });

    if (!isEmailExisted)
      return res
        .status(400)
        .json({ success: false, message: "This Email Doesn't Existed " });

    // VERIFY PASSWORD
    const comparePassword = bcrypt.compare(password, isEmailExisted.password);

    if (!comparePassword)
      return res
        .status(400)
        .json({ success: false, message: "Password Doesn't Match" });

    // GENERATE JWT
    const token = jwt.sign({ user: isEmailExisted }, ENV.SECRET_KEY, {
      expiresIn: 3 * 1000 * 60 * 60 * 24,
    });
    res.cookie("token", token, { maxAge: 3 * 1000 * 60 * 60 * 24 });

    return res.status(200).json({
      success: true,
      message: "User Logged Successfully",
      data: isEmailExisted,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "User Logged Out Successfully" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email is not existed" });

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // SEND OTP
    sendEmail({
      to: email,
      from: ENV.EMAIL,
      subject: "Forget Password",
      otp,
      username: user.username,
    });

    // SAVE IT TO DATABASE
    user.passwordOtp = otp;
    await user.save();

    // GENERATE JWT
    const token = jwt.sign({ user }, ENV.SECRET_KEY, {
      expiresIn: 10 * 1000 * 60,
    });

    res.cookie("token", token, {
      maxAge: 10 * 1000 * 60,
    });
    return res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const verifyPasswordOtp = (req, res, next) => {
  try {
    const { otp } = req.body;

    // GET TOKEN FROM COOKIES
    const token = req.cookies.token;

    // GET DATA FROM TOKENs
    const payload = jwt.verify(token, ENV.SECRET_KEY);

    const user = payload.user;
    if (!payload)
      return res.status(400).json({ success: false, message: "Invalid Token" });

    if (user.passwordOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid Otp" });

    res.cookie("otp-verify", true, {
      maxAge: 10 * 1000 * 60,
    });
    return res.status(200).json({
      success: true,
      message: "Otp Verified Successfully",
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const isVerfied = req.cookies["otp-verify"];

    if (isVerfied !== "true")
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Verify Otp" });

    const token = req.cookies.token;
    // GET DATA FROM TOKEN
    const payload = jwt.verify(token, ENV.SECRET_KEY);
    if (!payload)
      return res.status(400).json({ success: false, message: "Invalid Token" });

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const User = payload.user;
    // UPDATE PASSWORD
    User.password = hashedPassword;
    User.passwordOtp = "";
    await User.save;
    return res
      .status(200)
      .json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const accountVerificationOtp = async (req, res, next) => {
  try {
    const user = req.user.user;
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "We Can't Find User" });

    const existingUser = await User.findById(user._id);
    if (!existingUser)
      return res
        .status(400)
        .json({ success: false, message: "We Can't Find User" });

    // GENERATE OTP
    const otp = Math.floor(Math.random() * 9000 + 1000);
    // TODO => ADD FAILED TO SEND EMAIL MIDDLRWARE OR ERROR HANDLER
    sendEmail({
      to: user.email,
      subject: "Account Verification",
      otp,
      username: user.username,
    });

    existingUser.verificationOtp = otp;
    await existingUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Verification Otp Successfully Sent" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const verifyAccount = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = req.user.user;

    if (!otp || otp.length !== 4)
      return res.status(400).json({ success: false, message: "Invalid Otp" });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "We Can't Find User" });

    const existingUser = await User.findById(user._id);
    if (!existingUser)
      return res
        .status(400)
        .json({ success: false, message: "We Can't Find User" });

    if (existingUser.verificationOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid Otp" });

    existingUser.isVerified = true;
    existingUser.verificationOtp = "";
    await existingUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Account Verified Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

// TODO -> AOUTH GOOGLE AUTHENCTICATION
