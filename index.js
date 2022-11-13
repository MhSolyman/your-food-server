const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;
console.log(process.env.DB_USER)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kmh2g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const verfyjwt = (req, res, next) => {
    const authHeader=req.headers.authorization;

    if(!authHeader){
        res.send(401).send({message:'un AUth accsses'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err){
            return res.status(401).send({message:"un AUth accsses"});
        }
        req.decoded=decoded;
        next()
    })

}






const run = async () => {
    try {
        const foodCullection = client.db('food').collection('foods');
        const reviewsCullectio = client.db('review').collection('reviews');

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
            res.send({ token })
        })



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


        app.get('/Addreviews', verfyjwt, async (req, res) => {
            const decoded = req.decoded;
            
            if(decoded.email !==req.query.email){
                res.status(403).send({message:'un auth access'})
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCullectio.find(query);
            const revew = await cursor.toArray()
            res.send(revew)

        })







        app.delete('/Deletereviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCullectio.deleteOne(query);
            res.send(result)

        })

        app.get('/getrev/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCullectio.findOne(query);
            res.send(result)

        })
        app.patch('/editerev/:id', async (req, res) => {
            const { id } = req.params;
            const result = await reviewsCullectio.updateOne({ _id: ObjectId(id) }, { $set: req.body })
            res.send(result)

        })




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
