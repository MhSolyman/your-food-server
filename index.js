const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;





const uri = "mongodb+srv://MhSolyman:S1yZIov9LhidqeAZ@cluster0.kmh2g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });









const run = async () => {
    try {
        const foodCullection = client.db('food').collection('foods');
        app.get('/food', async(req, res) => {
            const query = {};
            const cursor= foodCullection.find(query)
            const food = await cursor.toArray();
            res.send(food)
        })

    }
    finally {

    }

}
run().catch(error => console.log(error));







app.listen(port, () => {
    console.log(`Server is runnig port no ${port}`)
})