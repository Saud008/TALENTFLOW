// server.js
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root (one level up from backend)
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

// import authRoutes from './routes/auth.js'
// import authMiddleware from './middleware/auth.js'

console.log("Loaded ENV:", process.env)


// Express app
const app = express()
const PORT = process.env.PORT || 4000

// #middleware
app.use(cors())
app.use(express.json())

// #database connection
console.log("Mongo URI:", process.env.MONGO_URI)

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is required')
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// // #routes
// app.use('/api/auth', authRoutes)

// // #health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() })
// })

// // #error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ message: 'Something went wrong!' })
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
