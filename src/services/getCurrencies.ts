import Ajv from "ajv";
import robustFetch from '../utilities/robustFetch';
import wrapForSuspense from '../utilities/wrapForSuspense';
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

export default function getCurrencies() {
  const triggerFetch = () => {
    return robustFetch('https://api.frankfurter.app/currencies').then((data) => { // TODO: pass abort signal
      if (!validate(data)) throw new Error('Invalid data structure');
  
      const typeSafeData = data as CurrencyData;
      const structuredData: Currency[] = Object.keys(typeSafeData).map(key => ({code: key, name: typeSafeData[key]}));
  
      return structuredData;
    }).catch((error) => {
      console.log(error); // TODO: proper logging
      throw new Error('😤 There was an error and we could not fetch the list of currencies from a 3rd party service');
    });
  }
  const promise = triggerFetch();

  return wrapForSuspense(promise);
}