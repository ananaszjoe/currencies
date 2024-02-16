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

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setStatus('pending');

    fetch('https://api.frankfurter.app/currenciez')
      .then((res) => {
        if(res.status !== 200) return Promise.reject(new Error('Fetch error'));
        return res.json();
      })
      .then((data) => {
        if (!validate(data)) throw new Error('Invalid data structure');

        const typeSafeData = data as CurrencyData;
        const structured: Currency[] = Object.keys(typeSafeData).map(key => ({code: key, name: typeSafeData[key] as string}));

        setCurrencies(structured);
        setStatus('idle');
      }).catch((error) => {
        console.error(error);
        setStatus('error');
      });
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <p>status: {status}</p>
      {currencies?.length > 0 && (
        <>
          <br />
          <p>Currencies:</p>
          <ul>
            {currencies.map(entry => (
              <li key={entry.code}>{entry.code} - ({entry.name})</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default App
