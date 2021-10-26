require('dotenv').config();
const fetch = require('isomorphic-fetch');
////const jsdom = require('jsdom');
////const { JSDOM } = jsdom;
const puppeteer = require('puppeteer');
const plattItm = require("./db.js").plattItm;

const itterStart = 48823;
const itterEnd = 52181;


const loginUrl = "https://www.platt.com/login.aspx";

/**
 * 
 * @param {puppeteer.page} page page to be queryied 
 * @param {String} selector The selector to be found. 
 */
async function subCategoryList(page, selector) {
  try {
    let list = await page.evaluate((sel) => Array.from(document.querySelectorAll(sel), element => element.textContent), selector);
    return list;
  }
  catch (e) {
    console.log("catch block: " + e);
    return null;
  }
};

function cb(selector, document) {
  return Array.from(document.querySelectorAll(selector), element => element.textContent);
};

/**
 * 
 * @param {puppeteer.page} page The page you are querying
 * @param {String} selector The selector you would like to query.
 * @returns the element.textContent or null if the element does not exist 
 */
 async function getElementOrNull(page, selector) {
  try {
    let el = await page.$eval(selector, el => el.textContent);
    return el;
  }
  catch {
    console.log("caught error: no selector- " + selector + " found.");
    return null;
  }
};

/**
 * 
 * @param {puppeteer.page} page The page you are querying
 * @param {String} selector The selector you would like to query.
 * @returns the string of the image link or null if the element does not exist 
 */
async function getImgLinkOrNull(page, selector) {
  try {
    let el = await page.$eval(selector, el => el.src);
    return el;
  }
  catch {
    console.log("caught error: no selector- " + selector + " found.");
    return null;
  }
};

/**
  *
  * @param {puppeteer.page} page
  *
  */
async function parsePagePlatt(page) {
    try {
        if (!await getElementOrNull(page, ".ProductID"))
        {
          return null;
        }
        const plattObj = {
            headline: await getElementOrNull(page, ".lblProdHeadline"),
            category: await getElementOrNull(page,".crumbSecond > a > span"),
            subCategorys: await subCategoryList(page, ".crumbOther a span"),
            manufacturer: await getElementOrNull(page, ".ManLink > a"),
            price: await getElementOrNull(page, ".ProductPrice"),
            detailDescription: await getElementOrNull(page, "#lblDetailDes"),
            plattItemId: await getElementOrNull(page,".ProductID"),
            date_updated: new Date(),
            img_link: await getImgLinkOrNull(page, "#ctl00_ctl00_MainContent_uxProduct_CatalogItemImage"),
            alsoKnownAs: await getElementOrNull(page, "#ctl00_ctl00_MainContent_uxProduct_lblSEOAlsoKnow")
        }
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

async function log_in_platt() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(loginUrl);
  await page.type("#ctl00_ctl00_MainContent_uxLogin_uxLogin_AccountNumber", process.env.PLATT_ACC_NUM);
  await page.type("#ctl00_ctl00_MainContent_uxLogin_uxLogin_Username", process.env.PLATT_USER);
  await page.type("#ctl00_ctl00_MainContent_uxLogin_uxLogin_Password", process.env.PLATT_PASS);
  await page.click("#ctl00_ctl00_MainContent_uxLogin_uxLogin_LoginButton");
  await page.waitForNavigation();
  const cookies = await page.cookies();
  const loggedInPage = await browser.newPage();
  await loggedInPage.setCookie(...cookies);
  return loggedInPage;
}

module.exports = async function() {
    //let urls = ['https://www.platt.com/search.aspx?q=1438434', 'https://www.platt.com/search.aspx?q=0052181', 'https://www.platt.com/search.aspx?q=867023', 'https://www.platt.com/search.aspx?q=0572325'];
    const page = await log_in_platt();
    try {
        for (i = itterStart; i < itterEnd; i++) {
            console.log("your url:" + getUrl(i));
            var url = getUrl(i);
            try {
              await page.goto(url);
            }
            catch (e) {
              console.log("error orrcued going to a page. Message: " + e);
            }
            try {
                let plattObj = await parsePagePlatt(page);
                if (plattObj) {
                  console.log("adding item to db");
                  console.log(plattObj);
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

