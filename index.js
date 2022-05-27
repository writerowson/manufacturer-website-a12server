const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000
// use middleware
app.use(cors())
app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.ti8fd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        // to connect mongo
        await client.connect();
        console.log('all connected');
        const toolCollection = client.db("assignment12").collection("tools");
        const orderCollection = client.db("assignment12").collection("orders");
        // to get all tools data
        app.get('/tools', async (req, res) => {
            const query = {}
            // cursor for multiple item
            const cursor = toolCollection.find(query)
            const tools = await cursor.toArray()
            res.send(tools)

        })
        // to get single tool data
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            // to find one  use findONE
            const tool = await toolCollection.findOne(query)
            console.log(tool);
            res.send(tool)

        })
        // to add new order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })




    }
    finally {

    }
}

//  Api naming convention
// *app.get('/booking) get all booking or get plural booking
// *app.get('/booking/:id) get a specific booking
// *app.post('/booking) add a new booking
// *app.delete ('/booking/:id) get a specific booking delete
// *app.put('/booking/:id)upsert =update (if exists)/insert(if doesn't)
// *app.patch('/booking/:id) update booking
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Running my assignment')
})

app.listen(port, () => {
    console.log(' server is running')
})
