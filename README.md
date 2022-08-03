# material_price_scraper
Material price scraper to collect material and pricing data from supplier websites.


- Web pages are scraped sequentially by itterating product id's in the url.
- Log in and page context management is handled using puppeteer.
- Currently only scrapes from one supplier however future plans are to add more.
- Scrapes product image, description, price, manufacturer ,product number, category and sub categorys, and trade names.
- Scrapes at a rate of roughtly 3 web pages per second or 180 per minute depending on server request response times.
*Proof of concept. This project has not been optimized.*
