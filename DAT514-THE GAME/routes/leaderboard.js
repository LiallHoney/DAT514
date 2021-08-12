
const { request, response } = require('express')
const express = require('express')
const router = express.Router()
const Leaderboard = require('../models/leaderboard')

// Getting all / Sorting Database

router.get('/', async (req, res) => {
    try {
        const leaderboards = await Leaderboard.find({}).sort({
            Score: -1,
        })
        
        res.json(leaderboards)
    } catch (err) {
        res.status(500).json({ message: err.massage })
    }
})
// Getting One
router.get('/:id', getLeaderboard, (req, res) => {
    res.json(res.leaderboard)
})

// Creating One / New Player
router.post('/', async (req, res) => {
    const leaderboard = new Leaderboard({
     Name: req.body.Name, Score: req.body.Score 
    })

    try{
        const newLeaderboard = await leaderboard.save()
        res.status(201).json(newLeaderboard)
        console.log("Added Player")
    } catch (err) {
       res.status(400).json({ message: err.message })
    }
})

router.use("/leaderboard", Leaderboard)

// Updating One
router.patch('/:id', getLeaderboard, async (req, res) => {
    if (req.body.Name != null) {
        res.leaderboard.Name = req.body.Name
    }
    if (req.body.Score != null) {
        res.leaderboard.Score = req.body.Score
    }
    try {
        const updatedLeaderboard = await res.leaderboard.save()
        res.json(updatedLeaderboard)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
// Deleting One
router.delete('/:id', getLeaderboard, async (req, res) => {
    try{
        await res.leaderboard.remove()
        res.json({ message: 'Deleted Player'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getLeaderboard(req, res, next){
    let leaderboard
    try {
        leaderboard = await Leaderboard.findById(req.params.id)
        if (leaderboard == null) {
            return res.status(404).json({ message: 'cannot find leaderboard'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.leaderboard = leaderboard
    next()
}

module.exports = router