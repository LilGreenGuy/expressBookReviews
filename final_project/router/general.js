const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Get the book list available in the shop
// public_users.get('/', async function (req, res) {
//     res.send(JSON.stringify(books, null, 4))
// });

const bookPromise = new Promise((resolve, reject) => {
    resolve(books)
})

public_users.get('/', async function (req, res) {
    await bookPromise.then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
    )
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const bookISBN = req.params.isbn
//     if(!books[bookISBN]) {
//         return res.status(400).json({message: "Please enter a valid number!"})
//     }
//     res.send(books[bookISBN]);
// });

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn
    bookPromise.then(
        (book) => res.send(book[isbn]),
        (error) => res.send(error)
    )
    if(!books[isbn]) {
        return res.status(400).json({message: "Please enter a valid number!"})
    }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
    // let answer = [];
    // for(let book in books) {
    //     if(books[book].author === req.params.author) {
    //         answer.push(books[book]);
    //     }
    // }
    // res.send(answer);
// });

public_users.get('/author/:author', function (req, res) {
    let answer = [];
    for(let book in books) {
        if(books[book].author === req.params.author) {
            answer.push(books[book]);
        }
    }    
    if(answer.length == 0){
        return res.status(300).json({message: "Title not found"});
    }
    res.send(answer);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here 
    let answer = [];
    for(let book in books) {
        if(books[book].title === req.params.title) {
            answer.push(books[book]);
        }
    }
    if(answer.length == 0){
        return res.status(300).json({message: "Title not found"});
    }
    res.send(answer);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookISBN = req.params.isbn
    if(!bookISBN) {
        return res.status(400).json({message: "Please enter a valid number!"})
    }
    res.send(books[bookISBN].reviews)
});

module.exports.general = public_users;


// let books = {
//     1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
//     2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
//     3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
//     4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
//     5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
//     6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
//     7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
//     8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
//     9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
//     10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
// }
