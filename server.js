const express = require("express");
const app = express();
const morgan = require("morgan");
const methodOverride = require("method-override");

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const Fruit = require("./models/fruit.js");

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride("_method")); 


// app.get('/', (req, res) => {
//     res.send('I am dumb');
// });


app.put('fruits/new', (req, res) => {
  res.render('fruits/new.ejs')
})

app.put('/fruits/:fruitId', async (req,res) => {
  if (req.body.isReadyToEat === "on") { 
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body, {new: true});
  res.redirect('/fruits')
});

app.get('fruits/:fruitId/edit', (req,res) => {
  res.render('/fruits/edit.ejs');
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get('/fruits/:fruitId', async (req,res) => {
  const foundFruits = await Fruit.findById(req.params.fruitId)
  res.render('fruits/edit.ejs', {
    fruit: foundFruits
  });


app.delete('/fruits/:fruitId', async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect('/fruits');
});






// app.get('/fruits/new', (res,req) => {
  //     res.send('This route presents the user with a form to add a new fruit');
  // })
  
  
  app.post("/fruits", async (req, res) => {
    console.log(req.body);
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect('/fruits');
  });
  
  //GET ./fruits/new - This route presents the user with a form to add a new fruit
  app.get("/fruits", async (req, res) => {
    const foundFruits = await Fruit.find();
    res.send(foundFruits);
  });

  app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
  });
  
  app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    console.log(allFruits);
    res.send("Welcome to index page");
  });

app.get('/fruits', async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render('fruits/home.ejs')
});

mongoose.connection.on("connected", () => {
  console.log(`MongoDB ${mongoose.connection.name} connected`);
});

app.listen(3000, () => {
  console.log("server 3000 started")
});