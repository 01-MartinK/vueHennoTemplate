// external library-s
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// express use cases
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cors())

const port = 3010

// sessions
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay , isAdmin: false},
    resave: false 
}));

var session;

// list typing { id: 0, name: "book-1", extra_value: "aaaah"} no database for now
var templateList = [
    { id: 1, name: "book-1", extraText: "aaaah"},
    { id: 2, name: "book-2", extraText: "aqwrqrtw"},
    { id: 3, name: "book-3", extraText: "shitmonkey"}
]

// for the websocket part
var listPositions = [
    {pos: 5, id: '1'}
]

// credentials for logging in
const credentials = [
    {id: 1, username: "Admin", email: "admin@usage.com", password: "qwerty", isAdmin: true, ip: ""},
    {id: 2, username: "Kevin", email: "kevin@usage.com", password: "kevin", isAdmin: true, ip: ""},
    {id: 3, username: "Andres", email: "andres@usage.com", password: "andres", isAdmin: true, ip: ""}
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

app.get('/loginTest', (req, res) => {
    session=req.session
    if(session.userid) {
        res.send(credentials.find((element) => element.username === session.userid).isAdmin)
    }
})

// post a user to check if it exists and if it should be logged in
app.post('/user', (req, res) => {
    let user = credentials.find((element) => element.username === req.body.username) // get the user with the username if there isn't one then it returns an undefined
    if (user) { // check if user is undefined || if it is undefined that means it doesn't exist
        if (req.body.password == user.password) {
            session=req.session; // set session
            session.userid=req.body.username // give the session a userid in this case the username
            //console.log(req.session)
            res.send(user.isAdmin) // OK status code
        } 
    }else {
        res.sendStatus(401) // not authenticated statusCode
    }
})

// logout request
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.sendStatus(200)
});

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

app.post('/positionList/change', (req, res) => {
    console.log(req.body)
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
    //console.log("A new socket client has conneted")
    io.emit('update_cells', listPositions)
    
    socket.on("cell_changed", cell => { // when cell changed
        //console.log(cell)

        if (!listPositions.find(element => element.id === cell.id))
            listPositions.push(cell);
        else
            listPositions.find(element => element.id === cell.id).pos = cell.pos;

        io.emit('update_cells', listPositions)
    })
});