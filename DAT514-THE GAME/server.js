require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

// Set Static Folder
app.use(express.static(path.join(__dirname, "TheGame")))

// Start Server

mongoose.connect(process.env.DATABASE_URL, 
    { useNewUrlParser: true },{ useUnifiedTopology: true })
const db = mongoose.connection 
db.on('error',(error) => console.error(error))
db.once('open',(error) => console.log('Connected to Database'))

app.use(express.json())

// localhost:3000/leaderboard

const leaderboardRouter = require('./routes/leaderboard')
app.use('/leaderboard', leaderboardRouter)

app.listen(PORT, () => console.log('Server Started')  )