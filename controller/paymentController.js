const axios = require("axios");
const {
  insertAndFetchData,
  fetchData,
  updateAndFetchData,
} = require("../actions/databaseAction");

const initializeDeposit = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res
      .status(422)
      .json({ message: "amount or currency field is required" });
  }
  const user_id = req.id;
  let data;
  let sql = `INSERT INTO deposit (user_id, amount, currency) VALUES (?, ?, ?)`;
  (async () => {
    try {
      const user = await fetchData("users", "user_id = ?", [user_id]);
      data = await insertAndFetchData("deposit", sql, [
        user_id,
        amount,
        currency
      ]);
      const params = {
        api_key: process.env.PLISIO_API_KEY,
        source_currency: "USD",
        source_amount: data.amount,
        order_number: data.id,
        currency: data.currency,
        email: user.email,
        order_name: "deposit",
        callback_url: "http://test.com/callback",
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          "https://plisio.net/api/v1/invoices/new",
          {
            params,
            config,
          }
        );
        return res.status(201).json({
          data: response.data,
        });
      } catch (error) {
        return res.status(500).json({
          message: error.response.data.data.message ?? "Something went wrong",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  })();
};




const confirmDeposit = async (req, res) => {
  const { verify_hash, amount, status, order_number } = req.body;
  if (!verify_hash || status != "completed") {
    return res.status(500).json({
      message: "This payment is not found",
    });
  }
  (async () => {
    try {
      const params = [order_number];
      const data = await fetchData("deposit", "id = ?", params);
      const userBalance = await fetchData("usdt_wallet", "user_id = ?", [
        data.user_id,
      ]);
      // check if the deposit has been confirmed before and terminate the request
      if (data.status === "completed") {
        return res.status(200).json({
          message: "Payment Confirmed",
        });
      }
      await updateAndFetchData(
        "deposit",
        "UPDATE deposit SET status = ? WHERE id = ?",
        [status, order_number]
      );

      const newAmount = Number(amount) + Number(userBalance.balance);
      await updateAndFetchData(
        "usdt_wallet",
        "UPDATE usdt_wallet SET balance = ? WHERE user_id = ?",
        [newAmount, data.user_id]
      );

      return res.status(200).json({
        message: "Payment Confirmed",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  })();
};

const initializeWithdrawal = async (req, res) => {
  const { amount, currency, wallet_address } = req.body;
  const user_id = req.id;

  if (!amount || !currency || !wallet_address) {
    return res.status(422).json({
      message: "All field is required",
    });
  }

  (async () => {
    try {
      const userBalance = await fetchData("usdt_wallet", "user_id = ?", [
        user_id,
      ]);
      if (userBalance.balance < Number(amount)) {
        return res.status(401).json({
          message: "insufficient fund",
        });
      }

      const params = {
        currency: currency,
        type: "cash_out",
        to: wallet_address,
        amount: amount,
        api_key: process.env.PLISIO_API_KEY,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(
        "https://plisio.net/api/v1/operations/withdraw",
        {
          params,
          config,
        }
      );

      if (response.data.status === "success") {
        let sql = `INSERT INTO withdraw (user_id, amount, currency, wallet_address, status) VALUES (?, ?, ?, ?, ?)`;
        data = await insertAndFetchData("withdraw", sql, [
          user_id,
          amount,
          currency,
          wallet_address,
          "completed",
        ]);
      }

      return res.status(201).json({
        data: response.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  })();
};
module.exports = { initializeDeposit, confirmDeposit, initializeWithdrawal };
