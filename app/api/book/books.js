import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define route for /api/books
app.get('/api/book/books', async (req, res) => {
    try {
        // Read the contents of the JSON file
        const jsonData = await fs.readFile('app/data/catalog-books.json', 'utf-8');
        const booksData = JSON.parse(jsonData);

        // Send the books data as JSON response
        res.json(booksData);
    } catch (error) {
        console.error('Error getting books data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
