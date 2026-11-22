const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Create a connection to the SQLite database
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
    logging: false
});

// Define the Track model
const Track = sequelize.define('Track', {
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER
    },
    releaseYear: {
        type: DataTypes.INTEGER
    }
});

// Create the database and tables
async function setupDatabase() {
    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection successful!');

        // Create the tables based on the models
        await sequelize.sync();
        console.log('Database tables created successfully!');
    } catch (error) {
        console.error('Unable to set up database:', error);
        process.exitCode = 1;
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the database setup

if (require.main === module) {
    setupDatabase();
}

// Export the database connection and model
module.exports = { sequelize, Track };