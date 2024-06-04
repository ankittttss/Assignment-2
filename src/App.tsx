import React, { useState } from 'react';
import Navbar from '../src/components/NavBar/Navbar';
import ItemList from '../src/components/ItemList/ItemList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from '../src/components/Cart/Cart';
const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "normal">("normal");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sort: "asc" | "desc" | "normal") => {
    setSortBy(sort);
  };

  return (
    <Router>
      <div>
        <Navbar onSearch={handleSearch} onSort={handleSort} />
        <Routes>
          <Route path="/" element={<ItemList searchQuery={searchQuery} sortBy={sortBy} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
