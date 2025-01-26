import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Ensure token exists
    if (!token) {
      setErrorMessage('You are not authorized. Please log in.');
      return;
    }

    axios
      .get('http://localhost:3434/entries', {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      })
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to fetch entries.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Ensure token exists
    if (!token) {
      setErrorMessage('You are not authorized. Please log in.');
      return;
    }

    axios
      .post(
        'http://localhost:3434/entries',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token in headers
        }
      )
      .then((response) => {
        setEntries([...entries, response.data.entry]);
        setTitle('');
        setContent('');
        setErrorMessage(''); // Clear any error messages
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to add entry.');
      });
  };

  return (
    <div>
      <h1>Diary Entries</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Entry</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {entries.map((entry) => (
        <div key={entry.id}>
          <h2>{entry.title}</h2>
          <p>{entry.content}</p>
          <small>{entry.created_at}</small>
        </div>
      ))}
    </div>
  );
};

export default DiaryEntries;
