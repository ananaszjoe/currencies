import { createContext, useContext } from 'react';

export type currencyFromTo = {from: string | null, to: string | null}

// Define the context type
type CurrencyContextType = {
  value: currencyFromTo;
  setValue: React.Dispatch<React.SetStateAction<currencyFromTo>>;
};

// Create the context with initial value null
export const CurrencyContext = createContext<CurrencyContextType | null>(null);

// Custom hook to access the context
export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within a CurrencyContextProvider');
  }
  return context;
};
