const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
require("./crashGameControllers/genarateHash")
require("./crashGameControllers/generate-seed")
const AllPLays = require("./routes/admin/PLayers/crashPlayers");
const VerifyGames = require("./routes/admin/games/crash");
const AdminDiceGame = require("./routes/admin/games/dice-games");
// const AdminStat = require("./routes/admin/statistic/statistics");
// const Dashboard = require("./routes/admin/dashboard/dashboard");
const Affiliate = require("./routes/affiliate");

const { createsocket } = require("./crashGameControllers/crashGameEngine.js");


const CrashGame = require("./routes/crashgame.js");
const User = require("./routes/Users.js");
const Profile = require("./routes/Profile.js");
const Chat = require("./routes/chat");
const Wallet = require("./routes/wallet.js");
const diceGame = require("./routes/diceGame");
const Stats = require("./routes/admin/statistic/statistics");
// const Transaction = require("./routes/transactions.js");
// const Payment = require("./routes/Payment.js");
const Deposit = require("./routes/deposit");
const Withdraw = require("./routes/withdraw")
const Bonus = require('./routes/bonus')
require("dotenv").config();

//========================= socket =============
const { createServer } = require("node:http");
const { Server } = require("@grpc/grpc-js");


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
// app.use("/api/payment", Payment);
// app.use("/api/trans", Transaction);
app.use("/api/stats", Stats);
app.use("/api/affiliate", Affiliate);
app.use("/api/deposit", Deposit);
app.use("/api/withdraw", Withdraw);

// app.use("/api/dashboard-details", Dashboard);
app.use("/api/cashback", Bonus)
// app.use("/api/admin",adminMembers)
// app.use("/api/admin/reports-details", reports)

// Admin routes
app.use("/admin/all-dice-game", AdminDiceGame);
app.use("/admin/all-players", AllPLays);
app.use("/admin/verify", VerifyGames);

app.get("/", (req, res)=>{
  res.send("Welcome to Wager server")
})

mongoose.set('strictQuery', false);

// connect database
const dbUri = `mongodb+srv://valiantjoe:emgSaXVP1NaOGz1b@highscore.muku4gg.mongodb.net/wager?retryWrites=true&w=majority`;
mongoose.connect(dbUri, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then((result)=>  console.log('Database connected'))
    .catch((err)=> console.log(err))
server.listen(process.env.PORT, ()=>{
    console.log("Running on port "+ process.env.PORT)
})