const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// FoodsDb
// kJOjp9oEoc9TKffq

const uri =
  "mongodb+srv://FoodsDb:kJOjp9oEoc9TKffq@cluster0.akcxiur.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const db = client.db("model-db");
    // const modelCollection = db.collection("models");
    // const downloadCollection = db.collection("downloads");

    const db = client.db("FoodsDb");
    const foodsCollection = db.collection("AllFoods");
    const addFoodCollection = db.collection('AddFoods')

    //     app.get("/models", async (req, res) => {
    //   const result = await modelCollection.find().toArray();
    //   res.send(result);
    // });

    app.get('/allFoods', async(req, res) =>{
        const result = await foodsCollection.find().toArray();
        res.send(result);
    })

    app.get('/featuredFoods', async(req, res) =>{
        const result = await foodsCollection.find().sort({food_quantity: 1}).limit(6).toArray();
        res.send(result);
    })

    app.post('/allFoods', async(req, res) => {
        const foodItem = req.body;
        const result = await foodsCollection.insertOne(foodItem)
        res.send(result);
    })
    
    app.get('/addFoods', async(req, res) =>{
      const result = await addFoodCollection.find().toArray();
      res.send(result);
    })
    app.post('/addFoods', async(req, res) =>{
      const newFood = req.body;
      const result = await addFoodCollection.insertOne(newFood)
      res.send(result);
    })

    app.get('/food/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await foodsCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
