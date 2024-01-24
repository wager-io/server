const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { initiateDeposit, fetchPendingOrder , confirmDeposit} = require("../controller/depositController");

// auth middleware
router.use(requireAuth);

router.post("/initiate", initiateDeposit);
router.post("/confirmDeposit", confirmDeposit);
router.get("/pending-order", fetchPendingOrder);
module.exports = router;
