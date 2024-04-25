import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define route for /api/books/summary
app.get('/api/books/summary', async (req, res) => {
    try {
        // Read the contents of the JSON file
        const jsonData = await fs.readFile('app/data/catalog-books.json', 'utf-8');
        const booksData = JSON.parse(jsonData);

        // Count the number of books for each author
        const authorBookCounts = {};
        for (const book of booksData) {
            const authors = book.authors;
            for (const author of authors) {
                if (author in authorBookCounts) {
                    authorBookCounts[author]++;
                } else {
                    authorBookCounts[author] = 1;
                }
            }
        }

        // Send the author book counts as JSON response
        res.json(authorBookCounts);
    } catch (error) {
        console.error('Error getting summary data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
