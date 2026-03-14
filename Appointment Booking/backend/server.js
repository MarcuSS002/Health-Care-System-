import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

//app config
const app = express()
const port = Number(process.env.PORT) || 3001
const startupPromise = Promise.all([connectDB(), connectCloudinary()])

//middlewares
app.use(express.json())
app.use(cors())

app.use(async (req, res, next) => {
    try {
        await startupPromise
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server initialization failed' })
    }
})

//api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)


app.get('/', (req, res) => {
    res.send("Api working")
})

if (!process.env.VERCEL) {
    startupPromise
        .then(() => {
            app.listen(port, () => {
                console.log(`Server Listening on port ${port}`)
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

export default app
