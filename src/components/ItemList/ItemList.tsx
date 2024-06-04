import React, { useState, useEffect, useCallback } from "react";
import "./ItemList.css";
import InfiniteScrollBar from "../InfiniteScrollBar/InfiniteScrollBar";
import Item from "../Item/Item";
import { Item as ItemType } from "../../types/Item";
import { fetch, local } from "../Services/ApiManager"; // Import the ApiManager for Api Fetching//
import Footer from "../Footer/Footer"; // Import the Footer component

// Define the interface for ItemList props
interface ItemListProps {
  searchQuery: string;
  sortBy: "asc" | "desc" | "normal";
}

// Define the ItemList component
const ItemList: React.FC<ItemListProps> = ({ searchQuery, sortBy }) => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [newSearchQuery, setNewSearchQuery] = useState(searchQuery);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await fetch.fetchItems(
        newSearchQuery,
        page,
        limit,
        sortBy
      );
      let sortedItems = responseData.products;

      if (sortBy === "asc") {
        sortedItems = responseData.products.sort((a, b) => a.price - b.price);
      } else if (sortBy === "desc") {
        sortedItems = responseData.products.sort((a, b) => b.price - a.price);
      }

      setItems((prevItems) => {
        const prevItemIds = new Set(prevItems.map((item) => item.id));
        const newItems = sortedItems.filter(
          (item) => !prevItemIds.has(item.id)
        );
        return [...prevItems, ...newItems];
      });

      const totalItems = responseData.total;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [newSearchQuery, sortBy, page, limit]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setNewSearchQuery(searchQuery);
  }, [searchQuery, sortBy]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setPage(1);
  }, [newSearchQuery, limit]);

  useEffect(() => {
    local.setCartItemsUpdater(setCartItems);

    const initialCartItems = local.getCartItems().map((item) => item.id);
    setCartItems(initialCartItems);
  }, []);

  const handleAddToCart = (item: ItemType) => {
    local.handleAddToCart(item);
  };


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

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1);
    setItems([]);
  };

  return (
    <div className="item-list-container">
      <InfiniteScrollBar
        onLoadMore={handleNextPage}
        hasMore={page < totalPages}
        loading={loading}
      >
        <div className="item-list">
          {items.map((item) => (
            <Item
              key={item.id}
              {...item}
              addToCart={() => handleAddToCart(item)}
              isAddedToCart={cartItems.includes(item.id)}
            />
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </InfiniteScrollBar>
      <Footer
        totalPages={totalPages}
        page={page}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleLimitChange={handleLimitChange}
        limit={limit}
        setPage={setPage}
      />
    </div>
  );
};

export default ItemList;
