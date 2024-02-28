import { Suspense, use } from "react";
import Graph from './Graph';
import getRates from "../services/getRates";
import { useCurrencyContext } from "../currencyContext";


function SummaryContent() {
  const {value: {from, to}} = useCurrencyContext();
  const ratesResource = use(getRates(from, to));
  
  return (
    <Graph rates={ratesResource} />
  )
}

export default function Summary() {

  return (
    <>
      <p>rates</p>
      <Suspense fallback={<p>Loading rates...</p>}>
        <SummaryContent />
      </Suspense>
    </>
  )

}