import { Suspense, useContext, useState } from 'react';
import getCurrencies from '../services/getCurrencies';
import { Currency } from '../types';
import Select from './Select';
import styles from './Toolbar.module.scss';
import { useCurrencyContext } from '../currencyContext';

const currencyResource = getCurrencies();

function ToolbarContent() {
  const {value, setValue} = useCurrencyContext();
  const [ currencyFrom, setCurrencyFrom ] = useState<string>();
  const [ currencyTo, setCurrencyTo ] = useState<string>();
  
  const currencies: Currency[] = currencyResource.read();
  const currencyOptions = currencies?.map(entry => ({key: entry.code, name: entry.name}));
  
  const handleCurrencyFromSelect = (code: string) => {
    setValue({...value, from: code});
    setCurrencyFrom(code);
  }
  const handleCurrencyToSelect = (code: string) => {
    setValue({...value, to: code});
    setCurrencyTo(code);
  }
  
  return (
    <>
      <Select value={currencyFrom} options={currencyOptions} onSelect={handleCurrencyFromSelect} name='Base Currency' />
      <Select value={currencyTo} options={currencyOptions} onSelect={handleCurrencyToSelect} name='Target Currency' />
    </>
    );    
  }
  
  export default function Toolbar() {
    
    return (
      <div className={styles.toolbar}>
        <Suspense fallback={<p>Loading currencies...</p>}>
          <ToolbarContent />
        </Suspense>
      </div>
    )
  }