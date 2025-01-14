import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import cors from "cors"
import userRouter from "./routes/userRoute"
import organizationRouter from "./routes/organizationRoute"
import gigRouter from "./routes/gigRoute"

const app = express()

dotenv.config()
const PORT = process.env.PORT

if (!PORT) {
  console.log("Port not set in .env file")
  process.exit(1)
}

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://letushelp-dev.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))

// external routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/organizations", organizationRouter)
app.use("/api/v1/gigs", gigRouter)

app.listen(8080, () => {
  console.log(`Server started on port ${PORT}`)
})

app.get("/", (req, res) => {
  res.json({ message: "Hello World" })
})
