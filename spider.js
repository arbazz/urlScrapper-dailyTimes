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
    console.log("total urls ->", listItems.length);
    // Use .each method to loop through the li we selected
    listItems.each(async(idx, el) => {
      // Object holding data for each country/jurisdiction

      // Select the text content of a and span elements
      // Store the textcontent in the above object
      name = $(el).children("header").children("h2").children("a").attr()?.href;
      console.log(name);
      if (name?.length) {
        // urls.push(name);
        await fs.appendFileSync("urls.csv", `${name},\n`);
      }
      // Populate countries array with country data
    });
    console.log("current index -> ", String(current));
    const newUrl = `${base}page/${current + 1}/`;
    console.log(newUrl);
    if (name?.length && current < 2500) {
      await fs.writeFileSync("test.txt", String(current));
      scrapeData(newUrl);
      current++;
    } else {
      // writeToFile();
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

const allUrl = [
  "https://dailytimes.com.pk/946469/shc-orders-police-to-register-missing-persons-cases/",
  "https://dailytimes.com.pk/946473/1st-batch-of-chinese-emergency-humanitarian-medicine-aid-arrives-in-sri-lanka/",
  "https://dailytimes.com.pk/946468/oxford-pakistan-programme-launched-for-students-academics/",
  "https://dailytimes.com.pk/946465/queens-platinum-juilee-pia-reschedules-saturdays-birmingham-bound-flight-for-monday/",
  "https://dailytimes.com.pk/946460/govt-tasks-isi-with-vetting-role-of-government-officials/",
  "https://dailytimes.com.pk/946452/gwadar-east-bay-express-project-to-enhance-regional-connectivity-minister/",
  "https://dailytimes.com.pk/946451/pti-govt-miserably-failed-to-accomplish-any-project-in-gwadar/",
  "https://dailytimes.com.pk/946435/president-strongly-condemns-killing-of-ten-kashmiri-youth/",
  "https://dailytimes.com.pk/946439/fia-seeks-court-order-for-arresting-both-shahbaz-and-hamza-in-money-laundering-case/",
  "https://dailytimes.com.pk/946427/no-monkeypox-cases-in-pakistan-so-far-virus-is-less-contagious-than-smallpox-nih-experts/",
];

const g = [];

const scrapeUrls = async () => {
  for (let i = 0; i < allUrl.length; i++) {
    console.log("current index is ", i);
    const { data } = await axios.get(allUrl[i]);
    const $ = cheerio.load(data);
    const title = $(".entry-title").html();
    console.log("news -> ", title);
    const headerElem = $(".entry-content");
    const nw1 = headerElem.children("p").html();
    let nw1Text = nw1.split("</noscript>");
    if (nw1Text?.length) {
      nw1Text = nw1Text[1];
    } else {
      nw1Text = "";
    }
    g.push({ title, desc: nw1Text, author: "" });
  }
  writeToFileToNews();
};

// scrapeUrls();

const writeToFileToNews = () => {
  // Write countries array in countries.json file
  fs.writeFile("newsGood.json", JSON.stringify(g, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Successfully written data to file");
  });
};
