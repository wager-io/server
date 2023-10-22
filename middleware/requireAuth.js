const jwt = require("jsonwebtoken");
const { connection } = require("../database/index");

const requireAuth = async (req, res, next) => {
  const SECRET = `highscoretechBringwexsingthebestamoung23498hx93`;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  } else {
    const token = authorization.split(" ")[1];
    try {
      const { _id } = jwt.verify(token, SECRET);
      let query = `SELECT * FROM users  WHERE user_id = "${_id}"`;
      connection.query(query, async function (error, data) {
        if (data.length !== 0) {
          setTimeout(() => {
            req.id = data[0].user_id;
            next();
          }, 100);
        } else {
          return res
            .status(401)
            .json({ error: "Authorization token not found" });
        }
      });
    } catch (error) {
      res.status(404).json({ error: "Request not authorized" });
    }
  }
};

module.exports = requireAuth;