const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

////SERVER

//Read File Json in the Begining Synchroniously only once
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//ROUTES
const server = http.createServer((req, res) => {
  console.log("req.url", req.url);
  //Create Slugs array for URL names
  const slugs = dataObj.map((obj) => slugify(obj.productName, { lower: true }));
  console.log("slugs", slugs);
  const { query, pathname } = url.parse(req.url, true);
  console.log("query", query);
  console.log("pathname", pathname);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    //Create template temp card
    const cardHtml = dataObj
      .map((obj) => replaceTemplate(tempCard, obj))
      .join("");
    // console.log("tempCard", tempCard);
    // console.log("cardHtml", cardHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    //Create Product template with data from data.json
    const product = dataObj[query.id];
    console.log("product", product);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API page
  } else if (pathname === "/api") {
    //Read File
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
    //NO page 404
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world ",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000 ");
});
