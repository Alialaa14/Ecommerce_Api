/*
  MODELING USER SCHEMA  

 -- USERNAME
 -- EMAIL 
 -- PASSWORD
 -- PROFILE PICTURE
 -- ROLE
 -- OTP FOR PASSWORD FORGET
 -- ISVERFIED VALUE (BOLEAN)
 -- OTP FOR VERFIED PAGES   
*/

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: [3, "Username must be minimum of 3 Letters"],
      maxLength: [20, "Username must be maximum of 20 letters "],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      public_id: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        default:
          "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106",
      },
    },
    role: {
      type: [String],
      default: ["user"],
    },
    passwordOtp: {
      type: String,
      default: "",
    },
    verificationOtp: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
