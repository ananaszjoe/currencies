import { useState, useEffect } from 'react';
import Ajv from "ajv";
import './App.css';

const ajv = new Ajv();

const currencyResponseSchema = {
  type: 'object',
  patternProperties: {
    ".*": { "type": "string" }
  },
  additionalProperties: false,
}

const validate = ajv.compile(currencyResponseSchema);

interface CurrencyData {
  [key: string]: string;
}

type Currency = {
  code: string,
  name: string
};

type Status = 'idle' | 'pending' | 'error';

function robustFetch(url: string, abortSignal?: AbortSignal, retries: number = 3, timer: number = 300): Promise<any> {  
  return fetch(url, {signal: abortSignal})
    .then(response => {
      if(!response.ok) {
        if(retries === 0) return Promise.reject(new Error('Fetch error'));

        console.log(`API responded with status ${response.status}, retrying... \n - Attempts left: ${retries} \n - body: \n ${response.body}, \n `);
        return new Promise(resolve => setTimeout(resolve, timer))
          .then(() => robustFetch(url, abortSignal, retries - 1, timer * 2));
      }

      if(response.status === 404 || response.status === 403) {
        console.log('Resource not available');
        throw new Error('Error accessing the resource');
      }

      return response.json().catch(() => {
        console.log('Error parsing JSON');
        throw new Error('Error parsing JSON');
      });
    }).catch(error => {
      if( retries === 0 || error.message === 'Error parsing JSON' || error.message === 'Error accessing the resource') {
        console.log('Fetch failed.', error);
        throw error;
      }
      
      if(abortSignal?.aborted) return new Promise((resolve) => resolve({}));

      console.log(`Retrying due to network error... Attempts left: ${retries}`, error);
      return new Promise(resolve => setTimeout(resolve, timer))
        .then(() => robustFetch(url, abortSignal, retries - 1, timer * 2));
    });
}

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    setStatus('pending');
     
    robustFetch('https://api.frankfurter.app/currencies', signal).then((data) => {      
      if (!validate(data)) throw new Error('Invalid data structure');

      const typeSafeData = data as CurrencyData;
      const structured: Currency[] = Object.keys(typeSafeData).map(key => ({code: key, name: typeSafeData[key] as string}));

      setCurrencies(structured);
      setStatus('idle');
    }).catch(() => {
      setStatus('error');
      setMessage('😤 There was an error and we could not fetch the list of currencies from a 3rd party API');
    });

    // Cleanup
    return () => {
      abortController.abort();
    };
    
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <p className={status === 'error' ? 'error' : 'info'}>{message}</p>
      <p>Currencies:</p>
      {status !== 'pending' && currencies.length === 0 && (
        <p>There are no currencies.</p>
      )}
      {currencies.length > 0 && (
        <ul>
          {currencies.map(entry => (
            <li key={entry.code}>{entry.code} - ({entry.name})</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App
