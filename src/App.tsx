import { useState } from 'react';
import './App.css';
import useCurrencies from './hooks/useCurrencies';
import useRates from './hooks/useRates';
import Select from './components/Select';

function App() {
  const [ currencyFrom, setCurrencyFrom ] = useState('');
  const [ currencyTo, setCurrencyTo ] = useState('');
  const { data: currencies, loading: currencyLoading, error: currencyError } = useCurrencies();
  const currencyOptions = currencies?.map(entry => ({key: entry.code, name: entry.name}));

  const { data: rates, loading: ratesLoading, error: ratesError } = useRates(currencyFrom, currencyTo);

  console.log(rates);

  const loading = currencyLoading || ratesLoading;
  const error = currencyError || ratesError;

  const handleCurrencyFromSelect = (code: string) => {
    setCurrencyFrom(code);
  }
  const handleCurrencyToSelect = (code: string) => {
    setCurrencyTo(code);
  }

  return (
    <>
      <h1>Hello</h1>

      {error && !loading && <p className='error'>{error}</p>}
      
      {currencyFrom && currencyTo && <p>{currencyFrom} 👉 {currencyTo}</p>}

      {currencies.length > 0 && (
        <>
          <Select value={currencyFrom} options={currencyOptions} onSelect={handleCurrencyFromSelect} name='Base Currency' />
          <Select value={currencyTo} options={currencyOptions} onSelect={handleCurrencyToSelect} name='Target Currency' />
        </>
      )}
    </>
  )
}

export default App
