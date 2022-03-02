const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const signin = require('./control/signin');
const register = require('./control/register');
const id = require('./control/id');
const image = require('./control/image');
const Clarifai = require('clarifai')

const apps =  new Clarifai.App({
  apiKey: 'ee1f3a82979c413fa9fc7551e27a31b8'
 });




const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123',
    database : 'smart-brain'
  }
});

const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!


app.get('/', (req, res)=> {
  res.send("IT IS WORKING");
})

app.post('/signin', (req,res) => {signin.signin(req,res,db,bcrypt)})

app.post('/register', (req,res) => {register.register(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=>{id.id(req,res,db,bcrypt)})

app.put('/image', (req,res)=> {image.image(req,res,db,bcrypt)})

app.post('/imageurl', (req,res) => {
  const {input} = req.body
 apps.models
 .predict(
   Clarifai.FACE_DETECT_MODEL,
   input).then((data) => {
     res.json(data)
   })
})


app.listen(3000, ()=> {
  console.log(`app is running on port ${3000}`);
})
