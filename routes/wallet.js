const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const {  GetWGDWallet, GetWGFWallet, GetETHWallet, GetBTCWallet, GetDefaultWallet, UpdatedefaultWallet}  = require('../controller/walletControlers')

router.get('/ppd-wallet', GetWGDWallet)
router.get('/ppf-wallet', GetWGFWallet)
router.get('/ppl-wallet', GetETHWallet)
router.get('/usdt-wallet', GetBTCWallet)
router.get('/default-wallets', GetDefaultWallet)
router.post('/update-default-wallets', UpdatedefaultWallet)

module.exports = router