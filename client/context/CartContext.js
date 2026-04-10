import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.id === action.book.id);
      if (existing) {
        return state.map((i) => i.id === action.book.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...state, { ...action.book, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.id);
    case 'UPDATE_QUANTITY':
      if (action.quantity < 1) return state.filter((i) => i.id !== action.id);
      return state.map((i) => i.id === action.id ? { ...i, quantity: action.quantity } : i);
    case 'CLEAR_CART':
      return [];
    case 'HYDRATE':
      return action.items;
    default:
      return state;
  }
}

const STORAGE_KEY = 'pt_cart';

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem       = (book)            => dispatch({ type: 'ADD_ITEM', book });
  const removeItem    = (id)              => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQuantity= (id, quantity)    => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart     = ()               => dispatch({ type: 'CLEAR_CART' });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
