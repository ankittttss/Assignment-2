// src/components/Item/Item.tsx
import React from "react";
import "./Item.css";

// This code defines a React Component Item Which Represents a Single Component/ Card

interface ItemProps {
  id: number;
  title: string;
  price: string;
  thumbnail: string;
  addToCart: () => void;
  isAddedToCart: boolean;
  removeFromCart?: () => void; // Make removeFromCart optional
}

const Item: React.FC<ItemProps> = ({
  id,
  title,
  price,
  thumbnail,
  addToCart,
  isAddedToCart,
  removeFromCart,
}) => {
  return (
    <div className="item">
      <img src={thumbnail} alt={title} />
      <h2>{title}</h2>
      <p>{price}</p>
      {removeFromCart ? (
        <button className="btn remove-button" onClick={removeFromCart}>
          Remove from Cart
        </button>
      ) : (
        <button
          className="btn add-button"
          onClick={addToCart}
          disabled={isAddedToCart}
        >
          {isAddedToCart ? "Added to Cart" : "Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default Item;

// Overall this component represent a shopping card//
