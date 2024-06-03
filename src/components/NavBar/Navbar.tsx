// src/components/NavBar/NavBar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  onSearch: (query: string) => void;
  onSort: (sort: "asc" | "desc") => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onSort }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchInput);
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSort(event.target.value as "asc" | "desc");
  };

  return (
    <nav className="navbar">
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchInput}
          onChange={handleSearchChange} 
        />
        <button type="submit">Search</button>
      </form>
      <select onChange={handleSort}>
        <option value="asc">Sort by Asc</option>
        <option value="desc">Sort by Desc</option>
      </select>
      <button className='btn'>
        <Link to="/cart" className='link'>Cart</Link>
      </button>
    </nav>
  );
};

export default Navbar;
