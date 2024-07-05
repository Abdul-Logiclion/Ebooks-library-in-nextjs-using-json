import React, { useState, useEffect } from 'react';
import '@/public/css/book-form.css';
import {useSearchParams } from 'next/navigation';

export default function BookEditor() {
    const params = useSearchParams();
    const search = params.get('param1');
    const bookData = JSON.parse(search);

    // Initialize state variables with data from the bookData object
    const [title, setTitle] = useState(bookData?.title || '');
    const [isbn, setIsbn] = useState(bookData?.isbn || '');
    const [pageCount, setPageCount] = useState(bookData?.pageCount || '');
    const [publishedDate, setPublishedDate] = useState(bookData?.publishedDate || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(bookData?.thumbnailUrl || '');
    const [shortDescription, setShortDescription] = useState(bookData?.shortDescription || '');
    const [longDescription, setLongDescription] = useState(bookData?.longDescription || '');
    const [status, setStatus] = useState(bookData?.status || 'PUBLISH');
    const [authors, setAuthors] = useState(bookData?.authors ? bookData.authors.join(', ') : '');
    const [categories, setCategories] = useState(bookData?.categories ? bookData.categories.join(', ') : '');


    const handleAddBook = async (event) => {
        event.preventDefault();

        // Construct bookData object from current state variables
        const bookData = {
            title,
            isbn,
            pageCount: parseInt(pageCount, 10), // Ensure pageCount is an integer
            publishedDate,
            thumbnailUrl,
            shortDescription,
            longDescription,
            status,
            authors: authors.split(',').map(author => author.trim()),
            categories: categories.split(',').map(category => category.trim())
        };

        // Send book data to server
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('Book added successfully!');
            // Clear form fields after successful submission
            setTitle('');
            setIsbn('');
            setPageCount('');
            setPublishedDate('');
            setThumbnailUrl('');
            setShortDescription('');
            setLongDescription('');
            setStatus('PUBLISH');
            setAuthors('');
            setCategories('');

            // Redirect to another page after successful submission if needed
           // Replace with your desired path
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book. Please try again.');
        }
    };

    return (
        <>
            <br />
            <h1 align="center" id="page-title">
                Add Book
            </h1>
            <form id="book-editor-form" onSubmit={handleAddBook}>
                {/* Form fields */}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        type="text"
                        className="form-control"
                        name="isbn"
                        id="isbn"
                        required
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pageCount">Page Count</label>
                    <input
                        type="number"
                        className="form-control"
                        name="pageCount"
                        id="pageCount"
                        required
                        value={pageCount}
                        onChange={(e) => setPageCount(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="publishedDate">Published Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="publishedDate"
                        id="publishedDate"
                        required
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="thumbnailUrl">Thumbnail URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="thumbnailUrl"
                        id="thumbnailUrl"
                        required
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shortDescription">Short Description</label>
                    <textarea
                        className="form-control"
                        name="shortDescription"
                        id="shortDescription"
                        required
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="longDescription">Long Description</label>
                    <textarea
                        className="form-control"
                        name="longDescription"
                        id="longDescription"
                        required
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        className="form-control"
                        name="status"
                        id="status"
                        required
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="PUBLISH">Publish</option>
                        <option value="DRAFT">Draft</option>
                        <option value="REVIEW">Review</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="authors">Authors (comma-separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="authors"
                        id="authors"
                        required
                        value={authors}
                        onChange={(e) => setAuthors(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categories">Categories (comma-separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="categories"
                        id="categories"
                        required
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                    />
                </div>

                {/* Submit button */}
                <div className="form-group">
                    <input type="submit" className="btn" value="Add Book" />
                </div>
            </form>
        </>
    );
}
