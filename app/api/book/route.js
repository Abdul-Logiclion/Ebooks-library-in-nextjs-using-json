import { readFile, writeFile } from 'fs/promises';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

let jsonString;
let jsonObject;

// Function to read JSON file
async function readJSONFile(filePath) {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        throw new Error(`Error reading JSON file: ${error.message}`);
    }
}

// Function to write JSON file
async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw new Error(`Error writing JSON file: ${error.message}`);
    }
}

// GET Request Handler
export async function GET() {
    try {
        // Read the contents of the JSON file
        const booksData = await readJSONFile('app/api/data/catalog-books.json');

        // Return the books data as JSON response
        return NextResponse.json(booksData);
    } catch (error) {
        console.error('Error getting books data:', error);
        throw new Error('Internal server error');
    }
}

// POST Request Handler
export async function POST(req) {
    try {
        await processStream(req.body); // Process the incoming stream to get JSON object
        const newBook = jsonObject; // Assuming jsonObject is the parsed book object

        // Read existing books data from file
        const booksData = await readJSONFile('app/api/data/catalog-books.json');

        // Generate new ID (assuming ID is auto-incremented)
        const newId = booksData.length + 1;
        newBook.id = newId; // Convert id to string if necessary

        // Add new book to the array
        booksData.push(newBook);

        // Write updated data back to the file
        await writeJSONFile('app/api/data/catalog-books.json', booksData);

        // Return a success message with the new book data
        return NextResponse.json({ message: 'Book added successfully', newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        throw new Error('Internal server error');
    }
}

// DELETE Request Handler
export async function DELETE(req) {
    try {
        await processStream(req.body); // Process the incoming stream to get JSON object
         // Assuming jsonObject has the ID of the book to delete
       const idToDelete=jsonObject;
        // Read existing books data from file
        let booksData = await readJSONFile('app/api/data/catalog-books.json');

        // // Find index of the book to delete
        const indexToDelete = booksData.findIndex(book => book.id === idToDelete);

        if (indexToDelete=== -1) {
            throw new Error(`Book with ID ${idToDelete} not found`);
        }

        // // Remove the book from the array
        const deletedBook = booksData.splice(indexToDelete, 1)[0];

        // // Write updated data back to the file
         await writeJSONFile('app/api/data/catalog-books.json', booksData);

        // Return a success message with the deleted book data
        return NextResponse.json({ message: 'Book deleted successfully',deletedBook});
    } catch (error) {
        console.error('Error deleting book:', error);
        throw new Error('Internal server error');
    }
}

// Function to process incoming stream and parse JSON
async function processStream(readableStream) {
    const reader = readableStream.getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log("Stream has been fully read");
                break;
            }
            console.log("Received chunk of data:", value);
            jsonString = new TextDecoder().decode(value);
            jsonObject = JSON.parse(jsonString);
        }
    } catch (error) {
        console.error("Error reading stream:", error);
    } finally {
        reader.releaseLock();
    }
}
