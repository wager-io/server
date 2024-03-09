const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth);
const {  handleTransaction }  = require('../controller/transactionControllers');

router.get('/:id', handleTransaction)

module.exports = router