const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');

// Configure Express Handlebars
app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Route Handler
app.get('/', async (req, res) => {
    try {
        // Get the database
        let database = await dbo.getDatabase();
        const collection = database.collection('books');
        const cursor = collection.find({});
        
        // Convert cursor to array and await the result
        let employees = await cursor.toArray();
        
        let message = '';
        res.render('main', { message, employees });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred');
    }
});

// Start the server
app.listen(8000, () => {
    console.log('Listening on port 8000');
});
