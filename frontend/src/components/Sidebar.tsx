import React from 'react';
import './Sidebar.css';

const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'TV Movie',
  'Thriller',
  'War',
  'Western',
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h2>Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre} className="sidebar-genre-item">
            {genre}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
