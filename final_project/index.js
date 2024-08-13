const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// app.use("/friends", function auth(req, res, next) {
//     // Check if user is logged in and has valid access token
//     if (req.session.authorization) {
//         let token = req.session.authorization['accessToken'];
//         // Verify JWT token
//         jwt.verify(token, "access", (err, user) => {
//             if (!err) {
//                 req.user = user;
//                 next(); // Proceed to the next middleware
//             } else {
//                 return res.status(403).json({ message: "User not authenticated" });
//             }
//         });
//     } else {
//         return res.status(403).json({ message: "User not logged in" });
//     }
// });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
