import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Read the contents of the JSON file

        // Read the contents of the JSON file
        const jsonData = await fs.readFile('app/api/data/catalog-books.json', 'utf-8');
        const data = JSON.parse(jsonData);
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

        // Return the author book counts directly
        return NextResponse.json(authorBookCounts)
    } catch (error) {
        console.error('Error getting summary data:', error);
        throw new Error('Internal server error'); // Throw error to be caught by the handler function
    }
  
}