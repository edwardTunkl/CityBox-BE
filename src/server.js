import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { notFoundHandler, badRequestHandler, genericErrorHandler } from "./errorHandlers.js"
import userRouter from "./services/user/index.js"
import itemRouter from "./services/items/index.js"
import requestRouter from "./services/requests/index.js"

const server = express()
const port = process.env.PORT || 3001

// ***************** CORS ***********************
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
    origin: function (origin, next) {
        console.log("CURRENT ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            // if received origin is in the whitelist we are going to allow that request
            next(null, true)
        } else {
            // if it is not, we are going to reject that request
            next(new Error(`Origin ${origin} not allowed!`))
        }
    },
}

// ************************* MIDDLEWARES ********************************

server.use(cors(corsOpts))
server.use(express.json())

// ************************* ROUTES ************************************

server.use("/users", userRouter)
server.use("/items", itemRouter)
server.use("/requests", requestRouter)
// ************************** ERROR HANDLERS ***************************

server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log(`You're successfully connected to MongoDB: ${mongoose.connection.host}`)
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server running on port ${port}`)
    })
})

mongoose.connection.on("error", err => {
    console.log(err)
})