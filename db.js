const mongoose = require('mongoose');

async function getDatabase() {
    try {
        await mongoose.connect('mongodb+srv://swethadurai2115:s18NYjZgV5EFqPCX@cluster0.2d9dz.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected');
        return mongoose.connection; // Ensure you're returning the connection
    } catch (error) {
        console.log('Connection error:', error);
        throw error; // Rethrow the error for handling in your route
    }
}

module.exports = {
    getDatabase,
    ObjectID: mongoose.Types.ObjectId
};
