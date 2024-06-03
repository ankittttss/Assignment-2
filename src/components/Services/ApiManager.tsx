import axios from 'axios';
import { Item as ItemType } from "../../types/Item";

// Class to Mnage the Api Fetching. Code can be reused//
class ApiManager {
  static async fetchItems(searchQuery: string, page: number, limit: number, sortBy: 'asc' | 'desc'): Promise<{ products: ItemType[], total: number }> {
    try {
      const response = await axios.get(`https://dummyjson.com/products/search`, {
        params: {
          q: searchQuery,
          limit,
          skip: (page - 1) * limit,
          sort: sortBy
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }
}

export default ApiManager;
