const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MONGO CONNECTION
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASs}@cluster0.buwtdfy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeesCollection = client.db('coffeeDB').collection('coffees');

    // GET ALL COFFEES
    app.get('/coffees', async (req, res) => {
      const data = await coffeesCollection.find().toArray();
      res.send(data);
    });

    // GET ONE COFFEE BY ID
    app.get('/coffees/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const coffee = await coffeesCollection.findOne(query);
        res.send(coffee);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    // ADD NEW COFFEE
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    });

    // UPDATE COFFEE (PATCH)
    app.patch('/coffees/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedCoffee = req.body;

        const updateDoc = {
          $set: updatedCoffee
        };

        const result = await coffeesCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    // DELETE COFFEE
    app.delete('/coffees/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeesCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

  } finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Coffee server is rifat...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
