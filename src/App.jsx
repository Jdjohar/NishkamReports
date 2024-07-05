import { useState } from 'react'
import Transactions from './components/Transactions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <Transactions />
    </div>
    </>
  )
}

export default App
