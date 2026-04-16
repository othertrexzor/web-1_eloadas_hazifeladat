import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Header from './components/Header'
import Footer from './components/Footer'
import TicTacToe from './tictactoe/tictactoe'
import FlipCoin from './coinflip/FlipCoin'
import ReactCrud from './components/ReactCrud'

import './App.css'
import './tictactoe/css/ttt.css'


function App() {

  const [activePage, setActivePage] = useState();

  return (

    <>
      <Header />
      <main>
        <section className='glass-panel hero'>
          <h2>React alkalmazások</h2>
          <div className="spa-menu">
            <button onClick={() => setActivePage("reactcrud")}>
              Játékosok (CRUD)
            </button>
            <button onClick={() => setActivePage("tictactoe")}>
              Tic-Tac-Toe
            </button>
            <button onClick={() => setActivePage("flipcoin")}>
              Flip Coin
            </button>
          </div>
          <div style={{ marginTop: "2rem" }}>
            {activePage === "reactcrud" && <ReactCrud />}
            {activePage === "flipcoin" && <FlipCoin />}
            {activePage === "tictactoe" && <TicTacToe />}
          </div>
        </section>
      </main>
      <Footer />
    </>

  )
}

export default App
