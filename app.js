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

const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    age: Number,
});

const user = mongoose.model('userCollection', userSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('createUser')
});
app.get('/userList', (req, res) => {
     mongoose.model('userCollection').find( function (err, users) {
        if (err) return handleError(err);
        res.render('userListing', {
            userArray: users
        })
      })    
});
app.get('/user/edit/:id', (req, res) => {
    mongoose.model('userCollection').findById(req.params.id, function(err, user) {
        if (err) return handleError(err);
        res.render('editUser', { editUser: user })
    })
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
    mongoose.model('userCollection').findOneAndUpdate(
        req.params.id, { fName: req.body.fName, lName: req.body.lName, age: req.body.age, email: req.body.email }, function (err){
            if (err) return handleError(err);
            res.redirect('/userList')
        });

});

app.post('/deleteUser/:id', (req, res) => {
    mongoose.model('userCollection').deleteOne({ _id: req.params.id}, function (err){
        if (err) return handleError(err);
        res.redirect('/userList')
      });
});


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});