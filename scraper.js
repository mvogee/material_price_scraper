const fetch = require('isomorphic-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const plattItm = require("./db.js").plattItm;
const itterStart = 1;
const itterEnd = 52181;

/**
  *
  * @param {String} url - the url to be fetched from
  *
  */
async function getPage(url) {
    // use fetch and get a url
    const response = await fetch(url);
    const text = await response.text();

    return (text);
};

function subCategoryList(list) {
    let catList = [];
    list.forEach(element => {
      catList.push(element.textContent);
    });
    return catList;
};

function elementTextorNull(element) {
  if (element) {
    return element.textContent;
  }
  else {
    return null;
  }
}

/**
  *
  * @param {String} page - the html in plain text to be parsed
  *
  */
async function parsePagePlatt(page) {
    try {
        const {document} = await new JSDOM(page).window;
        if (!document.querySelector(".ProductID")) {
          return null;
        }
        const plattObj = {
            headline: elementTextorNull(document.querySelector(".lblProdHeadline")),
            category: elementTextorNull(document.querySelector(".crumbSecond span")),
            subCategorys: subCategoryList(document.querySelectorAll(".crumbOther span")),
            manufacturer: elementTextorNull(document.querySelector(".ManLink a")),
            price: elementTextorNull(document.querySelector(".ProductPrice")),
            detailDescription: elementTextorNull(document.querySelector("#lblDetailDes")),
            plattItemId: elementTextorNull(document.querySelector(".ProductID")),
            date_updated: new Date()
        }
        console.log(plattObj);
        return plattObj;
    }
    catch (e){
        console.log("An error orccured: " + e + "in ");
        return null;
    }
};

function getUrl(i) {
    let baseurl = 'https://www.platt.com/search.aspx?q=';
    let prodNum = ("" + i).padStart(7, '0');
    return (baseurl + prodNum);
};

module.exports = async function() {
    // run the scraping here
    //let urls = ['https://www.platt.com/search.aspx?q=1438434', 'https://www.platt.com/search.aspx?q=0052181', 'https://www.platt.com/search.aspx?q=867023', 'https://www.platt.com/search.aspx?q=0572325'];
    try {
        for (i = itterStart; i < itterEnd; i++) {
            console.log("your url:" + getUrl(i));
            var url = getUrl(i);
            const page = await getPage(url);
            try {
                let plattObj = await parsePagePlatt(page);
                if (plattObj) {
                  plattItm(plattObj);
                }
                else {
                  console.log(url + " is not a product");
                }
            }
            catch (e) {
                console.log("something went wrong on url:" + url + ": error message: " + e)
            }
        }
    }
    catch (e) {
        console.log("something went wrong on url:" + url + ": error message: " + e);
    }
};

