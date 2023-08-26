const express = require("express");
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const app = express();

const accessTokenSecret = "somerandomaccesstoken";

app.use(bodyParser.json());

//! Up here in authenticate we pick out the authorization header. Then it prints it out. And we get the JSON web token and split it. Then we are passing this token into the "verify" and providing it the accessToken. So what jwt.verify is going to recreate the signature from the header and payload. And its going to compare that with the actual signature of the JSON web token. And then if its verified then its going to pass us on the next part of the route. In the below function its the next() function passing it on to next route. next is also being passed in as an argument. The user is being passed in the request. Which is an object that contained the username and password. Then looking at below, if we all through with the GET request, then the books are sent back. However for the POST, we don't allow just anyone to add a book, we take a look at the {role} of the user. If the role is not admin, then we sent back the error 403 Forbidden. If it gets through because it is admin, then we allow the new book to be pushed on the array of books with the success message.
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const books = [
  {
    author: "Chinua Achebe",
    country: "Nigeria",
    language: "English",
    pages: 209,
    title: "Things Fall Apart",
    year: 1958,
  },
  {
    author: "Hans Christian Andersen",
    country: "Denmark",
    language: "Danish",
    pages: 784,
    title: "Fairy tales",
    year: 1836,
  },
  {
    author: "Dante Alighieri",
    country: "Italy",
    language: "Italian",
    pages: 928,
    title: "The Divine Comedy",
    year: 1315,
  },
];

// ! Below are took API routes. One is /books and is a get. The other is a POST. Both of them have authenticateJWT middleware, that between answering the request and sending back the books, we need to authenticate first. This is what will be looking at our JSON web token.

// middleware authentication
app.get("/books", authenticateJWT, (req, res) => {
  res.json(books);
});

app.post("/books", authenticateJWT, (req, res) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.sendStatus(403);
  }

  const book = req.body;
  books.push(book);

  res.send("book added successfully");
});

app.listen(4000, () => {
  console.log("Books service started on port 4000");
});
