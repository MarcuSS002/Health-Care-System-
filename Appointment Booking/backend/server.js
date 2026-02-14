import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'


//app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)


app.get('/', (req, res) => {
    res.send("Api working")
})

const startServer = (p) => {
    const server = app.listen(p, () => {
        console.log(`Server Listening on port ${p}`)
    })

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${p} in use, trying ${p + 1}...`)
            setTimeout(() => startServer(p + 1), 500)
        } else {
            console.error('Server error:', err)
            process.exit(1)
        }
    })
}

startServer(port)