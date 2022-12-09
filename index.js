// external library-s
const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { dirname } = require('path');

// express use cases
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())

const port = 3010

// list typing { id: 0, name: "book-1", extra_value: "aaaah"}
var templateList = [
    { id: 1, name: "book-1", extra_value: "aaaah"},
    { id: 2, name: "book-2", extra_value: "aqwrqrtw"},
    { id: 3, name: "book-3", extra_value: "shitmonkey"}
]

// credentials for logging in
const credentials = [
    {id: 1, username: "Admin", email: "admin@usage.com", password: "qwerty", isAdmin: true, ip: ""},
    {id: 2, username: "Kevin", email: "kevin@usage.com", password: "kevin", isAdmin: false, ip: ""},
    {id: 3, username: "Andres", email: "andres@usage.com", password: "andres", isAdmin: false, ip: ""}
]

// for testing server lag
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

// for rendering the page
app.get('/', (req, res) => {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.setHeader('content-type', 'text/html');
        res.send(html)
    });

})

// send the template list
app.get('/templateList', (req, res) => {
    res.send(templateList)
});

// send a single list from the template list
app.get('/templateList/:id', (req, res) => {
    res.send(templateList[req.params.id])
});

server = app.listen(port, () => {
    console.log(`API up at: https://localhost:${port}`);
});

// websocket part
const io = require("socket.io")(server, {cors: {origin: "*"}})

io.on('connection', socket => {
    console.log("A new socket client has conneted")
})