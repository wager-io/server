const express = require("express");
const router = express.Router();
const requireAuth = require('../middleware/requireAuth')

const {
  CreateAccount,
  Register,
  previousChats,
  SingleUserByID,
  regenerateAffiliateCode,
  userAffiliateCodes,
  manuallygenerateAffiliateCode,
} = require("../controller/userController");
const { commission_to_ppd } = require("../controller/withdrawController");
router.post("/signup", CreateAccount);
router.post("/register", Register);
router.get("/previus-chats", previousChats);
router.post("/profile/:id", SingleUserByID);
router.post("/generate-affiliate",requireAuth,regenerateAffiliateCode);
router.post("/get-useraffiliate-code",requireAuth,userAffiliateCodes);
router.post("/generate-affiliatecode-manually",requireAuth,manuallygenerateAffiliateCode)
router.post("/withdraw-commission-ppd",requireAuth,commission_to_ppd)

module.exports = router;
