const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

const bookPromise = new Promise((resolve, reject) => {
    resolve(books)
})

// Task 1
// public_users.get('/', async function (req, res) {
//     res.send(JSON.stringify(books, null, 4))
// });


// Task 10
public_users.get('/', async function (req, res) {
    await bookPromise.then(
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) => res.send(error)
    )
});

// Task 2
// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const bookISBN = req.params.isbn
//     if(!books[bookISBN]) {
//         return res.status(400).json({message: "Please enter a valid number!"})
//     }
//     res.send(books[bookISBN]);
// });


// Task 11
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn
    bookPromise.then(
        (book) => res.send(book[isbn]),
        (error) => res.send(error)
    )
    if (!books[isbn]) {
        return res.status(400).json({ message: "Please enter a valid number!" })
    }
});

// Task 3
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     let answer = [];
//     for(let book in books) {
//         if(books[book].author === req.params.author) {
//             answer.push(books[book]);
//         }
//     }
// if(answer.length == 0){
//     return res.status(300).json({message: "Author not found!"});
// }
//     res.send(answer);
// });


// Task 12
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author
    let answer = [];
    await bookPromise.then((book) => {
        for (let isbn in book) {
            if (books[isbn].author === author) {
                answer.push(books[isbn]);
            }
        }
    }).then((success) => {
        if (answer.length === 0) {
            return res.status(300).json({ message: "Author not found!" })
        } else {
            return res.send(answer)
        }
    });
});

// Task 4
// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here 
//     for(let book in books) {
//         if(books[book].title === req.params.title) {
//             return res.send(books[book])
//         }
//     }
//         return res.status(300).json({message: "Title not found!"});
// });


// Task 13
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title
    await bookPromise.then((books) => {
        for (let isbn in books) {
            if (books[isbn].title === title) {
                return res.send(books[isbn])
            }
        }
        return res.status(300).json({ message: "Title not found!" });
    })
});

// Task 5
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookISBN = req.params.isbn
    if (!bookISBN) {
        return res.status(400).json({ message: "Please enter a valid number!" })
    }
    res.send(books[bookISBN].reviews)
});

module.exports.general = public_users;
