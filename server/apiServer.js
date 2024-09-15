const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({extended: true}));
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://akshaybenny:Admin%40123@coit20269.4un2j.mongodb.net/?retryWrites=true&w=majority&ssl=true";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// Global for general use
var userCollection;
var orderCollection;

// Asynchronous function to connect to MongoDB and then start the server
const startServer = async () => {
    try {
        await client.connect();
        userCollection = client.db("giftdelivery").collection("users");
        orderCollection = client.db("giftdelivery").collection("orders");
        console.log('Database connected successfully!\n');

        // Start Express.js server
        app.listen(port, () => {
            console.log(`Gift Delivery server app listening at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit if connection fails
    }
};

// Start the server only after a successful MongoDB connection
startServer();


app.get('/', (req, res) => {
    res.send('<h3>Welcome to Gift Delivery server app!</h3>')
});


app.get('/getUserDataTest', (req, res) => {

    console.log("GET request received\n");

    userCollection.find({}, {projection: {_id: 0}}).toArray(function (err, docs) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log(JSON.stringify(docs) + " have been retrieved.\n");
            res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>");
        }

    });

});


app.get('/getOrderDataTest', (req, res) => {

    console.log("GET request received\n");

    orderCollection.find({}, {projection: {_id: 0}}).toArray(function (err, docs) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log(JSON.stringify(docs) + " have been retrieved.\n");
            res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>");
        }

    });

});

app.get('/getPastOrders', (req, res) => {

    console.log("GET request received\n");
    let email = req.query.email;
    orderCollection.find({customerEmail: email}, {projection: {_id: 0}}).toArray(function (err, docs) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log(JSON.stringify(docs) + " have been retrieved.\n");
            res.status(200).send(docs);
        }

    });

});


app.post('/verifyUser', (req, res) => {

    console.log("POST request received : " + JSON.stringify(req.body) + "\n");

    loginData = req.body;

    userCollection.find({email: loginData.email, password: loginData.password}, {projection: {_id: 0}}).toArray(function (err, docs) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log(JSON.stringify(docs) + " have been retrieved.\n");
            res.status(200).send(docs);
        }

    });

});


app.post('/postOrderData', function (req, res) {

    console.log("POST request received : " + JSON.stringify(req.body) + "\n");

    orderCollection.insertOne(req.body, function (err, result) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log("Order record with ID " + result.insertedId + " have been inserted\n");
            res.status(200).send(result);
        }

    });

});

app.post('/addUser', function (req, res) {

    console.log("USER post request received : " + JSON.stringify(req.body) + "\n");

    userCollection.insertOne(req.body, function (err, result) {
        if (err) {
            console.log("Some error.. " + err + "\n");
            res.send(err);
        } else {
            console.log("User record with ID " + result.insertedId + " have been inserted\n");
            res.status(200).send(result);
        }

    });
});

app.post('/deleteUserOrders', (req, res) => {

    var orderNos = req.body.orderNo;
    console.log("Some error.. " + orderNos);
    orderCollection.deleteMany({orderNo: {$in: orderNos}}, function (err, result) {

        if (err)
            console.log(err);
        else {
            var numberOfUserOrders = result.deletedCount;
            numberOfUserOrders = numberOfUserOrders + (numberOfUserOrders === 1 ? ' order' : ' orders') + ' deleted</p>';
            res.send({"msg": numberOfUserOrders});
        }
    });
});

