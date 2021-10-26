require('dotenv').config();
const mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});



async function doesrowExist(platt_id) {
  let sql = "SELECT id FROM platt_products WHERE platt_id=?;";
  result=pool.query(sql, platt_id, (err, result) => {
    console.log("result here: " + result);
    if (result) {
      console.log("true");
      return true;
    }
    else {
      console.log("false");
      return false;
    }
  });
};

/**
* @param {object} plattObj should be a plattObj created by parsePagePlatt function.
*/
function addPlattitm(plattObj) {
  console.log("New platt item being added.");
  let sql = "INSERT INTO platt_products (platt_id, headline, category, sub_category_one, sub_category_two, sub_category_three, manufacturer, price, description, date_updated, img_link, also_known_as) VALUES(?,?,?,?,?,?,?,?,?,?,?,?);";
  pool.query(sql, [
    plattObj.plattItemId,
    plattObj.headline,
    plattObj.category,
    plattObj.subCategorys.length >= 1 ? plattObj.subCategorys[0] : null,
    plattObj.subCategorys.length >= 2 ? plattObj.subCategorys[1] : null,
    plattObj.subCategorys.length >= 3 ? plattObj.subCategorys[2] : null,
    plattObj.manufacturer,
    plattObj.price,
    plattObj.detailDescription.length < 1020 ? plattObj.detailDescription : plattObj.detailDescription.substring(0, 1020) ,
    plattObj.date_updated,
    plattObj.img_link,
    plattObj.alsoKnownAs
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
  });
};

function updatePlattItm(plattObj) {
  console.log("Updating platt item.");
  let sql = "UPDATE platt_products SET headline=?, manufacturer=?, price=?, description=?, date_updated=?, img_link=?, also_known_as=? WHERE platt_id=?;";
  pool.query(sql, [plattObj.headline,
    plattObj.manufacturer,
    plattObj.price,
    plattObj.detailDescription,
    plattObj.date_updated,
    plattObj.img_link,
    plattObj.alsoKnownAs,
    plattObj.plattItemId],
  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
};

function plattItm(plattObj) {
  let sql = "SELECT id FROM platt_products WHERE platt_id=?;";
  result=pool.query(sql, plattObj.plattItemId, (err, result) => {
    console.log(result);
    if (result.length >= 1) {
      console.log("updating existing platt product");
      updatePlattItm(plattObj);
    }
    else {
      console.log("adding new platt pdoruct");
      addPlattitm(plattObj);
    }
  });
}

exports.plattItm = plattItm;
