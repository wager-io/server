const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { handleMinesBet, handleInitialze, handleMinesEncryption} = require('../controller/minesControllers')

router.post('/bet', handleMinesBet)
router.post('/mine-initialize', handleInitialze)
router.get('/mine-encrypt', handleMinesEncryption)

// router.post('/seed-settings', seedSettings)
// router.get('/', getDiceGameHistory)

module.exports = router