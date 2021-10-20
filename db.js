require('dotenv').config();
const mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});



function doesrowExist(platt_id) {
  let sql = "SELECT id FROM platt_products WHERE platt_id=?;";
  pool.query(sql, platt_id, (err, result) => {
    if (result) {
      return true;
    }
    else {
      return false;
    }
  });
};

/**
* @param {object} plattObj should be a plattObj created by parsePagePlatt function.
*/
function addPlattitm(plattObj) {
  console.log(plattObj.subCategorys.length);
  let sql = "INSERT INTO platt_products (platt_id, headline, category, sub_category_one, sub_category_two, sub_category_three, manufacturer, price, description, date_updated) VALUES(?,?,?,?,?,?,?,?,?,?);";
  pool.query(sql, [
    plattObj.plattItemId,
    plattObj.headline,
    plattObj.category,
    plattObj.subCategorys.length >= 1 ? platt.subCategorys[0] : null,
    plattObj.subCategorys.length >= 2 ? platt.subCategory[1] : null,
    plattObj.subCategorys.length >= 3 ? platt.subCategory[2] : null,
    plattObj.manufacturer,
    plattObj.price,
    plattObj.description,
    plattObj.date_updated
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
  });
};

function updatePlattitm(plattObj) {
  let sql = "UPDATE platt_products SET headline=?, manufacturer=?, price=?, description=?, date_updated=? WHERE platt_id=?;";
  pool.query(sql, [plattObj.headline,
    plattObj.manufacturer,
    plattObj.price,
    plattObj.description,
    plattObj.date_updated,
    plattObj.plattItemId],
  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
};

function plattItm(plattObj) {
  if (doesrowExist(plattObj.plattItemId)) {
    updatePlattItm(plattObj);
  }
  else {
    addPlattitm(plattObj);
  }
}

exports.plattItm = plattItm;
