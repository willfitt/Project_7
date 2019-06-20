const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const fs = require('fs');
let userId = 1
let stream = fs.createWriteStream('userList.log');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class User {
    constructor(id, fName, lName, email, age) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.age = age;
    }
}

class UserService {
    constructor() {
        this.userArray = [];
    }

    addUser(user) {
        this.userArray.push(user)
        stream.write(`added: ${JSON.stringify(user)}\n`);
    }

    getUser(id){
        return this.userArray.find((user) => user.id == id);
    }

    editUser(user){
        let currentUser = this.getUser(user.id);
        currentUser.fName = user.fName
        currentUser.fLame = user.fLame
        currentUser.age = user.Age
        currentUser.email = user.Email
    }
    
    deleteUser(id){
        let currentUser = this.userArray.find((user) => user.id == id);
        let currentUserIndex = this.userArray.findIndex((user) => user === currentUser );
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
    res.render('userListing', {userArray: userService.userArray,
                               editRedirect: userService.editUser})
});
app.get('/user/edit/:id', (req, res) => {
    let userToEdit = userService.getUser(req.params.id)
    res.render('editUser', {editUser: userToEdit})
});

app.post('/createUser', (req, res) => {
    const newUser = new User(userId++, req.body.fName, req.body.lName, req.body.Email, req.body.Age)
    userService.addUser(newUser)
    res.redirect('/userList')
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
