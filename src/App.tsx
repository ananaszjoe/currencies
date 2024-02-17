import './App.css';
import useCurrencies from './hooks/useCurrencies';

function App() {
  const { data: currencies, loading, error } = useCurrencies();

  return (
    <>
      <h1>Hello</h1>
      {error && !loading && <p className='error'>{error}</p>}
      <p>Currencies:</p>
      {!loading && currencies.length === 0 && (
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
