/**
 * @openapi
 * paths:
 *   /pet:
 *     put:
 *       tags:
 *         - pet
 *       summary: Update an existing pet
 *       description: Update an existing pet by Id
 *       operationId: updatePet
 *
 */
import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/user.js"
import jwt from "jsonwebtoken"
import checkJwt from "../middlewares/checkJwt.js"
import { checkPassword } from "../middlewares/checkPassword.js"
import { checkMail } from "../middlewares/checkMail.js"

const apiRouter = express.Router()

apiRouter
   .post("/register", checkPassword, checkMail, async (req, res, next) => {
      try {
         //I use the spread operator to copy the req.body object and then I replace the password with the hashed password
         const newUser = new User({
            ...req.body,
            password: req.hashedPassword,
         })
         await newUser.save()

         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "4h",
         })

         res.status(201).json({ token })
      } catch (err) {
         next(err)
      }
   })
   //this route login an existing user with the email and password and return a jwt token
   .post("/login", async (req, res, next) => {
      try {
         const { email, password } = req.body
         const user = await User.findOne({ email })
         if (!user) {
            return res.status(404).json({ error: "User not found!" })
         }
         const isPswValid = await bcrypt.compare(password, user.password)
         if (!isPswValid) {
            return res.status(401).json({ error: "Password not valid!" })
         }
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "4h",
         })
         res.status(200).json({ token })
      } catch (err) {
         next(err)
      }
   })
   // this route return the user data  if the jwt token is valid
   .get("/me", checkJwt, (req, res) => {
      res.status(200).json({ user: req.user })
   })
   //logout must invalidate the jwt token!
   .post("/logout", (req, res) => {
      res.status(200).json({ message: "Logout successful!" })
   })
   //this route modify the user data if the jwt token is valid, if the psw is modified,the new psw is controlled and hashed in the checkPassword middleware
   //the email can't be modified
   .post("/me", checkJwt, checkPassword, async (req, res, next) => {
      try {
         const { password } = req.hashedPassword //this hashed password is taken from the checkPassword middleware
         // if the password is modified I update the user data with the new password
         if (password) {
            const user = await User.findByIdAndUpdate(
               req.user._id, //this id is taken from the jwt middleware
               { ...req.body, password: password }, // I use the spread operator to copy the req.body object and then I replace the password with the hashed password
               { runValidators: true, new: true }
            ).select("-password -_id -__v")
            return res.status(200).json({ user })
         } else {
            //if the password is not modified I update the user data without the password
            const user = await User.findByIdAndUpdate(
               req.user._id, //this id is taken from the jwt middleware
               req.body,
               { runValidators: true, new: true } //this option return the new user data
            ).select("-password -_id -__v")
            return res.status(200).json({ user })
         }
      } catch (err) {
         next(err)
      }
   })

export default apiRouter
