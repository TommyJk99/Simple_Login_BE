import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import cors from "cors"
import { genericErrorHandler } from "./middlewares/genericErrorHandler.js"
import { User } from "./modules/user.js"
import jwt from "jsonwebtoken"
import checkJwt from "./middlewares/checkJwt.js"
import list from "express-list-endpoints"

const server = express()

server.use(express.json())
server.use(cors())

const port = process.env.PORT || 3030

// this route is just for testing purposes
server.get("/health", (req, res) => {
   res.status(200).json({ message: "Server is up!" })
})

// this route add a new user to the database and return a jwt token
server.post("/register", async (req, res, next) => {
   try {
      const password = await bcrypt.hash(req.body.password, 12)
      const newUser = await User.create({ ...req.body, password })

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
         expiresIn: "1d",
      })

      res.status(201).json({ token })
   } catch (err) {
      next(err)
   }
})
//this route login an existing user with the email and password and return a jwt token
server.post("/login", async (req, res, next) => {
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
// this route return the user data
server.get("/me", checkJwt, (req, res) => {
   res.status(200).json({ user: req.user })
})

server.use(genericErrorHandler)
mongoose.connect(process.env.MONGO_URI).then(() => {
   server.listen(port, () => {
      console.log(`🚀 Listening on port ${port}`)
      console.table(list(server))
   })
})
