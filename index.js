const fs = require("fs");
const http = require("http");
const url = require("url");

////SERVER
const replaceTemplate = (temp, product) => {
  console.log("product.productName", product.productName);

  // let output;
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

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

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //Overview page
  if (pathName === "/" || pathName === "/overview") {
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
  } else if (pathName === "/product") {
    fs.readFile(`${__dirname}/templates/product.html`, (err, data) => {
      res.writeHead(200, {
        "Content-type": "text/html",
      });

      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(tempProduct);
    });

    //API page
  } else if (pathName === "/api") {
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
