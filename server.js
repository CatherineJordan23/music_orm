const express = require('express');
const {sequelize, Track } = require('./database/setup');

// Create the Express application
const app = express();

// Set the server port
const PORT = process.env.PORT || 3000;

// Middleware to parse JSon request bodies
app.use(express.json());

// Start the server
async function startServer() {
    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection successful!');

        // Start listening for requests
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to database:', error);
        process.exitCode = 1;
    }
}

// GET endpoint to retrieve all tracks
app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await Track.findAll();

        res.status(200).json(tracks);
    } catch (error) {
        
            res.status(500).json({
                message: 'Error retrieving tracks',
                error: error.message
            });
    }
});


// GET endpoint to retrieve a track by ID
app.get('/api/tracks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const track = await Track.findByPk(id);

        // Check if the track exists
        if (!track) {
            return res.status(404).json({
                message: 'Track not found'
            });
        }

        res.status(200).json(track);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving track',
            error: error.message
        });
    }
});

// POST endpoint to create a new track
app.post('/api/tracks', async (req,res) => {
    try {
        const {songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        // Validate required fields
        if (!songTitle || !artistName || !albumName || !genre) {
            return res.status(400).json({
                message: 'Song title, artist name, album name, and genre are required'
            });
        }

        // Create a new track 
        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json({
            message: 'Track created successfully',
            track: newTrack
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating track',
            error: error.message
        });
    }
});

 // PUT endpoint to update an existing track
app.put('/api/tracks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the track exists
        const track = await Track.findByPk(id);

        if (!track) {
            return res.status(404).json({
                message: 'Track not found'
            });
        }

        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        // Update the track
        await Track.update(
            {
                songTitle,
                artistName,
                albumName,
                genre,
                duration,
                releaseYear
            },
            {
                where: { trackId: id }
            }
        );

        // Retrieve the updated track
        const updatedTrack = await Track.findByPk(id);

        res.status(200).json({
            message: 'Track updated successfully',
            track: updatedTrack
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating track',
            error: error.message
        });
    }
});

// DELETE endpoint to remove a track
app.delete('/api/tracks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Delete the track from the database
        const deletedTrack = await Track.destroy({
            where: { trackId: id }
        });

        // Check if the track exists
        if (deletedTrack === 0) {
            return res.status(404).json({
                message: 'Track not found'
            });
        }

        res.status(200).json({
            message: 'Track deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting track',
            error: error.message
        });
    }
});

startServer();