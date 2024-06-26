// src/components/Cart/Cart.tsx
import React, { useState, useEffect } from 'react';
import Item from '../Item/Item';
import { Item as ItemType } from '../../types/Item';
import './Cart.css';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItemType[]>([]);

  useEffect(() => {
    const items: ItemType[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          items.push(JSON.parse(item));
        }
      }
    }
    setCartItems(items);
  }, []);

  const handleRemoveFromCart = (itemId: number) => {
    // Remove item from localStorage
    localStorage.removeItem(itemId.toString());
    // Update the cart items state
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <Item
              key={item.id}
              {...item}
              addToCart={() => {}}
              isAddedToCart={true}
              removeFromCart={() => handleRemoveFromCart(item.id)}
            />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
