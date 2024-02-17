import { useState, useEffect } from 'react';
import Ajv from "ajv";
import { robustFetch } from '../utilities';
import { RateData, Rate } from '../types';

const ajv = new Ajv({verbose: true, allErrors: true});

const ratesResponseSchema = {
  type: 'object',
  properties: {
    rates: {
      type: 'object',
      patternProperties: {
        '\\d{4}-\\d{2}-\\d{2}': {
          type: 'object',
          patternProperties: {
            '[A-Z]{3}': {
              type: 'number'
            }
          },
          additionalProperties: false,
        }
      },
      additionalProperties: false,
    },
  },
  required: ['rates'],
  additionalProperties: true,
}

const validate = ajv.compile(ratesResponseSchema);

export default function useRates(from: string, to: string) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    setLoading(true);
    
    if(from && to) {
      robustFetch(`https://api.frankfurter.app/2024-01-01..2024-01-31?from=${from}&to=${to}`, signal).then((data) => {
        if (!validate(data)) throw new Error('Invalid data structure');
  
        const typeSafeData = data as RateData;
        const structuredData: Rate[] = Object.keys(typeSafeData.rates).map(key => ({date: key, value: typeSafeData.rates[key][to]}));
  
        setData(structuredData);
        setLoading(false);
      }).catch((e) => {
        console.log(e);
        
        setLoading(false);
        setError('😤 There was an error and we could not fetch the specified currency rates from a 3rd party API');
      });
    }

    // Cleanup
    return () => {
      abortController.abort();
    };
    
  }, [from, to]);

  return { data, loading, error };

}