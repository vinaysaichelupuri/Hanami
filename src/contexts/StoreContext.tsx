
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  isNew: boolean;
  inStock: boolean;
  description: string;
  sizes: string[];
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  searchQuery: string;
  loading: boolean;
}

type StoreAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: StoreState = {
  products: [],
  cart: [],
  wishlist: [],
  searchQuery: '',
  loading: false,
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id && item.size === action.payload.size
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: 1, size: action.payload.size }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST':
      const isInWishlist = state.wishlist.includes(action.payload);
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload],
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
} | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hanami-cart');
    const savedWishlist = localStorage.getItem('hanami-wishlist');
    
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      cartItems.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, size: item.size } });
        if (item.quantity > 1) {
          dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: item.quantity } });
        }
      });
    }
    
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist);
      wishlistIds.forEach((id: number) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
      });
    }
  }, []);

  // Save to localStorage when cart or wishlist changes
  useEffect(() => {
    localStorage.setItem('hanami-cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('hanami-wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
