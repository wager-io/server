const mysql = require('mysql2');
 
const connection = mysql.createConnection({
  host: 'us-cluster-east-01.k8s.cleardb.net',
  user: 'b62b1133392c37',
  password: '551c27e9',
  database: 'heroku_4f93c29d1cee251'
});

// connection.connect((error, result) => {
//   if (error) {console.log(error)};
//   console.log('Connected to MySQL database!');
// });

module.exports = { connection }