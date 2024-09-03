import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GameWrapper from './pages/Game';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { store } from './utils/GameStore';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="game" element={
            <Provider store={store}>
              <GameWrapper />
            </Provider>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
