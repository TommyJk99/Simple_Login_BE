import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { genericErrorHandler } from "./middlewares/genericErrorHandler.js"
import list from "express-list-endpoints"
import swaggerjsdoc from "swagger-jsdoc"
import swaggerui from "swagger-ui-express"
import apiRouter from "./routes/apiRouter.js"

const server = express()
server.use(express.json())
server.use(cors())

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Express JWT Authentication",
         version: "1.0.0",
         description: "A simple Express JWT Authentication API",
         contact: {
            name: "Thomas",
            email: "thomas@gmail.com",
         },
      },
      servers: [
         {
            url: "http://localhost:3030/",
         },
      ],
   },
   apis: ["./index.js"],
}

const specs = swaggerjsdoc(options)
server.use("/api-docs", swaggerui.serve, swaggerui.setup(specs))

server.use("/api", apiRouter)

server.get("/health", (req, res) => {
   res.status(200).json({ message: "Server is up!" })
}) // this route return a message if the server is up

server.use(genericErrorHandler)

const port = process.env.PORT || 3030

mongoose.connect(process.env.MONGO_URI).then(() => {
   server.listen(port, () => {
      console.log(`🚀 Listening on port ${port}`)
      console.table(list(server))
   })
})
