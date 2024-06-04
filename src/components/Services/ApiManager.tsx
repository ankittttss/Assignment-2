import axios from "axios";
import { Item as ItemType } from "../../types/Item";


// improve OOPs
// class Products extends ApiManager{

class ApiManager {
  url = `https://dummyjson.com/products/search`;
  constructor() {
    this.url = "https://dummyjson.com/products/search"; // Use 'url' with lowercase
  }

  getUrl() {
    return this.url;
  }
}

class FetchItemsService extends ApiManager {
  async fetchItems(
    searchQuery: string,
    page: number,
    limit: number,
    sortBy: "asc" | "desc" | "normal"
  ): Promise<{ products: ItemType[]; total: number }> {
    try {
      const response = await axios.get(this.url, {
        params: {
          q: searchQuery,
          limit,
          skip: (page - 1) * limit,
          sort: sortBy,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  }
}

class CartManager extends ApiManager {
  private cartItems: ItemType[] = [];
  private setCartItems: React.Dispatch<React.SetStateAction<number[]>> | null = null;

  constructor() {
      super();
      this.loadCartItemsFromStorage();
  }

  setCartItemsUpdater(setter: React.Dispatch<React.SetStateAction<number[]>>) {
      this.setCartItems = setter;
  }

  private loadCartItemsFromStorage() {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item && item.id) {
              this.cartItems.push(item);
          }
      }
  }

  public handleAddToCart(item: ItemType) {
      if (!this.cartItems.some(cartItem => cartItem.id === item.id)) {
          this.cartItems.push(item);
          localStorage.setItem(item.id.toString(), JSON.stringify(item));

          if (this.setCartItems) {
              this.setCartItems((prevCartItems) => [...prevCartItems, item.id]);
          }
      }
  }

  public getCartItems(): ItemType[] {
      return this.cartItems;
  }

   RemoveFromCart(itemId: number) {
    // Remove item from localStorage
    localStorage.removeItem(itemId.toString());
    // Update the cart items state
    if (this.setCartItems) {
        this.setCartItems((prevCartItems) => prevCartItems.filter(id => id !== itemId));
    }
}

}

const fetch = new FetchItemsService();
const local = new CartManager();
export {fetch,local};
