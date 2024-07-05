'use client'
 
import React, { useState, useEffect } from 'react';
import '@/public/css/book-form.css';
import '@/public/css/cards.css';
import '@/public/css/styles.css';

import { useRouter} from 'next/navigation'

export default function MainContent() {
  const router = useRouter();

  async function handleUpdateBook(book) {
    try {
      

       router.push(`/addbook?param1=${JSON.stringify(book)}`);
    } catch (error) {
      console.error('Error redirecting:', error);
    }
  }

  const [books, setBooks] = useState([]);
  const [originalBooks, setOriginalBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [datalistOptions, setDatalistOptions] = useState([]);
  const [expandedBookIsbn, setExpandedBookIsbn] = useState(null); // State to track expanded book ISBN
          
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/book');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const books = await response.json();
        setBooks(books);
        setOriginalBooks(books);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  async function handleBookSearch(event) {
    event.preventDefault();
    if (!searchValue || !searchCriteria) return;
    const filteredBooks = filterBooks(searchCriteria, searchValue);
    setBooks(filteredBooks);
  }

  function filterBooks(criteria, value) {
    switch (criteria) {
      case 'name':
        return originalBooks.filter(book => book.title.toLowerCase().includes(value.toLowerCase()));
      case 'category':
        return originalBooks.filter(book => book.categories.some(cat => cat.toLowerCase().includes(value.toLowerCase())));
      case 'author':
        return originalBooks.filter(book => book.authors.some(auth => auth.toLowerCase().includes(value.toLowerCase())));
      case 'isbn':
        return originalBooks.filter(book => book.isbn === value);
      case 'pageCount':
        return originalBooks.filter(book => book.pageCount >= parseInt(value, 10));
      default:
        return originalBooks;
    }
  }

  async function loadDatalistValues(filter) {
    try {
      let options = [];
      switch (filter) {
        case 'name':
          options = originalBooks.map(book => book.title);
          break;
        case 'category':
          const categories = originalBooks.flatMap(book => book.categories.map(cat => cat.toLowerCase()));
          options = Array.from(new Set(categories));
          break;
        case 'author':
          const authors = originalBooks.flatMap(book => book.authors.map(auth => auth.toLowerCase()));
          options = Array.from(new Set(authors));
          break;
        case 'isbn':
          options = originalBooks.map(book => book.isbn);
          break;
        default:
          options = originalBooks.map(book => `ISBN: ${book.isbn} - Title: ${book.title}`);
      }
      setDatalistOptions(options);
    } catch (error) {
      console.error('Failed to load datalist values:', error);
      setDatalistOptions([]);
    }
  }

  function handleLoadListValues(criteria) {
    setSearchCriteria(criteria);
    setSearchValue('');
    loadDatalistValues(criteria);
  }

  function book2HTMLCard(book) {
    return (
      <li className="cards__item" key={book.isbn}>
        <div className="card">
          <img className="card__image" src={book.thumbnailUrl} alt="" />
          <div className="card__content">
            <div id="book-title" className="card__title">{book.title}</div>
            <p id="book-desc" className="card__text">
              {book.shortDescription ? book.shortDescription.trim() : 'Not Available'}
            </p>
            {/* Toggleable long description */}
            {expandedBookIsbn === book.isbn && (
              <p className="card__long-desc">
                {book.longDescription ? book.longDescription.trim() : 'Long description not available'}
              </p>
            )}
            <div className="btn--options">
              <button className="btn btn--details" onClick={() => handleShowBookDetails(book.isbn)}>
                {expandedBookIsbn === book.isbn ? 'Hide Details' : 'Show Details'}
              </button>

              <button className="btn btn--update" onClick={() => handleUpdateBook(book)} >Update</button>
             
              <button className="btn btn--delete" onClick={() => handleDeleteBook(book.id)}>Delete</button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  async function handleShowBookDetails(isbn) {
    try {
      // Logic to fetch book details (if needed)
      // For now, just toggle expanded state
      setExpandedBookIsbn(isbn === expandedBookIsbn ? null : isbn);
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    }
  }

  async function handleDeleteBook(id)
  {
    const response=await fetch('api/book',{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      const res=await response.json()
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      console.log(res)
    
  }

  
  return (
    <>
      <main>
        <div id="main-content">
          <form id="search-form" onSubmit={handleBookSearch}>
            <div id="book-filters">
              <h3>Select Search Criteria</h3>
              <div id="search-options">
                {['category', 'name', 'author', 'isbn', 'pageCount'].map((option) => (
                  <div className="form-group" key={option}>
                    <input
                      type="radio"
                      id={option}
                      name="search"
                      onClick={() => handleLoadListValues(option)}
                      defaultChecked={searchCriteria === option}
                    />
                    <label htmlFor={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
                  </div>
                ))}
              </div>
              <input
                list="list"
                name="searchValue"
                placeholder="Select a search criteria"
                id="search-box"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <datalist id="list">
                {datalistOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
              <button type="submit" id="search-btn">Search</button>
            </div>
          </form>
          <div className="books-table" />
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <ul id="book-cards" className="cards">
              {books.map(book => book2HTMLCard(book))}
            </ul>
          )}
        </div>
      </main>
      <footer />
    </>
  );
}
