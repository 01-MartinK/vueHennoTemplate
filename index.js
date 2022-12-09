// external library-s
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

// express use cases
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())

const port = 3010

// list typing { id: 0, name: "book-1", extra_value: "aaaah"} no database for now
var templateList = [
    { id: 1, name: "book-1", extraText: "aaaah"},
    { id: 2, name: "book-2", extraText: "aqwrqrtw"},
    { id: 3, name: "book-3", extraText: "shitmonkey"}
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

// get the http post request for a new list
app.post('/templateList/addList', (req, res) => {
    console.log("New list data:");
    console.log(req.body)
    
    templateList.push(req.body)
    
    res.sendStatus(200)
});

// a function for reorganizing the id-s of the lists in the templateLists array
function reorganizeTemplateLists() {
    // gets each element and the list index
    templateList.forEach((element, index) => {
        element.id = index+1 // add one to the index
    })
    // no the index isn't the id
}

// for deleting a list via delete request
app.delete('/templateList/deleteList', (req, res) => {
    console.log("Deletion of list:")
    console.log(templateList[req.body.id-1]);
    
    templateList.splice(req.body.id-1,1) // splice or pretty much delete from start to an end point or just once

    reorganizeTemplateLists()

    res.sendStatus(200)
});

// patch request for updating a single list
app.patch('/templateList/updateList', (req, res) => {
    console.log("Update of list:");
    console.log(req.body)

    // change list to new list
    templateList[req.body.id-1] = req.body

    res.sendStatus(200)
});

// server
server = app.listen(port, () => {
    console.log(`API up at: https://localhost:${port}`);
});

// websocket part
const io = require("socket.io")(server, {cors: {origin: "*"}})

// on socket connection
io.on('connection', socket => {
    console.log("A new socket client has conneted")
});