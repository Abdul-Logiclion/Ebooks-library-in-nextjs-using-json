// lib/booksRepo.js

import path from 'path';
import fs from 'fs-extra';

class BooksRepo {
    constructor() {
        this.booksFilePath = path.join(process.cwd(), 'app/data/catalog-books.json');
    }

    async getBooks() {
        return await fs.readJSON(this.booksFilePath);
    }

    async getBook(bookName) {
        if (!bookName || typeof bookName !== 'string') {
            throw new Error("Invalid book name");
        }
        const books = await this.getBooks();
        return books.find(book => book.title.toLowerCase().includes(bookName.toLowerCase()));
    }

    async addBook(book) {
        if (!book || typeof book !== 'object' || !book.title || !book.isbn) {
            throw new Error("Invalid book object");
        }
        const books = await this.getBooks();
        const maxId = books.reduce((max, b) => b.id > max ? b.id : max, 0);
        book.id = maxId + 1; // Assign the next available integer ID
        books.push(book);
        await this.saveBooks(books);
        return book;
    }

    async updateBook(isbn, updatedBook) {
        if (!isbn || typeof isbn !== 'string') {
            throw new Error("Invalid ISBN");
        }
        if (!updatedBook || typeof updatedBook !== 'object') {
            throw new Error("Invalid book data");
        }
        const books = await this.getBooks();
        const index = books.findIndex(book => book.isbn === isbn);
        if (index !== -1) {
            books[index] = { ...books[index], ...updatedBook };
            await this.saveBooks(books);
            return books[index];
        }
        throw new Error('Book not found');
    }

    async deleteBook(isbn) {
        if (!isbn || typeof isbn !== 'string') {
            throw new Error("Invalid ISBN");
        }
        const books = await this.getBooks();
        const index = books.findIndex(book => book.isbn === isbn);
        if (index !== -1) {
            books.splice(index, 1);
            await this.saveBooks(books);
            return true;
        }
        throw new Error('Book not found');
    }

    async getBooksByPageCount(pageCount) {
        if (!Number.isInteger(pageCount)) {
            throw new Error("Invalid page count");
        }
        const books = await this.getBooks();
        return books.filter(book => book.pageCount >= pageCount);
    }

    async getBooksByAuthor(authorName) {
        if (!authorName || typeof authorName !== 'string') {
            throw new Error("Invalid author name");
        }
        const books = await this.getBooks();
        return books.filter(book => book.authors.some(author => author.toLowerCase().includes(authorName.toLowerCase())));
    }

    async getBookByISBN(isbn) {
        if (!isbn || typeof isbn !== 'string') {
            throw new Error("Invalid ISBN");
        }
        const books = await this.getBooks();
        const book = books.find(book => book.isbn === isbn);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }

    async getBooksByCategory(bookCategory) {
        if (!bookCategory || typeof bookCategory !== 'string') {
            throw new Error("Invalid book category");
        }
        const books = await this.getBooks();
        return books.filter(book => book.categories.some(category => category.toLowerCase().includes(bookCategory.toLowerCase())));
    }

    async getBooksSummary() {
        const summary = {};
        const books = await this.getBooks();
        books.forEach(book => {
            book.authors.forEach(author => {
                summary[author] = (summary[author] || 0) + 1;
            });
        });
        return summary;
    }

    async saveBooks(books) {
        await fs.writeJSON(this.booksFilePath, books, { spaces: 2 });
        return books;
    }

    async cleanBooks() {
        const books = await this.getBooks();
        const cleanBooks = books.filter(book => book.shortDescription && book.shortDescription.length > 10);
        await this.saveBooks(cleanBooks);
    }
}

export default new BooksRepo();
