"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

export interface CartLine {
  product: Product;
  qty: number;
}

type Action =
  | { type: "add"; product: Product; qty: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((l) => l.product.id === action.product.id);
      if (existing) {
        return state.map((l) =>
          l.product.id === action.product.id ? { ...l, qty: l.qty + action.qty } : l,
        );
      }
      return [...state, { product: action.product, qty: action.qty }];
    }
    case "remove":
      return state.filter((l) => l.product.id !== action.id);
    case "setQty":
      if (action.qty <= 0) return state.filter((l) => l.product.id !== action.id);
      return state.map((l) => (l.product.id === action.id ? { ...l, qty: action.qty } : l));
    case "clear":
      return [];
  }
}

interface Toast {
  id: number;
  message: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  bumpKey: number;
  toast: Toast | null;
  add: (product: Product, qty?: number) => void;
  addMany: (products: Product[], message?: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  notify: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const FREE_DELIVERY_THRESHOLD = 5000;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (product: Product, qty = 1) => {
      dispatch({ type: "add", product, qty });
      setBumpKey((k) => k + 1);
      notify(`${product.name} added to cart`);
    },
    [notify],
  );

  const addMany = useCallback(
    (products: Product[], message?: string) => {
      products.forEach((product) => dispatch({ type: "add", product, qty: 1 }));
      setBumpKey((k) => k + 1);
      notify(message ?? `${products.length} items added to cart`);
    },
    [notify],
  );

  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      bumpKey,
      toast,
      add,
      addMany,
      remove,
      setQty,
      clear,
      open,
      close,
      notify,
    };
  }, [lines, isOpen, bumpKey, toast, add, addMany, remove, setQty, clear, open, close, notify]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
