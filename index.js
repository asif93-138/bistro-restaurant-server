const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const testData = require('./testData.json');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://bistro-boss-restaurant:M0xGh2h2eURQgdni@cluster0.iuweya4.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("restaurantDB");
    const addedCart = database.collection("addedCart");
    const menu = database.collection("menu");
    const paymentC = database.collection("payment");
    const contactC = database.collection("contact");
    app.get('/menu', async(req, res) => {
      const cursor = menu.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/cart', async(req, res) => {
      const cart = req.body;
      console.log('cart :', cart);
      const result = await addedCart.insertOne(cart);
      res.send(result);
    })
    app.get('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { user: id };
      const cursor = addedCart.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedCart.deleteOne(query);
      res.send(result);
    })
    app.post('/payment', async(req, res) => {
      const payment = req.body;
      console.log('payment :', payment);
      const result = await paymentC.insertOne(payment);
      res.send(result);
    })
    app.get('/payment/:id', async(req, res) => {
      const id = req.params.id;
      const query = { user: id };
      const cursor = paymentC.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    app.delete('/payment/:id', async(req, res) => {
      const id = req.params.id;
      const query = { user: id };
      const result = await addedCart.deleteMany(query);
      res.send(result);
    })
    app.post('/contact', async(req, res) => {
      const contactObj = req.body;
      const result = await contactC.insertOne(contactObj);
      res.send(result);
    })
    app.get('/orders', async(req, res) => {
      const cursor = addedCart.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/payments', async(req, res) => {
      const cursor = paymentC.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/messages', async(req, res) => {
      const cursor = contactC.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1>')
})

app.get('/test', (req, res) => {
  res.send(testData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
