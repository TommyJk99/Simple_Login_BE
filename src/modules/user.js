//user mongoose schema
import { mongoose, Schema } from "mongoose"

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, "Name is required!"],
      minlength: [3, "Name must be at least 3 characters long!"],
      maxlength: [50, "Name must be at most 50 characters long!"],
   },

   surname: {
      type: String,
      required: [true, "Surname is required!"],
      minlength: [3, "Surname must be at least 3 characters long!"],
      maxlength: [50, "Surname must be at most 50 characters long!"],
   },
   email: {
      type: String,
      required: [true, "Email is required!"],
      minlength: [5, "Email must be at least 5 characters long!"],
      maxlength: [255, "Email must be at most 255 characters long!"],
      unique: true,
   },
   password: {
      //password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be at least 8 characters long!"],
      maxlength: [1024, "Password must be at most 1024 characters long!"],
      match: [
         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
         "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character!",
      ],
   },
})

export const User = mongoose.model("Users", userSchema)
