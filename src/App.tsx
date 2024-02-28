import { useState, Suspense } from 'react';
import styles from './App.module.scss';
import Toolbar from './components/Toolbar';
import Header from './components/Header';
import Summary from './components/Summary';
import { CurrencyContext, currencyFromTo } from './currencyContext';

function App() {
  const [value, setValue] = useState<currencyFromTo>({from: null, to: null});

  return (
    <CurrencyContext.Provider value={{value, setValue}}>
      <div className={styles.app}>
        <main className={styles.main}>
          <Header />
          <Suspense fallback={<p>Currencies......</p>}>
            <Toolbar />
          </Suspense>
          <Summary />
        </main>
      </div>
    </CurrencyContext.Provider>
  )
}

export default App
