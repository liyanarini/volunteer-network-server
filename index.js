const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://volunteer:volunteerNetwork99@cluster0.r8riy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const port = 5000
const pass = "volunteerNetwork99"

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello volunteers!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const tasksCollection = client.db("volunteerTask").collection("tasks");
  const usersCollection = client.db("volunteerTask").collection("registeredUsers");


  app.get('/tasks', (req,res) => {
    tasksCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
})

app.get('/task/:key', (req,res) => {
    console.log(req.params.key)
    tasksCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      console.log(documents)
        res.send(documents)
    })
})

app.get('/allUsers' , (req, res) => {
  usersCollection.find({})
  .toArray((err, documents) => {
    res.send(documents)
  })
})

app.post('/regUser' , (req, res) => {
  const user = req.body
  usersCollection.insertOne(user)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
});

app.get('/regUser/:email', (req,res) => {
  usersCollection.find({email: req.params.email})
  .toArray( (err, documents) => {
      res.send(documents)
  })
})

app.delete('/delete/:id', (req, res) => {
  usersCollection.deleteOne({_id: ObjectId( req.params.id)})
  .then(result => {
    console.log(result)
    res.send(result.deletedCount > 0);
  })
})

});


app.listen(port);