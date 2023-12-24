import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import cors from "cors"
import { genericErrorHandler } from "./middlewares/genericErrorHandler.js"
import { User } from "./modules/user.js"
import jwt from "jsonwebtoken"
import checkJwt from "./middlewares/checkJwt.js"
import list from "express-list-endpoints"
import { checkPassword } from "./middlewares/checkPassword.js"
import { checkMail } from "./middlewares/checkMail.js"

const server = express()

server.use(express.json())
server.use(cors())

const port = process.env.PORT || 3030

// this route return a message if the server is up
server.get("/health", (req, res) => {
   res.status(200).json({ message: "Server is up!" })
})

// this route add a new user to the database and return a jwt token
// the pssw check, the email check and the hash of the password are done in the checkPassword and checkMail middlewares
server
   .post("/register", checkPassword, checkMail, async (req, res, next) => {
      try {
         const newUser = new User(req.body)
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
         const user = User.findOne({ email })
         if (!user) {
            return res.status(404).json({ error: "User not found!" })
         }
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
         const { name, surname } = req.body
         const { password } = req.hashedPassword //this hashed password is taken from the checkPassword middleware

         const user = await User.findByIdAndUpdate(
            req.user._id, //this id is taken from the jwt middleware
            { name, surname, password },
            { runValidators: true, new: true } //this option return the new user data
         ).select("-password -_id -__v")
         res.status(200).json({ user })
      } catch (err) {
         next(err)
      }
   })

server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_URI).then(() => {
   server.listen(port, () => {
      console.log(`🚀 Listening on port ${port}`)
      console.table(list(server))
   })
})
