const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { handleDiceBet, getDiceGameHistory, seedSettings } = require('../controller/diceControllers')

router.post('/bet', handleDiceBet)
router.post('/seed-settings', seedSettings)
router.get('/', getDiceGameHistory)


module.exports = router