const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());


const uri =
  "mongodb+srv://siddiqaiub:CJlvXPQ219fMQoVq@cluster0.gjnzlrq.mongodb.net/?retryWrites=true&w=majority";

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

    const productsCollection = client.db("productsDB").collection("products");

    app.post("/addProduct", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
    
      res.send(result);
    });

    app.get("/products",async(req,res)=>{
      const cursor = productsCollection.find()
      const result = await cursor.toArray()
      console.log('kk',result)
      res.send(result)
    })

    app.delete('/products/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.deleteOne(query)
      res.send(result)
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
  res.send("server running");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
