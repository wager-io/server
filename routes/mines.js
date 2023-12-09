const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { handleCashout,UpdateWins, handleInitialze,handleHasLost,handleMinesHistory,  handleMinesEncryption, handleActiveMines} = require('../controller/minesControllers')

router.post('/cashout', handleCashout)
router.post('/lost-bet', handleHasLost)
router.post('/update-wins', UpdateWins)
router.post('/mine-initialize', handleInitialze)
router.get('/mine-history', handleMinesHistory)
router.get('/mine-init', handleActiveMines)
router.get('/mine-encrypt', handleMinesEncryption)

module.exports = router