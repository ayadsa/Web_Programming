const fs = require("fs");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/res', express.static(path.join(__dirname, '../../res')));
app.use('/img', express.static(path.join(__dirname, '../../img')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ayad2003',
    database: 'console_shop'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Apply the checkAuth middleware to all routes except for login and register
app.use((req, res, next) => {
    if (req.path === '/login.html') {
        next();
    } else {
        checkAuth(req, res, next);
    }
});

app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    } else {
        res.redirect('/login.html');
    }
});

app.get('/user', (req, res) => {
    if (req.session.loggedin) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ error: "Not authorized" });
    }
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (err, result) => {
            if (err) throw err;
            res.redirect('/login.html');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userId = results[0].id; // Save user ID in session
                    res.redirect('/');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
            });
        } else {
            res.send('Incorrect Username and/or Password!');
        }
    });
});

app.post('/wishlist', (req, res) => {
    if (req.session.loggedin) {
        const { product_id } = req.body;
        const userId = req.session.userId;
        const sql = 'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)';
        db.query(sql, [userId, product_id], (err, result) => {
            if (err) throw err;
            res.send('Product added to wishlist.');
        });
    } else {
        res.send('Please login to add items to your wishlist.');
    }
});

app.get('/wishlist', (req, res) => {
    if (req.session.loggedin) {
        const userId = req.session.userId;
        const sql = 'SELECT * FROM wishlist WHERE user_id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.send('Please login to view your wishlist.');
    }
});
app.post('/cart', (req, res) => {
    if (req.session.loggedin) {
        const { product_id, quantity } = req.body;
        const userId = req.session.userId;
        const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
        db.query(sql, [userId, product_id, quantity], (err, result) => {
            if (err) throw err;
            res.send('Product added to cart.');
        });
    } else {
        res.send('Please login to add items to your cart.');
    }
});

app.get('/cart', (req, res) => {
    if (req.session.loggedin) {
        const userId = req.session.userId;
        const sql = 'SELECT * FROM cart WHERE user_id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.send('Please login to view your cart.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.post("/order-confirmed", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    fs.writeFileSync('../../res/db.json', JSON.stringify(request.body, null, '\t'));
    response.send('Order confirmed');
});

app.listen(3000, () => {
    console.log('Server is working');
});