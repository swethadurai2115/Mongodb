const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const db = require('./db');
const { ObjectId } = require('mongoose').Types; // Ensure this is correct

// Configure Express Handlebars
app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyparser.urlencoded({ extended: true }));

// Call getDatabase once at the start
(async () => {
    try {
        await db.getDatabase();
        console.log('Database connection established.');
    } catch (error) {
        console.error('Initial connection error:', error);
        process.exit(1); // Exit if there's an error
    }
})();

// Route Handler
app.get('/', async (req, res) => {
    try {
        // Get the database
        const database = await db.getDatabase(); // Corrected to use db
        const collection = database.collection('books');
        const cursor = collection.find({});
        
        // Convert cursor to array and await the result
        let books = await cursor.toArray();
        
        let message = '';
        let edit_id, edit_book;

        if (req.query.edit_id) {
            edit_id = req.query.edit_id;
            edit_book = await collection.findOne({ _id: ObjectId(edit_id) });
        }
        if (req.query.delete_id) {
            await collection.deleteOne({ _id: ObjectId(req.query.delete_id) });
            return res.redirect('/?status=3');
        }

        switch (req.query.status) {
            case '1':
                message = 'Inserted Successfully!';
                break;
            case '2':
                message = 'Updated Successfully!';
                break;
            case '3':
                message = 'Deleted Successfully!';
                break;
            default:
                break;
        }
        res.render('main', { message, books, edit_id, edit_book });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred');
    }
});

app.post('/store_book', async (req, res) => {
    try {
        const database = await db.getDatabase(); // Corrected to use db
        const collection = database.collection('books');
        let book = { title: req.body.title, author: req.body.author };
        await collection.insertOne(book);
        return res.redirect('/?status=1');
    } catch (error) {
        console.error('Error storing book:', error);
        res.status(500).send('An error occurred while storing the book.');
    }
});

app.post('/update_book/:edit_id', async (req, res) => {
    try {
        const database = await db.getDatabase(); // Corrected to use db
        const collection = database.collection('books');
        let book = { title: req.body.title, author: req.body.author };
        let edit_id = req.params.edit_id;

        await collection.updateOne({ _id: ObjectId(edit_id) }, { $set: book });
        return res.redirect('/?status=2');
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('An error occurred while updating the book.');
    }
});

// Start the server
app.listen(8000, () => {
    console.log('Listening on port 8000');
});
