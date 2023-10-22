const { connection } = require("../database/index");
const { Helper } = require("../utils/helperFunction");
const helper = new Helper();
const { default: axios } = require("axios");
const crypto = require("crypto");
const {
  fetchData,
  insertAndFetchData,
  updateAndFetchData,
} = require("../actions/databaseAction");

const CCPAYMENT_API_ID = "202310051818371709996528511463424";
const CC_APP_SECRET = "206aed2f03af1b70305fb11319f2f57b";
const CCPAYMENT_API_URL = "https://admin.ccpayment.com";

const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

const formattedDbTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const currentTimestamp = Math.floor(Date.now() / 1000);
const formattedTimeStamp = currentTimestamp.toString().slice(0, 10);

const commission_to_ppd = async (req, res) => {
  const body = req.body;
  if (!body.amount) {
    return res.status(500).json({
      status: false,
      message: "Input amount for withdrawal",
    });
  }

  if (!body.affiliateCode) {
    return res.status(500).json({
      status: false,
      message: "Please provide your affiliateCode",
    });
  }

  if (typeof body.amount !== "number") {
    return res.status(500).json({
      status: false,
      message: "Please input a valid number",
    });
  }

  const affiliate_balance = await helper.get_affiliateCode_affiliate_balance(
    req.id,
    body.affiliateCode
  );

  const withdrawalAmount = Number(body.amount);
  try {
    if (withdrawalAmount > affiliate_balance) {
      return res.status(500).json({
        status: false,
        message: "You can't withdraw more than you have",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "You can't withdraw more than you have",
    });
  }

  console.log(affiliate_balance, withdrawalAmount);
};

const initiateWithdrawal = async (req, res) => {
  try {
    const user_id = req.id
    //  || "axy9um4InMQomSs9W10La6EVVEI2";
    const { address, amount } = req.body;
    if (!address || !amount) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    if (amount < 1) {
      return res.status(400).json({
        status: false,
        message: "Amount must be greater than 1",
      });
    }
    let query = `SELECT * FROM  usdt_wallet  WHERE user_id = "${user_id}"`;
    connection.query(query, async function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      }
      const userBalance = result[0].balance;
      if (userBalance < amount) {
        return res.status(400).json({
          status: false,
          message: "Insufficient funds",
        });
      } else {
        let data;

        const uniqueId = Math.floor(Math.random() * 1000);
        const transaction_id = parseInt(`${currentTimestamp}${uniqueId}`);
        // console.log(transaction_id);
        const transaction_type = "Wallet Withdrawal";
        const token_id = "0912e09a-d8e2-41d7-a0bc-a25530892988";
        const merchant_order_id = transaction_id.toString();
        const memo = (Math.floor(Math.random() * 1000) * 9999).toString();

        const withdrawData = {
          merchant_order_id,
          merchant_pays_fee: false,
          address: address,
          token_id,
          value: amount,
          memo,
        };

        console.log(withdrawData);

        let str =
          CCPAYMENT_API_ID +
          CC_APP_SECRET +
          formattedTimeStamp +
          JSON.stringify(withdrawData);
        let sign = crypto
          .createHash("sha256")
          .update(str, "utf8")
          .digest("hex");

        const headers = {
          Appid: CCPAYMENT_API_ID,
          "Content-Type": "application/json; charset=utf-8",
          Timestamp: formattedTimeStamp,
          Sign: sign,
        };
        const response = await axios.post(
          `${CCPAYMENT_API_URL}/ccpayment/v1/withdraw`,
          withdrawData,
          {
            headers: headers,
          }
        );
        console.log(response.data);

        if (response.data.msg === "success") {
          connection.query(
            "INSERT INTO transactions (user_id, transaction_type, trx_amount, datetime, status, transaction_id) VALUES (?, ?, ?, ?, ?, ?)",
            [
              user_id,
              transaction_type,
              amount,
              formattedDbTimestamp,
              "successful",
              transaction_id,
            ],
            async (err, _results) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ status: false, message: "Internal server error" });
              }
              const newAmount = Number(userBalance.balance) - Number(amount);
              await updateAndFetchData(
                "usdt_wallet",
                "UPDATE usdt_wallet SET balance = ? WHERE user_id = ?",
                [newAmount, user_id]
              );
              res.status(201).json({
                status: true,
                message: "Crypto deposited successfully",
                data: response.data,
              });
            }
          );
        } else {
          res.status(400).json({
            status: false,
            message: `${response.data.msg}. Reason: ${response.data.reason}`,
          });
        }
      }
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  commission_to_ppd,
  initiateWithdrawal,
};
