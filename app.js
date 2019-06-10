const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
let userObject = [{ id: '1', name: 'bob', email: 'bob@bob.com', age: '10' },
                  { id: '2', name: 'joe', email: 'joe@joe.com', age: '20' },
                  { id: '3', name: 'mike', email: 'mike@mike.com', age: '30' }]
let userId = 1;

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index')
});
app.use(express.urlencoded({ extended: false }));

app.get('/form', (req, res) => {
    res.render('form')
});

// app.post()

app.get('/edit/:userName', (req, res) => {
    res.render('edit')
});

app.get('/users', (req, res) => {
    res.render('users', { users: userObject })
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})