import Ajv from "ajv";
import robustFetch from '../utilities/robustFetch';
import { RateData, Rate } from '../types';
import { useEffect } from "react";

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

export default function getRates(from?: string | null, to?: string | null) {
  const triggerFetch = (from: string, to: string, abortSignal: AbortSignal) => {
    return robustFetch(`https://api.frankfurter.app/2024-01-01..2024-01-31?from=${from}&to=${to}`, abortSignal).then((data) => {
      if (!validate(data)) throw new Error('Invalid data structure');
  
      const typeSafeData = data as RateData;
      const structuredData: Rate[] = Object.keys(typeSafeData.rates).map(key => ({date: key, value: typeSafeData.rates[key][to]}));
  
      return structuredData;
    }).catch((error) => {
      console.log(error); // TODO: proper logging
      throw new Error('😤 There was an error and we could not fetch exchange rates from a 3rd party service');
    });
  }

  const abortController = new AbortController();
  const abortSignal = abortController.signal;


  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [from, to]);

  if(!from || !to) throw new Promise(() => {}); // Needed for suspense
  const promise = triggerFetch(from, to, abortSignal);
  return promise;
}