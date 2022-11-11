const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;
console.log(process.env.DB_USER)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kmh2g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });









const run = async () => {
    try {
        const foodCullection = client.db('food').collection('foods');
        const reviewsCullectio = client.db('review').collection('reviews');
        app.get('/food', async (req, res) => {
            const query = {};
            const cursor = foodCullection.find(query).limit(3)
            const food = await cursor.toArray();
            res.send(food)
        })


        app.get('/food/services', async (req, res) => {
            const query = {};
            const cursor = foodCullection.find(query)
            const food = await cursor.toArray();
            res.send(food)
        })

        app.get('/food/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const foods = await foodCullection.findOne(query)
            res.send(foods)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCullectio.insertOne(review);
            res.send(result)

        })
        app.post('/food/services', async (req, res) => {
            const review = req.body;
            const result = await foodCullection.insertOne(review);
            res.send(result)

        })
        app.get('/reviews', async (req, res) => {

            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }

            const cursor = reviewsCullectio.find(query);
            const revew = await cursor.toArray()
            res.send(revew)

        }
        )


        app.get('/Addreviews', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewsCullectio.find(query);
            const revew = await cursor.toArray()
            res.send(revew)

        }
        )




    }
    finally {

    }

}
run().catch(error => console.log(error));




app.get('/', (req, res) => {
    res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
})


app.listen(port, () => {
    console.log(`Server is runnig port no ${port}`)
})
