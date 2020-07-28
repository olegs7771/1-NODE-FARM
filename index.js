const fs = require("fs");
const http = require("http");
const url = require("url");

///FILES
//Blocking Synchronous way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);
// const textOut = ` This about avocado :${text}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

//Non Bloking ---- Asynchronous way to write the file
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error ❗️");
//   console.log("data1", data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log("data2", data2);
//     fs.writeFile(
//       "./txt/final.txt",
//       `${data2}\n${data1}\n 💇 `,
//       "utf-8",
//       (err) => {
//         if (err) throw err;
//         console.log("finished ");
//       }
//     );
//   });
// });
// console.log("will read file 👍 ");

////SERVER
//Read File Json in the Begining Synchroniously only once
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("Hello from the Overview!!");
  } else if (pathName === "/product") {
    fs.readFile(`${__dirname}/templates/product.html`, (err, data) => {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(data);
    });
  } else if (pathName === "/api") {
    //Read File
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
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
