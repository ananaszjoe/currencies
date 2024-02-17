import { useState, useEffect } from 'react';
import Ajv from "ajv";
import { robustFetch } from '../utilities';
import { CurrencyData, Currency } from '../types';

const ajv = new Ajv();

const currencyResponseSchema = {
  type: 'object',
  patternProperties: {
    ".*": { "type": "string" }
  },
  additionalProperties: false,
}

const validate = ajv.compile(currencyResponseSchema);

export default function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    setLoading(true);
     
    robustFetch('https://api.frankfurter.app/currencies', signal).then((data) => {      
      if (!validate(data)) throw new Error('Invalid data structure');

      const typeSafeData = data as CurrencyData;
      const structured: Currency[] = Object.keys(typeSafeData).map(key => ({code: key, name: typeSafeData[key] as string}));

      setCurrencies(structured);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setError('😤 There was an error and we could not fetch the list of currencies from a 3rd party API');
    });

    // Cleanup
    return () => {
      abortController.abort();
    };
    
  }, []);

  return { data: currencies, loading, error };

}