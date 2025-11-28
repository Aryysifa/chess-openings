import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChessOpeningsExplorer from './pages/chess/ChessOpeningsExplorer';
import BlackjackGuide from './pages/blackjack/BlackjackGuide';
import BlackjackBeginnersGuide from './pages/blackjack/BlackjackBeginnersGuide';
import PokerGuide from './pages/poker/PokerGuide';
import IQTest from './pages/iq-test/IQTest';
import Connect4Guide from './pages/connect4/Connect4Guide';
import CheckersGuide from './pages/checkers/CheckersGuide';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ChessOpeningsExplorer />} />
          <Route path="/poker" element={<PokerGuide />} />
          <Route path="/blackjack" element={<BlackjackGuide />} />
          <Route path="/blackjack/beginners-guide" element={<BlackjackBeginnersGuide />} />
          <Route path="/iq-test" element={<IQTest />} />
          <Route path="/connect4" element={<Connect4Guide />} />
          <Route path="/checkers" element={<CheckersGuide />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;