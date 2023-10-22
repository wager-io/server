const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

// auth middleware
router.use(requireAuth)
const { 
    handleAffiliateProfile,
 handleActivateAffiliateCode, handleActivateAffiliate,
 handleViewAllFriends , handleFriendsInfo
} = require('../controller/affiliateControllers')

router.post("/re",handleActivateAffiliateCode)
router.get("/friends-info", handleFriendsInfo)
router.post("/activate", handleActivateAffiliate)
router.get("/", handleAffiliateProfile)
router.get('/viewfriends',handleViewAllFriends)

module.exports = router