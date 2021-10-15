// get the html in plain text
// parse through the html grabbing the specific items you want
const fetch = require('isomorphic-fetch');
const jsdom = require('jsdom');
const {JSDOM } = jsdom;

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
    let catList = "";
    let firstIt = true;
    list.forEach(element => {
        if (firstIt) {
            catList += element.textContent;
            firstIt = false;
        }
        else {
            catList += ", " + element.textContent;
        }
    });
    return catList;
};

/**
  * 
  * @param {String} page - the html in plain text to be parsed
  *
  */
async function parsePagePlatt(page) {
    try {
        const {document} = await new JSDOM(page).window;
        const product = {
            
            headline: document.querySelector(".lblProdHeadline").textContent,
            category: document.querySelector(".crumbSecond span").textContent,
            subCategorys: subCategoryList(document.querySelectorAll(".crumbOther span")),
            manufacturer: document.querySelector(".ManLink a").textContent,
            price: document.querySelector(".ProductPrice") ? document.querySelector(".ProductPrice").textContent : "na",
            detailDescription: document.querySelector("#lblDetailDes").textContent,
            plattItemId: document.querySelector(".ProductID").textContent,
        }
        console.log(product);
        return product;
    }
    catch (e){
        console.log("An error orccured: " + e + "in ");
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
        for (i = 1438438; i < 1438439 + 1; i++) {
            console.log("your url:" + getUrl(i));
            var url = getUrl(i);
            const page = await getPage(url);
            try {
                parsePagePlatt(page);
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