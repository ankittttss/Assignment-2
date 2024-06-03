import React, { useState, useEffect, useCallback } from "react";
import "./ItemList.css";
import InfiniteScrollBar from "../InfiniteScrollBar/InfiniteScrollBar";
import Item from "../Item/Item";
import { Item as ItemType } from "../../types/Item";
import ApiManager from "../Services/ApiManager"; // Import the ApiManager

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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await ApiManager.fetchItems(searchQuery, page, limit, sortBy);
      const sortedItems = sortBy === 'asc' ? responseData.products.sort((a, b) => a.price - b.price) : responseData.products.sort((a, b) => b.price - a.price);
      setItems((prevItems) => {
        // Avoid duplicates by creating a new set of item IDs
        const prevItemIds = new Set(prevItems.map(item => item.id));
        const newItems = sortedItems.filter(item => !prevItemIds.has(item.id));
        return [...prevItems, ...newItems];
      });
      console.log(responseData.products);
      const totalItems = responseData.total;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, page, limit]);

  useEffect(() => {
    setItems([]); // Clear items to avoid displaying old items when search query changes
    setPage(1); // Reset page when search or sorting changes
  }, [searchQuery, sortBy]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
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

  return (
    <div>
      <div className="item-list-container">
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
      </div>
      <div className="footer">
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
          <span>Limit:</span>
          <button onClick={() => handleLimitChange(10)} disabled={limit === 10}>
            10
          </button>
          <button onClick={() => handleLimitChange(20)} disabled={limit === 20}>
            20
          </button>
          <button onClick={() => handleLimitChange(30)} disabled={limit === 30}>
            30
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
