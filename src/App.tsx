import { useState } from 'react';
import './App.css';
import useCurrencies from './hooks/useCurrencies';
import Select from './components/Select';

function App() {
  const [ selectedCurrency, setSelectedCurrency ] = useState('');
  const { data: currencies, loading, error } = useCurrencies();
  const currencyOptions = currencies?.map(entry => ({key: entry.code, name: entry.name}));

  const handleCurrencySelect = (code: string) => {
    setSelectedCurrency(code);
  }

  return (
    <>
      <h1>Hello</h1>

      {error && !loading && <p className='error'>{error}</p>}
      
      {selectedCurrency && <p>Selected currency is {selectedCurrency}</p>}

      {currencies.length > 0 && (
        <Select value={selectedCurrency} options={currencyOptions} onSelect={handleCurrencySelect} name='Select a currency' />
      )}
    </>
  )
}

export default App
