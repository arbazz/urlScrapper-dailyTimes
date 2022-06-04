// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const base = "https://dailytimes.com.pk/tag/latest/";
let current = 1;
// Async function which scrapes the data
const urls = [];
async function scrapeData(url) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $("#genesis-content article");
    let name = "";
    // Stores data for all countries
    console.log("total urls ->",listItems.length);
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction

      // Select the text content of a and span elements
      // Store the textcontent in the above object
      name = $(el)
        .children("header")
        .children("h2")
        .children("a")
        .attr()?.href;
        console.log(name);
        if (name?.length) {
          urls.push(name);
        }
        // Populate countries array with country data
      });
      console.log("current index -> ",String(current));
      const newUrl = `${base}page/${current + 1}/`;
      console.log(newUrl);
    if(name?.length && current < 2500){
      await fs.writeFileSync('test.txt', String(current))
      scrapeData(newUrl);
      current++;
    }else{
      writeToFile();
    }
    // Logs countries array to the console
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData(base);

const writeToFile = () => {
  // Write countries array in countries.json file
  fs.writeFile("urls.json", JSON.stringify(urls, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Successfully written data to file");
  });
};
