import React, { useState, useEffect, useCallback } from "react";
import "./ItemList.css";
import InfiniteScrollBar from "../InfiniteScrollBar/InfiniteScrollBar";
import Item from "../Item/Item";
import { Item as ItemType } from "../../types/Item";
import ApiManager from "../Services/ApiManager"; // Import the ApiManager for Api Fetching//

interface ItemListProps {
  searchQuery: string;
  sortBy: "asc" | "desc";
}

const ItemList: React.FC<ItemListProps> = ({ searchQuery, sortBy }) => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [cartItems, setCartItems] = useState<number[]>([]); // Array to store IDs of items in cart
  const [newSearchQuery, setNewSearchQuery] = useState(searchQuery); // State for the new search query

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await ApiManager.fetchItems(
        newSearchQuery,
        page,
        limit,
        sortBy
      ); // Use newSearchQuery instead of searchQuery
      const sortedItems =
        sortBy === "asc"
          ? responseData.products.sort((a, b) => a.price - b.price)
          : responseData.products.sort((a, b) => b.price - a.price);
      setItems((prevItems) => {
        // Avoid duplicates by filtering out items already in the list
        const prevItemIds = new Set(prevItems.map((item) => item.id));
        const newItems = sortedItems.filter(
          (item) => !prevItemIds.has(item.id)
        );
        return [...prevItems, ...newItems];
      });
      console.log(responseData.products)
      const totalItems = responseData.total;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [newSearchQuery, sortBy, page, limit]);

  useEffect(() => {
    setItems([]); // Clear items to avoid displaying old items when search query changes
    setPage(1); // Reset page when search or sorting changes
    setNewSearchQuery(searchQuery); // Update newSearchQuery when searchQuery changes
  }, [searchQuery, sortBy]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    // Reset pagination when search query changes
    setPage(1);
  }, [newSearchQuery,limit]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      // fetchItems()
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1);
    setItems([]); // Clear items to avoid displaying old items when limit changes
  };

  const handleAddToCart = (item: ItemType) => {
    if (!cartItems.includes(item.id)) {
      const newCartItems = [...cartItems, item.id];
      setCartItems(newCartItems);
      localStorage.setItem(item.id.toString(), JSON.stringify(item));
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSearchQuery = event.target.value;
    setPage(1); // Reset page when search query changes
    setItems([]); // Clear items to avoid displaying old items when search query changes
    // Set the new search query
    setNewSearchQuery(newSearchQuery);
  };

  return (
    <div className="item-list-container">
      <input
        type="text"
        value={newSearchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search..."
      />
      <InfiniteScrollBar
        onLoadMore={handleNextPage}
        hasMore={page < totalPages}
        loading={loading}
      >
        <div className="item-list">
          {items.map((item) => (
            <Item
              key={item.id} // Use item.id instead of Math.random()
              {...item}
              addToCart={() => handleAddToCart(item)}
              isAddedToCart={cartItems.includes(item.id)}
            />
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </InfiniteScrollBar>
      <div className="footer">
        <div className="pagination-limit-container">
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                disabled={page === i + 1}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
          <div className="limit">
            <label htmlFor="limit-select">Limit:</label>
            <select
              id="limit-select"
              value={limit}
              onChange={handleLimitChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
