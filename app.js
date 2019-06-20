const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost/userList',
    { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    age: { type: Number, min: 18, max: 70 },
});
const user = mongoose.model('userCollection', userSchema);

class UserService {
    constructor() {
        this.userArray = [];
    }

    addUser(user) {
        this.userArray.push(user)
        stream.write(`added: ${JSON.stringify(user)}\n`);
    }

    getUser(id) {
        return this.userArray.find((user) => user.id == id);
    }

    editUser(user) {
        let currentUser = this.getUser(user.id);
        currentUser.fName = user.fName
        currentUser.fLame = user.fLame
        currentUser.age = user.age
        currentUser.email = user.email
    }

    deleteUser(id) {
        let currentUser = this.userArray.find((user) => user.id == id);
        let currentUserIndex = this.userArray.findIndex((user) => user === currentUser);
        this.userArray.splice(currentUserIndex, 1)
    }
}

let userService = new UserService();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('createUser')
});
app.get('/userList', (req, res) => {
    res.render('userListing', {
        userArray: userService.userArray
    })
});
app.get('/user/edit/:id', (req, res) => {
    let userToEdit = userService.getUser(req.params.id)
    res.render('editUser', { editUser: userToEdit })
});

app.post('/createUser', (req, res) => {
    const newUser = new user();
    newUser.fName = req.body.fName
    newUser.lName = req.body.lName 
    newUser.email = req.body.email
    newUser.age = req.body.age
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.redirect('/userList')
    });
    
});

app.post('/editUser/:id', (req, res) => {
    let currentUser = req.body;
    currentUser.id = req.params.id;
    userService.editUser(currentUser)
    res.redirect('/userList')
});

app.post('/deleteUser/:id', (req, res) => {
    userService.deleteUser(req.params.id)
    res.redirect('/userList')
});


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});
