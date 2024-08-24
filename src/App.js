import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GameWrapper from './pages/Game';
import Home from './pages/Home';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="game" element={<GameWrapper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
