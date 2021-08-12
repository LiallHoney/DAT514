const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Score: {
        type: Number,
        required: true

    }
})

module.exports = mongoose.model('Leaderboard', leaderboardSchema)