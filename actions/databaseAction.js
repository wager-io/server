const { connection } = require("../database/index");

// this is for creating and fetching of data from the database
async function insertAndFetchData(table, query, key) {
  try {
    const insertResult = await new Promise((resolve, reject) => {
      connection.query(query, [...key], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const insertedRowId = insertResult.insertId;
    const selectSql = `SELECT * FROM ${table} WHERE id = ?`;
    const selectResult = await new Promise((resolve, reject) => {
      connection.query(selectSql, [insertedRowId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const data = selectResult[0];

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// this is for updating and fetching of data from the database
async function updateAndFetchData(table, updateQuery, key) {
  try {
    await new Promise((resolve, reject) => {
      connection.query(updateQuery, [...key], (err, updateResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(updateResult);
        }
      });
    });
    const selectSql = `SELECT * FROM ${table} WHERE id = ?`;
    const selectResult = await new Promise((resolve, reject) => {
      connection.query(selectSql, [...key], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const updatedData = selectResult[0];

    return updatedData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// this is for fetching of data from the database
async function fetchData(table, condition, params) {
  try {
    const selectSql = `SELECT * FROM ${table} WHERE ${condition}`;
    const selectResult = await new Promise((resolve, reject) => {
      connection.query(selectSql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const data = selectResult[0];
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

// this is for deleting data from the database
async function deleteData(table, condition, params) {
  try {
    const deleteSql = `DELETE FROM ${table} WHERE ${condition}`;
    await new Promise((resolve, reject) => {
      connection.query(deleteSql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return "Data deleted successfully";
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  insertAndFetchData,
  updateAndFetchData,
  fetchData,
  deleteData,
};
