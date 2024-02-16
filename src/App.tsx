import { useState, useEffect } from 'react';
import './App.css'

type Currency = {
  code: string,
  name: string
}

type Status = 'idle' | 'pending' | 'error';

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setStatus('pending');

    fetch('https://api.frankfurter.app/currenciez')
      .then((res) => {
        if(res.status !== 200) {
          setStatus('error');
          return Promise.reject(new Error('Fetch error'));
        }
        try {
          return res.json();
        } catch (error) {
          return Promise.reject(new Error('Fetch error, invalid JSON'));
        }
      })
      .then((data) => {
        const structured = Object.keys(data).map(key => ({code: key, name: data[key]}))
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
