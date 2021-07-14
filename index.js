var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njdea.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// parse application/json
app.use(bodyParser.json())

app.use(cors())



client.connect(err => {
  
     const collection = client.db("vlounteer-work").collection("events");
     console.log('Datbase connected');

     const regDataCollection = client.db("vlounteer").collection("registerData");
     const diffrentUserCollection = client.db("vlounteer").collection("diffrentUser");
     app.post('/regData', (req, res) =>{
       regDataCollection.insertOne(req.body)
       .then(result => {
         res.send(result.insertedCount > 0)
       })
     })
     app.get('/regis', (req, res) =>{
      regDataCollection.find({})
      .toArray((err, documents) =>{
        res.send(documents)
      })
    })
    app.get('/regis/:email', (req, res) =>{
      console.log(req.query.email)
      regDataCollection.find({email: req.query.email})
      .toArray((err, documents) =>{
        res.send(documents)
      })
    })
  //  diffrentUserCollection-----------------------------------------------------------
  app.post('/diffrent', (req, res) =>{
    diffrentUserCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/diffrentUser', (req, res) =>{
    diffrentUserCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
    
// collection database section----------------------------------------------------------
     app.post('/addEvent', (req, res) =>{
       collection.insertOne(req.body)
       .then(result =>{
         res.send(result.insertedCount > 0)
         console.log('Insert successfully');
       })
     })
    
     app.get('/events', (req, res) =>{
       collection.find({})
       .toArray((err, documents) =>{
         res.send(documents)
       })
     })
     app.get('/find/:id', (req, res) => {
      collection.find({_id: ObjectID(req.params.id)})
      .toArray((err, documents) => {
        res.send(documents[0])
      })
    })
    
  });
  


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT || 4002, () => console.log('Listening from port 4002'))