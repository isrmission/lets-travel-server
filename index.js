const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ttsi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('lets-travel');
        const servicesCollection = database.collection('popularTours');
        const newsCollection = database.collection('latestNews')
        const Pending = database.collection('pendingBooking')

        // GET Services Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/pending', async (req, res) => {
            const booking = Pending.find();
            const pServices = await booking.toArray();
            res.send(pServices);
        });
        app.get('/latestNews', async (req, res) => {
            const cursor = newsCollection.find();
            const newses = await cursor.toArray();
            res.send(newses);
        });

        // Get Single Service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        app.get('/pending/:email', async (req, res) => {
            const email = req.params.email;
            // console.log('getting service', id);
            const query2 = { email: email };
            const myorders = await Pending.find(query2).toArray();
            res.json(myorders);
        });


        app.post('/pending', async (req, res) => {
            const newBook = req.body;
            // console.log('hitting post', req.body)
            const regUser = await Pending.insertOne(newBook)
            res.json(regUser)
        });

        app.post('/services', async (req, res) => {
            const newService = req.body;
            // console.log('hitting post', newService);
            const regUser = await servicesCollection.insertOne(newService)
            res.json(regUser)
        });

        // Delete item

        app.delete('/pending/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await Pending.deleteOne(query);
            res.json(result);

        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})