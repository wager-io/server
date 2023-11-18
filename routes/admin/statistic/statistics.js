const express = require('express')
const router = express.Router()

const { GlobalStat, crashStat, diceStat } = require('../../../adminController/statistisControllers')

router.get('/global', GlobalStat)
router.post ('/crash', crashStat)
router.post ('/dice', diceStat)

module.exports = router