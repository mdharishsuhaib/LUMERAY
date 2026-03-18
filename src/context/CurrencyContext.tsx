import React, { createContext, useContext, useState } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SAR', symbol: '﷼',  name: 'Saudi Riyal' },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export const getCurrency = (code: string): Currency =>
  CURRENCIES.find(c => c.code === code) || CURRENCIES[0];

export const formatAmount = (amount: number, currencyCode: string): string => {
  const currency = getCurrency(currencyCode);
  return `${currency.symbol}${amount.toFixed(2)} ${currency.code}`;
};

interface CurrencyContextType {
  defaultCurrency: string;
  setDefaultCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_KEY = 'lumeray_default_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [defaultCurrency, setDefaultCurrencyState] = useState<string>(() => {
    return localStorage.getItem(CURRENCY_KEY) || 'USD';
  });

  const setDefaultCurrency = (code: string) => {
    localStorage.setItem(CURRENCY_KEY, code);
    setDefaultCurrencyState(code);
  };

  return (
    <CurrencyContext.Provider value={{ defaultCurrency, setDefaultCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
