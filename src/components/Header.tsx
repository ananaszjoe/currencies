import { useCurrencyContext } from "../currencyContext";

export default function Header() {
  const {value: {from, to}} = useCurrencyContext();
  console.log(from);
  

  return (
    <>
      <h1>Hello</h1>
            
      {from && to && <p>{from} 👉 {to}</p>}
    </>
  )
}