const express = require("express");
const cors = require("cors");
require("./database/firebase");
require("./database/index.js");
const Admin = require("./routes/admin/admin");
const AllPLays = require("./routes/admin/PLayers/crashPlayers");
const VerifyGames = require("./routes/admin/games/crash");
const AdminStat = require("./routes/admin/statistic/statistics");
// const Dashboard = require("./routes/admin/dashboard/dashboard");
const Affiliate = require("./routes/affiliate");
const payment_api = require("./routes/payment_api");
const { Nextmonday } = require("./profile_mangement/week_cashback")
// // Nextmonday()
const { createsocket } = require("./crashGameControllers/crashGameEngine.js");
require("./controller/crashControllers.js");

const CrashGame = require("./routes/crashgame.js");
const User = require("./routes/Users.js");
const Profile = require("./routes/Profile.js");
const Chat = require("./routes/chat");
const Wallet = require("./routes/wallet.js");
const diceGame = require("./routes/diceGame");
const Stats = require("./routes/statistic");
const Transaction = require("./routes/transactions.js");
const Payment = require("./routes/Payment.js");
const Deposit = require("./routes/deposit");
const Bonus = require('./routes/bonus')
const adminMembers = require('./routes/admin/members/members')
require("dotenv").config();

//========================= socket =============
const { createServer } = require("node:http");
const { reports } = require("./adminController/reports");

// ============ Initilize the app ========================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const server = createServer(app);

async function main() {
  createsocket(server);
}
main();

// application routes
app.use("/api/user/crash-game", CrashGame);
app.use("/api/user/dice-game", diceGame);
app.use("/api/users", User);
app.use("/api/public-chat", Chat);
app.use("/api/profile", Profile);
app.use("/api/wallet", Wallet);
app.use("/api/payment", Payment);
app.use("/api/trans", Transaction);
app.use("/api/stats", Stats);
app.use("/api/affiliate", Affiliate);
app.use("/api/deposit", Deposit);

// app.use("/api/dashboard-details", Dashboard);
app.use("/api/cashback", Bonus)
app.use("/api/admin",adminMembers)
app.use("/api/admin/reports-details", reports)
app.use("/api/pay-api", payment_api);


// Admin routes
app.use("/admin", Admin);
app.use("/admin/all-players", AllPLays);
app.use("/admin/verify", VerifyGames);
app.use("/admin/stat", AdminStat);

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log("listening to port", PORT);
});

app.all("*", (req,res)=>{
  return res.json({
    message:"Just like that you completely lost your way 😂"
  })
})

// https://www.linkpicture.com/q/dpp-favicon-allwhite-transparent-final.png
