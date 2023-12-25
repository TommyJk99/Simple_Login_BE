//user mongoose schema
import { mongoose, Schema } from "mongoose"

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, "Name is required!"],
      minlength: [1, "Name must be at least 3 characters long!"],
      maxlength: [50, "Name must be at most 50 characters long!"],
      trim: true,
   },

   surname: {
      type: String,
      required: [true, "Surname is required!"],
      minlength: [1, "Surname must be at least 3 characters long!"],
      maxlength: [50, "Surname must be at most 50 characters long!"],
      trim: true,
   },
   email: {
      //the email controll is done in the checkMail middleware
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
   },
   password: {
      //the password controll is done in the checkPassword middleware
      type: String,
      required: [true, "Password is required!"],
      trim: true,
   },
})

export const User = mongoose.model("Users", userSchema)
