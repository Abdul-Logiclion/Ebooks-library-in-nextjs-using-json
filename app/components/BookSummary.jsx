// components/BookSummary.jsx
"use client"
import { useEffect, useState } from 'react';

export default function BookSummary() {

  
  const [summary, setSummary] = useState([]);
  useEffect(() => {
  
    async function fetchSummary() {
      try {
          const response = await fetch('/api/summaries'); // Using relative URL for Next.js API route
          if (!response.ok) {
              throw new Error('Failed to fetch summary data');
          }
          console.log("response")
          const data = await response.json();

          
          setSummary(data); // Return data fetched from API
      } catch (error) {
          console.error('Error fetching summary data:', error);
          throw error; // Re-throw error to handle it in the caller function or component
      }
  }
    fetchSummary();
  }, []);




  return (
    <table>
      <thead>
        <tr>
          <th >Author Name</th>
          <th>No Of Books</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(summary).map(([authorName, bookCount]) => (
          <tr key={authorName}>
            <td>{authorName}</td>
            <td>{bookCount}</td>
          </tr>
        ))}
        

      </tbody>
    </table>
  );
}
