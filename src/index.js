const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const { template } = require('handlebars');
const templatePath = path.join(__dirname, '../templates')
const collection = require('./mongodb')

app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', templatePath)
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render("login")
})


app.get('/signup', (req, res) => {
  res.render("signup")
})

app.post("/signup",async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }

  await collection.insertMany([data])
res.render("home", {
  name: data.name,
  email: data.email
})
  

})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;


  if (email === "admin@example.com" && password === "admin123") {
    const allUsers = await collection.find({});
    return res.render("admin", { users: allUsers });
  }

  try {
    const check = await collection.findOne({ email, password });

    if (check) {
      res.render("home", {
        name: check.name,
        email: check.email
      });
    } else {
      res.render("login", { error: "Invalid email or password" });
    }
  } catch (err) {
    res.render("login", { error: "Something went wrong. Try again." });
  }
});

app.listen(3000, () => {
  console.log('port connected');
});